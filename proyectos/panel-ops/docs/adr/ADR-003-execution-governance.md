# ADR-003 — Architect/Executor Split & Runtime Ledger

**Status:** Accepted · 2026-07-17 · Owner: Architect

## Decision
Architect AI owns architecture docs + `roadmap.md` (intended work) and never writes
application code. Executor agents (Claude CLI models `claude-fable-5`, `claude-opus-4-8`,
`claude-sonnet-5`; Codex via separate adapter) implement one ticket at a time. Runtime
truth lives outside the roadmap: `roadmap-status.md` (ledger), `logs/<ticket>-<ts>.log`,
`comments/<TICKET>.jsonl` (binding human notes). GOV-001 dashboard is the only launcher.

## Consequences
+ Drift detectable; completion requires evidence; roadmap stays clean plan-of-record.
− Overhead per ticket (prompt, ledger, review) — accepted cost for traceability.
Codex label must never be passed to `claude --model`; unconfigured Codex ⇒ explicit blocked state.
