#!/usr/bin/env node
// GOV-001 — Local Roadmap Execution Dashboard server.
// Node 18+, zero external dependencies (node: builtins only).
// Listens on 127.0.0.1 only. Reads roadmap.md read-only. Writes runtime
// evidence to roadmap-status.md (ledger), logs/, comments/.

import http from 'node:http';
import { URL } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';
import crypto from 'node:crypto';

// ---------------------------------------------------------------------------
// Paths — resolved relative to this file's location so the server can be
// started from anywhere as `node tools/roadmap-dashboard/server.mjs`.
// ---------------------------------------------------------------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..', '..');
const ROADMAP_PATH = path.join(PROJECT_ROOT, 'roadmap.md');
const LEDGER_PATH = path.join(PROJECT_ROOT, 'roadmap-status.md');
const LOGS_DIR = path.join(PROJECT_ROOT, 'logs');
const COMMENTS_DIR = path.join(PROJECT_ROOT, 'comments');
const INDEX_HTML_PATH = path.join(__dirname, 'index.html');
const CODEX_CONFIG_PATH = path.join(__dirname, 'codex.config.json');

const HOST = '127.0.0.1';
const PORT = Number(process.env.PORT) || 4570;

// ---------------------------------------------------------------------------
// Allowlists (hard requirement: explicit allowlist for models and runners)
// ---------------------------------------------------------------------------
const CLAUDE_MODEL_ALLOWLIST = Object.freeze([
  'claude-fable-5',
  'claude-opus-4-8',
  'claude-sonnet-5',
]);
const RUNNER_ALLOWLIST = Object.freeze(['claude', 'codex']);

const TICKET_ID_PATTERN = /^[A-Z]+-\d{3}$/;

// ---------------------------------------------------------------------------
// Small utilities
// ---------------------------------------------------------------------------
function nowIso() {
  return new Date().toISOString();
}

function tsForFilename(d = new Date()) {
  // Filesystem-safe timestamp: 2026-07-17T12-34-56-789Z
  return d.toISOString().replace(/[:.]/g, '-');
}

function jsonResponse(res, statusCode, obj) {
  const body = JSON.stringify(obj, null, 2);
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(body),
    'Cache-Control': 'no-store',
  });
  res.end(body);
}

function errorResponse(res, statusCode, message, extra = {}) {
  jsonResponse(res, statusCode, { ok: false, error: message, ...extra });
}

async function readFileSafe(p, fallback = null) {
  try {
    return await fsp.readFile(p, 'utf8');
  } catch (err) {
    if (err.code === 'ENOENT') return fallback;
    throw err;
  }
}

/**
 * Validate a ticket id both against the required pattern and prevent any
 * path traversal when the id is later used to build file paths (logs,
 * comments). Returns true only for safe, well-formed ids.
 */
function isValidTicketId(id) {
  if (typeof id !== 'string') return false;
  if (!TICKET_ID_PATTERN.test(id)) return false;
  // Defense in depth against traversal even though the pattern already
  // excludes '/', '\\', '.', etc.
  if (id.includes('..') || id.includes('/') || id.includes('\\')) return false;
  return true;
}

/** Resolve a path inside `base` from an untrusted `name`, rejecting escape. */
function safeJoin(base, name) {
  const resolved = path.resolve(base, name);
  const baseResolved = path.resolve(base) + path.sep;
  if (!resolved.startsWith(baseResolved)) {
    throw new Error('path traversal rejected');
  }
  return resolved;
}

// ---------------------------------------------------------------------------
// roadmap.md parsing (READ ONLY — this module must never write to it)
// ---------------------------------------------------------------------------

/**
 * Parse roadmap.md into a list of ticket objects. Tickets are level-2
 * headings: `## <TICKET-ID> — <Title>` followed by markdown list items
 * (`- Key: value`) until the next heading (level 1, 2, or thematic break
 * followed by heading). We only ever read this file; no mutation.
 */
