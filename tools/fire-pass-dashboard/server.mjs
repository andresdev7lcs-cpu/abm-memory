import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Dashboard Kanban local para FIRE PASS. Node core puro, sin dependencias npm.
// IMPORTANTE: este server NUNCA ejecuta comandos de shell. El endpoint de
// "comando" solo devuelve un string sugerido para que el usuario lo copie
// y lo corra manualmente en su propia terminal.

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROADMAP_PATH = path.join(__dirname, 'fire-pass-roadmap.md');
const STATUS_PATH = path.join(__dirname, 'fire-pass-status.md');
const INDEX_HTML_PATH = path.join(__dirname, 'index.html');
const COMMENTS_DIR = path.join(__dirname, 'comments');
const LOGS_DIR = path.join(__dirname, 'logs');

const PORT = 3000;
const HOST = '127.0.0.1';

const ESTADOS = {
  '✅ Completado': 'done',
  '🔄 En curso': 'doing',
  '⬜ Por hacer': 'todo',
  '🚫 Bloqueado': 'blocked',
};

function nowIso() {
  return new Date().toISOString();
}

// ---------- Roadmap parsing ----------
// Parsea bloques "### T-XX: Título" con líneas "- **Campo:** valor" hasta el
// siguiente "### T-" o "## Hito" o fin de archivo.
function parseRoadmap(text) {
  const lines = text.split('\n');
  const tickets = [];
  let current = null;
  let currentHito = null;
  let inVerificacion = false;

  const flush = () => {
    if (current) tickets.push(current);
    current = null;
  };

  for (const raw of lines) {
    const line = raw.replace(/\s+$/, '');

    const hitoMatch = line.match(/^##\s+(Hito.+)$/);
    if (hitoMatch) {
      flush();
      currentHito = hitoMatch[1].trim();
      inVerificacion = false;
      continue;
    }

    const ticketMatch = line.match(/^###\s+(T-[A-Z0-9]+):\s*(.+)$/);
    if (ticketMatch) {
      flush();
      current = {
        id: ticketMatch[1].trim(),
        titulo: ticketMatch[2].trim(),
        hito: currentHito,
        descripcion: '',
        dependencias: [],
        estado: '',
        modelo: '',
        verificacion: [],
      };
      inVerificacion = false;
      continue;
    }

    if (!current) continue;

    const verifHeaderMatch = /^-\s+\*\*Verificaci[oó]n:\*\*/i.test(line);
    if (verifHeaderMatch) {
      inVerificacion = true;
      continue;
    }

    // Cualquier otra línea "- **Campo:**" cierra el modo verificación
    const fieldMatch = line.match(/^-\s+\*\*(.+?):\*\*\s*(.*)$/);
    if (fieldMatch && !/^verificaci[oó]n$/i.test(fieldMatch[1].trim())) {
      inVerificacion = false;
      const key = fieldMatch[1].trim().toLowerCase();
      const val = fieldMatch[2].trim();
      if (key === 'descripción' || key === 'descripcion') current.descripcion = val;
      else if (key === 'dependencias') {
        current.dependencias = val
          .split(',')
          .map((s) => s.trim())
          .filter((s) => s && !/^ninguna$/i.test(s))
          .map((s) => {
            const m = s.match(/T-[A-Z0-9]+/);
            return m ? m[0] : s;
          });
      } else if (key === 'estado') current.estado = val;
      else if (key === 'modelo recomendado') current.modelo = val;
      continue;
    }

    if (inVerificacion) {
      const itemMatch = line.match(/^\s*-\s+(.+)$/);
      if (itemMatch) {
        current.verificacion.push(itemMatch[1].trim());
        continue;
      }
    }
  }
  flush();
  return tickets;
}

function readRoadmapTickets() {
  const text = fs.readFileSync(ROADMAP_PATH, 'utf8');
  return parseRoadmap(text);
}

function classifyEstado(estadoStr) {
  for (const key of Object.keys(ESTADOS)) {
    if (estadoStr && estadoStr.includes(key)) return ESTADOS[key];
  }
  const lower = (estadoStr || '').toLowerCase();
  if (lower.includes('completado')) return 'done';
  if (lower.includes('curso')) return 'doing';
  if (lower.includes('bloque')) return 'blocked';
  return 'todo';
}

function getTicketsWithDeps() {
  const tickets = readRoadmapTickets();
  const byId = new Map(tickets.map((t) => [t.id, t]));
  return tickets.map((t) => {
    const depsOk = t.dependencias.every((dep) => {
      const dep_t = byId.get(dep);
      return dep_t ? classifyEstado(dep_t.estado) === 'done' : false;
    });
    return { ...t, columna: classifyEstado(t.estado), depsOk };
  });
}

// ---------- Actualizar estado de un ticket en el roadmap ----------
function updateTicketStatus(ticketId, nuevoEstado) {
  const text = fs.readFileSync(ROADMAP_PATH, 'utf8');
  const lines = text.split('\n');
  let inTarget = false;
  let updated = false;

  const out = lines.map((line) => {
    const ticketMatch = line.match(/^###\s+(T-[A-Z0-9]+):/);
    if (ticketMatch) {
      inTarget = ticketMatch[1] === ticketId;
      return line;
    }
    if (inTarget) {
      const estadoMatch = line.match(/^(-\s+\*\*Estado:\*\*\s*).*/);
      if (estadoMatch) {
        updated = true;
        return `${estadoMatch[1]}${nuevoEstado}`;
      }
    }
    return line;
  });

  if (!updated) {
    throw new Error(`Ticket ${ticketId} no encontrado o sin línea de Estado en el roadmap`);
  }

  fs.writeFileSync(ROADMAP_PATH, out.join('\n'));
}

// ---------- Reescribir status.md con resumen ----------
function rewriteStatusFile() {
  const tickets = getTicketsWithDeps();
  const counts = { todo: 0, doing: 0, blocked: 0, done: 0 };
  for (const t of tickets) counts[t.columna] += 1;

  const rows = tickets
    .map((t) => `| ${t.id} | ${t.titulo} | ${t.estado} | ${t.hito || ''} |`)
    .join('\n');

  const content = `# FIRE PASS — Bitácora de Estado

> Este archivo es reescrito automáticamente por \`server.mjs\` cada vez que se actualiza el estado de un ticket vía la UI del dashboard. No editar manualmente mientras el servidor esté corriendo — los cambios manuales pueden perderse en la próxima escritura.

**Última actualización:** ${nowIso()}

## Resumen por columna

| Columna | Cantidad |
|---|---|
| ⬜ Por hacer | ${counts.todo} |
| 🔄 En curso | ${counts.doing} |
| 🚫 Bloqueado | ${counts.blocked} |
| ✅ Completado | ${counts.done} |
| **Total tickets** | **${tickets.length}** |

## Detalle

| Ticket | Título | Estado | Hito |
|---|---|---|---|
${rows}
`;

  fs.writeFileSync(STATUS_PATH, content);
}

// ---------- Comentarios ----------
function commentsFilePath(ticketId) {
  return path.join(COMMENTS_DIR, `${ticketId}.json`);
}

function readComments(ticketId) {
  const file = commentsFilePath(ticketId);
  if (!fs.existsSync(file)) return [];
  try {
    const data = JSON.parse(fs.readFileSync(file, 'utf8'));
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function appendComment(ticketId, text) {
  const comments = readComments(ticketId);
  const entry = { timestamp: nowIso(), text };
  comments.push(entry);
  if (!fs.existsSync(COMMENTS_DIR)) fs.mkdirSync(COMMENTS_DIR, { recursive: true });
  fs.writeFileSync(commentsFilePath(ticketId), JSON.stringify(comments, null, 2));
  return entry;
}

// ---------- Logs ----------
function readLog(ticketId) {
  const file = path.join(LOGS_DIR, `${ticketId}.log`);
  if (!fs.existsSync(file)) return '';
  return fs.readFileSync(file, 'utf8');
}

// ---------- Comando sugerido (NO se ejecuta nunca) ----------
function buildSuggestedCommand(ticket) {
  const desc = (ticket.descripcion || ticket.titulo || '').replace(/"/g, '\\"');
  return `claude -p "Ejecutar ticket ${ticket.id} de FIRE PASS: ${desc}. Contexto en proyectos/100lat-firepass/blueprint/"`;
}

// ---------- HTTP helpers ----------
function sendJson(res, status, obj) {
  const body = JSON.stringify(obj);
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(body);
}

function sendError(res, status, message) {
  sendJson(res, status, { error: message });
}

function readRequestBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (chunk) => {
      data += chunk;
    });
    req.on('end', () => resolve(data));
    req.on('error', reject);
  });
}

function findTicket(ticketId) {
  const tickets = getTicketsWithDeps();
  return tickets.find((t) => t.id === ticketId);
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${HOST}`);
    const { pathname } = url;
    const method = req.method;

    if (method === 'GET' && (pathname === '/' || pathname === '/index.html')) {
      const html = fs.readFileSync(INDEX_HTML_PATH, 'utf8');
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(html);
      return;
    }

    if (method === 'GET' && pathname === '/api/tickets') {
      return sendJson(res, 200, getTicketsWithDeps());
    }

    // /api/tickets/:id/status  (POST)
    let m = pathname.match(/^\/api\/tickets\/([^/]+)\/status$/);
    if (m && method === 'POST') {
      const ticketId = decodeURIComponent(m[1]);
      const body = JSON.parse((await readRequestBody(req)) || '{}');
      const nuevoEstado = body.estado;
      if (!nuevoEstado) return sendError(res, 400, 'Falta "estado" en el body');
      updateTicketStatus(ticketId, nuevoEstado);
      rewriteStatusFile();
      return sendJson(res, 200, { ok: true, ticketId, estado: nuevoEstado });
    }

    // /api/tickets/:id/comments (GET, POST)
    m = pathname.match(/^\/api\/tickets\/([^/]+)\/comments$/);
    if (m && method === 'GET') {
      const ticketId = decodeURIComponent(m[1]);
      return sendJson(res, 200, readComments(ticketId));
    }
    if (m && method === 'POST') {
      const ticketId = decodeURIComponent(m[1]);
      const body = JSON.parse((await readRequestBody(req)) || '{}');
      if (!body.text) return sendError(res, 400, 'Falta "text" en el body');
      const entry = appendComment(ticketId, body.text);
      return sendJson(res, 200, entry);
    }

    // /api/tickets/:id/logs (GET)
    m = pathname.match(/^\/api\/tickets\/([^/]+)\/logs$/);
    if (m && method === 'GET') {
      const ticketId = decodeURIComponent(m[1]);
      return sendJson(res, 200, { text: readLog(ticketId) });
    }

    // /api/tickets/:id/command (POST) — solo devuelve texto, no ejecuta nada
    m = pathname.match(/^\/api\/tickets\/([^/]+)\/command$/);
    if (m && method === 'POST') {
      const ticketId = decodeURIComponent(m[1]);
      const ticket = findTicket(ticketId);
      if (!ticket) return sendError(res, 404, `Ticket ${ticketId} no encontrado`);
      return sendJson(res, 200, { command: buildSuggestedCommand(ticket) });
    }

    sendError(res, 404, 'Ruta no encontrada');
  } catch (err) {
    sendError(res, 500, String((err && err.message) || err));
  }
});

server.listen(PORT, HOST, () => {
  console.log(`Dashboard corriendo en http://${HOST}:${PORT}`);
});
