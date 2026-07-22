# ADR-001 — Google Workspace as MVP Stack

**Status:** Accepted · 2026-07-17 · Owner: Management (business), Architect (technical)

## Decision
Frontend HTML/CSS/JS served by Google Apps Script Web App; Google Sheets as logical
data layer; Google Drive as document repository; Workspace identity; Apps Script triggers.

## Context
3 internal users, ASAP delivery, low budget (COP 7–14M MVP), moderate volume, company
already lives in Google ecosystem. Excel/CSV compatibility is a core business need.

## Consequences
+ Fast, cheap, familiar; native Drive/Sheets integration; zero infra ops.
− Not transactional; concurrency limits; app-level validation mandatory (LockService single write path); Apps Script quotas.
Migration triggers documented in `architecture.md §8`; schema designed relationally (ADR-002) so migration is data-copy.

## Alternatives rejected (for MVP)
Supabase/PostgreSQL + Vercel (better integrity, higher cost/ops burden now — it is the planned future, not the start); n8n-first automation (process not yet stabilized).