function parseRoadmap(markdown) {
  const lines = markdown.split(/\r?\n/);
  const tickets = [];
  const headingRe = /^##\s+([A-Z]+-\d{3})\s+—\s+(.+?)\s*$/;
  let current = null;

  const pushCurrent = () => {
    if (current) {
      tickets.push(finalizeTicket(current));
      current = null;
    }
  };

  for (const rawLine of lines) {
    const line = rawLine;
    const headingMatch = line.match(headingRe);
    if (headingMatch) {
      pushCurrent();
      current = {
        id: headingMatch[1],
        title: headingMatch[2].trim(),
        fields: {},
        order: tickets.length,
      };
      continue;
    }
    if (!current) continue;
    // Stop collecting fields for the current ticket at the next heading of
    // any level (## already handled above) or a thematic break; list items
    // are the only content we parse.
    const listItemMatch = line.match(/^-\s+([^:]+):\s*(.*)$/);
    if (listItemMatch) {
      const key = listItemMatch[1].trim();
      const value = listItemMatch[2].trim();
      // Some fields wrap; append if the key repeats (rare) by concatenation.
      if (current.fields[key] !== undefined) {
        current.fields[key] += ' ' + value;
      } else {
        current.fields[key] = value;
      }
    }
  }
  pushCurrent();
  return tickets;
}

function parseDependencies(depsRaw) {
  if (!depsRaw) return [];
  const trimmed = depsRaw.trim();
  if (/^none$/i.test(trimmed)) return [];
  // Formats seen: "[GOV-001]", "[APP-006, APP-008]", "none"
  const bracketMatch = trimmed.match(/\[([^\]]*)\]/);
  const inner = bracketMatch ? bracketMatch[1] : trimmed;
  return inner
    .split(',')
    .map((s) => s.trim())
    .filter((s) => TICKET_ID_PATTERN.test(s));
}

// FIX-003: tickets whose "Recommended model" starts with "human" (case
// insensitive, after trimming) are human/business tasks, not agent tickets
// (e.g. DIS-001/002/003: "human (Management/Advisor) — not an agent task").
// They must never be launchable via /api/execute and the UI must not offer
// a runner/model/Execute control for them.
function isHumanRecommendedModel(recommendedModel) {
  if (typeof recommendedModel !== 'string') return false;
  return /^human/i.test(recommendedModel.trim());
}

function finalizeTicket(t) {
  const f = t.fields;
  const recommendedModel = f['Recommended model'] || 'unspecified';
  return {
    id: t.id,
    title: t.title,
    statusBaseline: f['Status baseline'] || 'unknown',
    recommendedModel,
    isHumanTask: isHumanRecommendedModel(recommendedModel),
    dependencies: parseDependencies(f['Dependencies']),
    objective: f['Objective'] || '',
    scope: f['Scope'] || '',
    filesAllowed: f['Files allowed to change'] || '',
    verificationCommands: f['Verification commands'] || '',
    acceptanceCriteria: f['Acceptance criteria'] || '',
    order: t.order,
  };
}

function truncate(str, max = 220) {
  if (!str) return '';
  if (str.length <= max) return str;
  return str.slice(0, max - 1).trimEnd() + '…';
}

function normalizeBlockerType(value) {
  if (typeof value !== 'string') return '';
  const trimmed = value.trim();
  return trimmed || '';
}

function blockerTypeFromEntry(entry) {
  const explicit = normalizeBlockerType(entry && entry.blockerType);
  if (explicit) return explicit;
  const message = typeof (entry && entry.message) === 'string' ? entry.message.toLowerCase() : '';
  if (message.includes('external verification')) return 'blocked-external-verification';
  return '';
}

let roadmapCache = { mtimeMs: -1, tickets: [], text: '' };

async function loadRoadmap() {
  const stat = await fsp.stat(ROADMAP_PATH);
  if (stat.mtimeMs === roadmapCache.mtimeMs) return roadmapCache;
  // Explicit READ-ONLY open: 'r' flag, never write.
  const text = await fsp.readFile(ROADMAP_PATH, { encoding: 'utf8', flag: 'r' });
  const tickets = parseRoadmap(text);
  roadmapCache = { mtimeMs: stat.mtimeMs, tickets, text };
  return roadmapCache;
}

// ---------------------------------------------------------------------------
// Ledger (roadmap-status.md) — runtime source of truth.
// Append-only history; "current state" is derived by folding entries in
// order. Atomic writes via temp file + rename.
// ---------------------------------------------------------------------------

const LEDGER_HEADER = `# Roadmap Execution Ledger
This file is the runtime source of truth for ticket execution state.
Generated and maintained by tools/roadmap-dashboard/server.mjs.
Entries are appended, never rewritten in place. Do not hand-edit while the
dashboard server is running (writes are atomic but not lock-coordinated
with external editors).

Entry format (one JSON object per fenced block, in order):
`;

/**
 * Each ledger entry:
 * {
 *   timestamp, ticket, event: 'queued'|'in_progress'|'completed'|'blocked'|'failed',
 *   runner, model, message, logFile
 * }
 */
