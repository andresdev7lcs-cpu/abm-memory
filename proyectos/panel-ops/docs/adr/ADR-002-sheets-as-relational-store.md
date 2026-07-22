# ADR-002 — Google Sheets Modeled as Relational Store

**Status:** Accepted · 2026-07-17 · Owner: Architect

## Decision
16 logical tables, one tab each, snake_case headers, server-generated opaque IDs with
entity prefixes, FKs by ID value, soft deletes only, append-only Activity, all writes
serialized through Apps Script `LockService`.

## Context
Sheets has no integrity enforcement. Future migration to PostgreSQL/Supabase is a
declared business direction (master doc §13.3).

## Consequences
+ Migration = CSV export + `COPY`; no ID rewrite; audit trail preserved.
+ App-level validation layer is the single guardian of integrity (explicit, testable).
− More backend code than "just use the sheet"; every write path must go through the API — direct sheet editing by users is prohibited (M exception: price import via app UI only).