async function readLedgerEntries() {
  const text = await readFileSafe(LEDGER_PATH, '');
  if (!text) return [];
  const entries = [];
  const blockRe = /```json\n([\s\S]*?)\n```/g;
  let m;
  while ((m = blockRe.exec(text)) !== null) {
    try {
      entries.push(JSON.parse(m[1]));
    } catch {
      // Skip malformed blocks rather than crash the dashboard.
    }
  }
  return entries;
}

async function appendLedgerEntry(entry) {
  const text = await readFileSafe(LEDGER_PATH, '');
  const body = text === null || text === '' ? LEDGER_HEADER : text;
  const block = '\n```json\n' + JSON.stringify(entry, null, 2) + '\n```\n';
  const newText = body + block;
  await atomicWriteFile(LEDGER_PATH, newText);
  return entry;
}

async function atomicWriteFile(targetPath, content) {
  const dir = path.dirname(targetPath);
  const tmpPath = path.join(
    dir,
    `.${path.basename(targetPath)}.tmp-${process.pid}-${crypto.randomUUID()}`
  );
  await fsp.writeFile(tmpPath, content, 'utf8');
  await fsp.rename(tmpPath, targetPath);
}

/**
 * Fold ledger entries into current per-ticket state.
 * Returns Map<ticketId, { state, lastEntry, history: [...] }>
 * state in: 'pending' | 'in_progress' | 'completed' | 'blocked' | 'failed'
 */
function foldLedger(entries) {
  const byTicket = new Map();
  for (const e of entries) {
    if (!e || !e.ticket) continue;
    if (!byTicket.has(e.ticket)) {
      byTicket.set(e.ticket, { state: 'pending', blockerType: '', lastEntry: null, history: [] });
    }
    const rec = byTicket.get(e.ticket);
    rec.history.push(e);
    rec.lastEntry = e;
    const entryBlockerType = blockerTypeFromEntry(e);
    if (entryBlockerType) {
      rec.blockerType = entryBlockerType;
    }
    if (e.event === 'queued') rec.state = 'pending';
    else if (e.event === 'in_progress') rec.state = 'in_progress';
    else if (e.event === 'completed') {
      rec.state = 'completed';
      rec.blockerType = '';
    } else if (e.event === 'blocked') {
      rec.state = 'blocked';
    }
    else if (e.event === 'failed') rec.state = 'failed';
    // FIX-003: 'note' entries are informational by default (do not change
    // state) EXCEPT when they carry an explicit `resultingState` field —
    // used for transparent ledger corrections (e.g. undoing an accidental
    // in_progress launch) without silently overwriting/deleting history.
    else if (e.event === 'note' && typeof e.resultingState === 'string') {
      const allowed = ['pending', 'in_progress', 'completed', 'blocked', 'failed'];
      if (allowed.includes(e.resultingState)) rec.state = e.resultingState;
    }
  }
  return byTicket;
}

function isTicketCompleted(ledgerState, ticketId) {
  const rec = ledgerState.get(ticketId);
  return !!rec && rec.state === 'completed';
}

function hasActiveRun(ledgerState, ticketId) {
  const rec = ledgerState.get(ticketId);
  return !!rec && rec.state === 'in_progress';
}

// ---------------------------------------------------------------------------
// Comments (comments/<TICKET>.jsonl) — one JSON object per line.
// ---------------------------------------------------------------------------

function commentsPathFor(ticketId) {
  return safeJoin(COMMENTS_DIR, `${ticketId}.jsonl`);
}

async function readComments(ticketId) {
  const p = commentsPathFor(ticketId);
  const text = await readFileSafe(p, '');
  if (!text) return [];
  return text
    .split(/\r?\n/)
    .filter((l) => l.trim().length > 0)
    .map((l) => {
      try {
        return JSON.parse(l);
      } catch {
        return { raw: l, parseError: true };
      }
    });
}

async function appendComment(ticketId, comment) {
  await fsp.mkdir(COMMENTS_DIR, { recursive: true });
  const p = commentsPathFor(ticketId);
  const line = JSON.stringify(comment) + '\n';
  await fsp.appendFile(p, line, 'utf8');
  return comment;
}

// ---------------------------------------------------------------------------
// Executor prompt generation
// ---------------------------------------------------------------------------

function buildTicketPrompt(ticketId) {
  return [
    `You are an executor agent for the Panel-Ops project. Implement ticket ${ticketId} exactly as specified.`,
    '',
    'MANDATORY steps before writing any code:',
    `1. Read roadmap.md and find the exact ticket heading "## ${ticketId} — ...". That ticket text is binding.`,
    `2. Read comments/${ticketId}.jsonl if it exists. Human comments there are binding and override defaults.`,
    '3. Respect the scope, dependencies, and architectural invariants listed under the ticket, and the global invariants at the top of roadmap.md.',
    '',
    'EXECUTION RULES:',
    `- Implement only the assigned ticket (${ticketId}). Do not touch files outside "Files allowed to change" for this ticket.`,
    '- Never edit roadmap.md under any circumstance — it is read-only for executors.',
    '- Run the verification commands listed in the ticket and capture their output.',
    `- On completion: update roadmap-status.md (the runtime ledger) to reflect completion, and append a JSON line to comments/${ticketId}.jsonl with fields {timestamp (ISO-8601), author, type: "completion", message} summarizing evidence.`,
    `- If blocked (missing dependency, ambiguous spec, missing credentials, etc.): update roadmap-status.md to reflect the blocked state, and append a JSON line to comments/${ticketId}.jsonl with {timestamp, author, type: "blocked", message} explaining exactly why and what is needed to unblock.`,
    '- Do not invent requirements, formats, or values that are not present in the ticket, referenced docs, or binding comments.',
    '',
    `Begin now with ticket ${ticketId}.`,
  ].join('\n');
}

// ---------------------------------------------------------------------------
// Active runs tracking (in-memory, one active run per ticket, enforced also
// via ledger state so it is robust across server restarts).
// ---------------------------------------------------------------------------

const activeRuns = new Map(); // ticketId -> { proc, startedAt, logPath, runner, model }

// ---------------------------------------------------------------------------
// Codex adapter configuration
// ---------------------------------------------------------------------------

async function loadCodexConfig() {
  const text = await readFileSafe(CODEX_CONFIG_PATH, null);
  if (!text) return null;
  try {
    const cfg = JSON.parse(text);
    if (!cfg || typeof cfg.command !== 'string' || !cfg.command.trim()) return null;
    if (!Array.isArray(cfg.args)) cfg.args = [];
    return cfg;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Execution launch
// ---------------------------------------------------------------------------

async function launchExecution({ ticketId, runner, model }) {
  await fsp.mkdir(LOGS_DIR, { recursive: true });
  const logFileName = `${ticketId}-${tsForFilename()}.log`;
  const logPath = path.join(LOGS_DIR, logFileName);
  const logStream = fs.createWriteStream(logPath, { flags: 'a' });

  const prompt = buildTicketPrompt(ticketId);

  let child;
  if (runner === 'claude') {
    logStream.write(
      `[dashboard] launching claude runner ticket=${ticketId} model=${model} at ${nowIso()}\n`
    );
    child = spawn(
      'claude',
      [
        '--model',
        model,
        '-p',
        prompt,
        '--output-format',
        'stream-json',
        '--verbose',
        '--permission-mode',
        'acceptEdits',
      ],
      {
        cwd: PROJECT_ROOT,
        stdio: ['ignore', 'pipe', 'pipe'],
        shell: false,
      }
    );
  } else if (runner === 'codex') {
    const cfg = await loadCodexConfig();
    if (!cfg) {
      logStream.write(
        `[dashboard] Codex runner requested but not configured. Create tools/roadmap-dashboard/codex.config.json with {"command": "...", "args": [...]}. Blocked at ${nowIso()}\n`
      );
      logStream.end();
      return {
        blocked: true,
        message:
          'Codex executor is not configured. Create tools/roadmap-dashboard/codex.config.json ' +
          'with {"command": "<executable>", "args": ["..."]} to enable it. Codex is never passed to claude --model.',
        logFile: logFileName,
      };
    }
    logStream.write(
      `[dashboard] launching codex runner ticket=${ticketId} command=${cfg.command} at ${nowIso()}\n`
    );
    child = spawn(cfg.command, [...cfg.args, prompt], {
      cwd: PROJECT_ROOT,
      stdio: ['ignore', 'pipe', 'pipe'],
      shell: false,
    });
  } else {
    throw new Error(`unsupported runner: ${runner}`);
  }

  child.stdout.on('data', (chunk) => logStream.write(chunk));
  child.stderr.on('data', (chunk) => logStream.write(chunk));

  activeRuns.set(ticketId, {
    proc: child,
    startedAt: nowIso(),
    logPath,
    logFileName,
    runner,
    model,
  });

  child.on('error', async (err) => {
    logStream.write(`\n[dashboard] process error: ${err.message}\n`);
    logStream.end();
    activeRuns.delete(ticketId);
    await appendLedgerEntry({
      timestamp: nowIso(),
      ticket: ticketId,
      event: 'failed',
      runner,
      model: model || null,
      message: `Executor process failed to start: ${err.message}`,
      logFile: logFileName,
    });
  });

  child.on('exit', async (code, signal) => {
    logStream.write(
      `\n[dashboard] process exited code=${code} signal=${signal} at ${nowIso()}\n`
    );
    logStream.end();
    activeRuns.delete(ticketId);

    // The executor is instructed to update the ledger itself on
    // completion/blockage. As a safety net, if it exits non-zero and never
    // wrote a terminal ledger entry for this run, record a failed entry so
    // the ticket does not appear silently stuck "in_progress" forever.
    const entries = await readLedgerEntries();
    const folded = foldLedger(entries);
    const rec = folded.get(ticketId);
    const stillInProgress = !rec || rec.state === 'in_progress';
    if (stillInProgress) {
      await appendLedgerEntry({
        timestamp: nowIso(),
        ticket: ticketId,
        event: code === 0 ? 'blocked' : 'failed',
        runner,
        model: model || null,
        message:
          code === 0
            ? 'Executor process exited cleanly but did not report a terminal ledger state; marked blocked for review.'
            : `Executor process exited with code=${code} signal=${signal} without reporting a terminal ledger state.`,
        logFile: logFileName,
      });
    }
  });

  return { blocked: false, logFile: logFileName };
}

// ---------------------------------------------------------------------------
// HTTP handlers
// ---------------------------------------------------------------------------

async function handleGetTickets(req, res) {
  const { tickets } = await loadRoadmap();
  const entries = await readLedgerEntries();
  const folded = foldLedger(entries);

  const cards = tickets.map((t) => {
    const rec = folded.get(t.id);
    const state = rec ? rec.state : 'pending';
    const depsStatus = t.dependencies.map((depId) => ({
      id: depId,
      completed: isTicketCompleted(folded, depId),
    }));
    return {
      id: t.id,
      title: t.title,
      objective: t.objective,
      description: truncate(t.objective, 220),
      recommendedModel: t.recommendedModel,
      isHumanTask: t.isHumanTask,
      statusBaseline: t.statusBaseline,
      dependencies: depsStatus,
      runtimeState: mapStateToColumn(state),
      rawState: state,
      blockerType: rec ? rec.blockerType || '' : '',
      hasActiveRun: activeRuns.has(t.id),
      lastEntry: rec ? rec.lastEntry : null,
      order: t.order,
    };
  });

  jsonResponse(res, 200, { ok: true, tickets: cards, count: cards.length });
}

function mapStateToColumn(state) {
  switch (state) {
    case 'in_progress':
      return 'In Progress';
    case 'completed':
      return 'Completed';
    case 'blocked':
    case 'failed':
      return 'Blocked';
    case 'pending':
    default:
      return 'To Do';
  }
}

async function handleGetAllowlists(req, res) {
  jsonResponse(res, 200, {
    ok: true,
    models: CLAUDE_MODEL_ALLOWLIST,
    runners: RUNNER_ALLOWLIST,
  });
}

async function handleGetLog(req, res, url) {
  const ticketId = url.searchParams.get('ticket');
  const logFile = url.searchParams.get('file');
  if (!isValidTicketId(ticketId)) {
    return errorResponse(res, 400, 'invalid or missing ticket id');
  }
  if (!logFile || typeof logFile !== 'string') {
    return errorResponse(res, 400, 'missing log file name');
  }
  let logPath;
  try {
    logPath = safeJoin(LOGS_DIR, logFile);
  } catch {
    return errorResponse(res, 400, 'invalid log file path');
  }
  // Extra guard: log file must start with the ticket id prefix.
  if (!path.basename(logFile).startsWith(`${ticketId}-`)) {
    return errorResponse(res, 400, 'log file does not belong to ticket');
  }
  const content = await readFileSafe(logPath, null);
  if (content === null) {
    return errorResponse(res, 404, 'log not found');
  }
  res.writeHead(200, {
    'Content-Type': 'text/plain; charset=utf-8',
    'Cache-Control': 'no-store',
  });
  res.end(content);
}

async function handleListLogs(req, res, url) {
  const ticketId = url.searchParams.get('ticket');
  if (!isValidTicketId(ticketId)) {
    return errorResponse(res, 400, 'invalid or missing ticket id');
  }
  await fsp.mkdir(LOGS_DIR, { recursive: true });
  const files = await fsp.readdir(LOGS_DIR);
  const matching = files
    .filter((f) => f.startsWith(`${ticketId}-`) && f.endsWith('.log'))
    .sort()
    .reverse();
  jsonResponse(res, 200, { ok: true, logs: matching });
}

async function handleGetComments(req, res, url) {
  const ticketId = url.searchParams.get('ticket');
  if (!isValidTicketId(ticketId)) {
    return errorResponse(res, 400, 'invalid or missing ticket id');
  }
  const comments = await readComments(ticketId);
  jsonResponse(res, 200, { ok: true, ticket: ticketId, comments });
}

async function handlePostComment(req, res, body) {
  let payload;
  try {
    payload = JSON.parse(body || '{}');
  } catch {
    return errorResponse(res, 400, 'invalid JSON body');
  }
  const ticketId = payload.ticket;
  if (!isValidTicketId(ticketId)) {
    return errorResponse(res, 400, 'invalid or missing ticket id');
  }
  const { tickets } = await loadRoadmap();
  if (!tickets.some((t) => t.id === ticketId)) {
    return errorResponse(res, 404, `ticket ${ticketId} not found in roadmap.md`);
  }
  const message = typeof payload.message === 'string' ? payload.message.trim() : '';
  if (!message) {
    return errorResponse(res, 400, 'message is required');
  }
  const type = ['note', 'completion', 'blocked'].includes(payload.type) ? payload.type : 'note';
  const author = typeof payload.author === 'string' && payload.author.trim()
    ? payload.author.trim()
    : 'dashboard-user';

  const comment = {
    timestamp: nowIso(),
    author,
    type,
    message,
  };
  await appendComment(ticketId, comment);
  jsonResponse(res, 201, { ok: true, comment });
}

async function handleExecute(req, res, body) {
  let payload;
  try {
    payload = JSON.parse(body || '{}');
  } catch {
    return errorResponse(res, 400, 'invalid JSON body');
  }

  const ticketId = payload.ticket;
  const runner = payload.runner;
  const model = payload.model;

  // --- Validation chain -----------------------------------------------
  if (!isValidTicketId(ticketId)) {
    return errorResponse(res, 400, 'invalid ticket id format (expected e.g. GOV-001)');
  }

  const { tickets } = await loadRoadmap();
  const ticket = tickets.find((t) => t.id === ticketId);
  if (!ticket) {
    return errorResponse(res, 404, `ticket ${ticketId} does not exist in roadmap.md`);
  }

  // FIX-003: human/business tickets (Recommended model starts with "human")
  // are never agent-executable. Reject before touching runner/model/
  // dependency logic so the message is unambiguous regardless of what the
  // caller passed for runner/model.
  if (ticket.isHumanTask) {
    return errorResponse(
      res,
      422,
      `${ticketId} is a human/business task, not an agent ticket. Mark progress manually in roadmap-status.md.`,
      { isHumanTask: true }
    );
  }

  // GOV-002: reject relaunch of blocked-external-verification tickets before
  // any runner/model/dependency logic, mirroring FIX-003's isHumanTask gate
  // placement above — the blocker classification must win regardless of
  // what the caller passed for runner/model.
  const entries = await readLedgerEntries();
  const folded = foldLedger(entries);
  const rec = folded.get(ticketId);
  const currentState = rec ? rec.state : 'pending';
  const blockerType = rec ? rec.blockerType || '' : '';
  const humanAck = payload.humanAck === true;
  const ackReason = typeof payload.ackReason === 'string' ? payload.ackReason.trim() : '';
  const ackAuthor = typeof payload.author === 'string' && payload.author.trim()
    ? payload.author.trim()
    : 'human';

  if (currentState === 'blocked' && blockerType === 'blocked-external-verification') {
    if (!humanAck) {
      return errorResponse(
        res,
        412,
        'blocked pending external verification — relaunching will not help; a human must confirm the missing external condition is now available.'
      );
    }
    if (!ackReason) {
      return errorResponse(
        res,
        412,
        'ackReason is required when humanAck is true for blocked-external-verification tickets'
      );
    }
    await appendLedgerEntry({
      timestamp: nowIso(),
      ticket: ticketId,
      event: 'note',
      runner: null,
      model: null,
      message: `Human acknowledgment by ${ackAuthor}: ${ackReason}`,
      logFile: null,
      blockerType: 'blocked-external-verification',
    });
  }

  if (!RUNNER_ALLOWLIST.includes(runner)) {
    return errorResponse(res, 400, `runner not allowlisted: ${String(runner)}`);
  }

  if (runner === 'claude') {
    if (!CLAUDE_MODEL_ALLOWLIST.includes(model)) {
      return errorResponse(
        res,
        400,
        `model not allowlisted for claude runner: ${String(model)}`,
        { allowlist: CLAUDE_MODEL_ALLOWLIST }
      );
    }
  }

  if (currentState !== 'pending' && currentState !== 'blocked' && currentState !== 'failed') {
    return errorResponse(
      res,
      409,
      `ticket ${ticketId} is not eligible for execution (current state: ${currentState})`
    );
  }

  if (hasActiveRun(folded, ticketId) || activeRuns.has(ticketId)) {
    return errorResponse(res, 409, `ticket ${ticketId} already has an active run`);
  }

  const incompleteDeps = ticket.dependencies.filter((d) => !isTicketCompleted(folded, d));
  if (incompleteDeps.length > 0) {
    return errorResponse(
      res,
      412,
      `ticket ${ticketId} has incomplete dependencies: ${incompleteDeps.join(', ')}`,
      { incompleteDependencies: incompleteDeps }
    );
  }

  // --- Reserve the ticket synchronously (no await between the check above
  // and this reservation) to close the race window between two concurrent
  // /api/execute requests for the same ticket. Anything awaited before this
  // point only reads immutable/roadmap data or the ledger, which is safe to
  // race on since the reservation itself is the single source of truth for
  // "is a run starting/active right now".
  if (activeRuns.has(ticketId)) {
    return errorResponse(res, 409, `ticket ${ticketId} already has an active run`);
  }
  activeRuns.set(ticketId, { proc: null, startedAt: nowIso(), runner, model: model || null });

  // --- Codex unconfigured path: mark blocked, respond 200 with blocked state
  if (runner === 'codex') {
    const cfg = await loadCodexConfig();
    if (!cfg) {
      activeRuns.delete(ticketId);
      const message =
        'Codex executor is not configured. Create tools/roadmap-dashboard/codex.config.json ' +
        'with {"command": "<executable>", "args": ["..."]} before launching Codex runs. ' +
        'Codex is never passed to claude --model.';
      await appendLedgerEntry({
        timestamp: nowIso(),
        ticket: ticketId,
        event: 'blocked',
        runner,
        model: null,
        message,
        logFile: null,
      });
      return jsonResponse(res, 200, { ok: true, state: 'blocked', message });
    }
  }

  // --- Mark in_progress, then spawn in background -----------------------
  await appendLedgerEntry({
    timestamp: nowIso(),
    ticket: ticketId,
    event: 'in_progress',
    runner,
    model: model || null,
    message: `Execution launched via dashboard.`,
    logFile: null,
  });

  let launchResult;
  try {
    launchResult = await launchExecution({ ticketId, runner, model });
  } catch (err) {
    activeRuns.delete(ticketId);
    await appendLedgerEntry({
      timestamp: nowIso(),
      ticket: ticketId,
      event: 'failed',
      runner,
      model: model || null,
      message: `Failed to launch executor: ${err.message}`,
      logFile: null,
    });
    return errorResponse(res, 500, `failed to launch executor: ${err.message}`);
  }

  if (launchResult.blocked) {
    activeRuns.delete(ticketId);
    await appendLedgerEntry({
      timestamp: nowIso(),
      ticket: ticketId,
      event: 'blocked',
      runner,
      model: model || null,
      message: launchResult.message,
      logFile: launchResult.logFile || null,
    });
    return jsonResponse(res, 200, {
      ok: true,
      state: 'blocked',
      message: launchResult.message,
    });
  }

  jsonResponse(res, 202, {
    ok: true,
    state: 'in_progress',
    ticket: ticketId,
    logFile: launchResult.logFile,
  });
}

// FIX-003: human-friendly path for marking a human/business ticket (e.g.
// DIS-001/002/003) done manually, without faking an agent run through
// /api/execute. Appends a normal 'completed' ledger entry via the same
// appendLedgerEntry() helper used everywhere else — no separate write path.
//
// Example:
//   curl -sX POST http://127.0.0.1:4570/api/mark-human-done \
//     -H 'Content-Type: application/json' \
//     -d '{"ticket":"DIS-001","note":"Real LEPTON/KDT sample files obtained and format-notes.md written by ops."}'
async function handleMarkHumanDone(req, res, body) {
  let payload;
  try {
    payload = JSON.parse(body || '{}');
  } catch {
    return errorResponse(res, 400, 'invalid JSON body');
  }

  const ticketId = payload.ticket;
  if (!isValidTicketId(ticketId)) {
    return errorResponse(res, 400, 'invalid or missing ticket id');
  }

  const { tickets } = await loadRoadmap();
  const ticket = tickets.find((t) => t.id === ticketId);
  if (!ticket) {
    return errorResponse(res, 404, `ticket ${ticketId} does not exist in roadmap.md`);
  }
  if (!ticket.isHumanTask) {
    return errorResponse(
      res,
      422,
      `${ticketId} is not a human/business task; use /api/execute or the normal executor flow instead.`
    );
  }

  const note = typeof payload.note === 'string' ? payload.note.trim() : '';
  if (!note) {
    return errorResponse(res, 400, 'note is required (describe what was done / evidence)');
  }
  const author = typeof payload.author === 'string' && payload.author.trim()
    ? payload.author.trim()
    : 'human';

  const entry = await appendLedgerEntry({
    timestamp: nowIso(),
    ticket: ticketId,
    event: 'completed',
    runner: 'human',
    model: null,
    message: `${note} (marked done manually by ${author} via /api/mark-human-done)`,
    logFile: null,
  });

  jsonResponse(res, 201, { ok: true, entry });
}

async function handleGetLedger(req, res) {
  const entries = await readLedgerEntries();
  jsonResponse(res, 200, { ok: true, entries });
}

// ---------------------------------------------------------------------------
// Static file serving (index.html only — this is a minimal single-page app)
// ---------------------------------------------------------------------------

async function serveIndexHtml(req, res) {
  const html = await readFileSafe(INDEX_HTML_PATH, null);
  if (html === null) {
    return errorResponse(res, 500, 'index.html not found');
  }
  res.writeHead(200, {
    'Content-Type': 'text/html; charset=utf-8',
    'Cache-Control': 'no-store',
  });
  res.end(html);
}

// ---------------------------------------------------------------------------
// Body reading helper
// ---------------------------------------------------------------------------

function readBody(req, maxBytes = 1024 * 1024) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on('data', (chunk) => {
      size += chunk.length;
      if (size > maxBytes) {
        reject(new Error('body too large'));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}

// ---------------------------------------------------------------------------
// Router
// ---------------------------------------------------------------------------

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${HOST}:${PORT}`);
    const { pathname } = url;

    if (req.method === 'GET' && (pathname === '/' || pathname === '/index.html')) {
      return await serveIndexHtml(req, res);
    }

    if (req.method === 'GET' && pathname === '/api/tickets') {
      return await handleGetTickets(req, res);
    }

    if (req.method === 'GET' && pathname === '/api/allowlists') {
      return await handleGetAllowlists(req, res);
    }

    if (req.method === 'GET' && pathname === '/api/ledger') {
      return await handleGetLedger(req, res);
    }

    if (req.method === 'GET' && pathname === '/api/logs') {
      return await handleListLogs(req, res, url);
    }

    if (req.method === 'GET' && pathname === '/api/log') {
      return await handleGetLog(req, res, url);
    }

    if (req.method === 'GET' && pathname === '/api/comments') {
      return await handleGetComments(req, res, url);
    }

    if (req.method === 'POST' && pathname === '/api/comments') {
      const body = await readBody(req);
      return await handlePostComment(req, res, body);
    }

    if (req.method === 'POST' && pathname === '/api/execute') {
      const body = await readBody(req);
      return await handleExecute(req, res, body);
    }

    if (req.method === 'POST' && pathname === '/api/mark-human-done') {
      const body = await readBody(req);
      return await handleMarkHumanDone(req, res, body);
    }

    return errorResponse(res, 404, 'not found');
  } catch (err) {
    console.error(err);
    try {
      errorResponse(res, 500, `internal error: ${err.message}`);
    } catch {
      // response may already be closed
    }
  }
});

server.listen(PORT, HOST, () => {
  console.log(`[roadmap-dashboard] listening on http://${HOST}:${PORT}`);
  console.log(`[roadmap-dashboard] project root: ${PROJECT_ROOT}`);
  console.log(`[roadmap-dashboard] roadmap.md:   ${ROADMAP_PATH}`);
  console.log(`[roadmap-dashboard] ledger:       ${LEDGER_PATH}`);
});

process.on('SIGTERM', () => server.close(() => process.exit(0)));
process.on('SIGINT', () => server.close(() => process.exit(0)));
