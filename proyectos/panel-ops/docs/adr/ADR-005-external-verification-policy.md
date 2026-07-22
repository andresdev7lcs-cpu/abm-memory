# ADR-005 — External-Service Verification Policy

**Status:** Accepted · 2026-07-18 · Owner: User (governance), Architect (technical)

## Decision

No ticket may require **live external verification** as its only acceptance path unless
the required credentials and environment are explicitly available to the executor.
Every ticket that touches an external service (Google OAuth, Apps Script runtime,
`clasp`, real Sheets workbooks, bank portals, WhatsApp Business API, or any production
credential) must define two separate acceptance tiers:

1. **Local acceptance criteria** — files created/modified, static validation, schema
   validation, mocked/dry-run behavior, documentation updated, deterministic tests that
   need no credentials.
2. **Live verification criteria** — exact external account/service required, required
   credentials, required command, expected live result, manual fallback if automation
   is unavailable.

If local implementation is complete but live verification cannot run (missing
credentials/access), the executor must **not** report the ticket as failed. Correct
status: `completed-local / pending-live-verification` — or, if the dashboard's ledger
only supports its existing four states, `blocked` with blocker type
`blocked-external-verification`.

Executor must report explicitly: what was completed locally; what was not verified
live; which credential/service/workbook/command/account is missing; the exact next
verification step for a human or a properly provisioned agent. External-verification
blockage must never trigger unnecessary code rewrites or re-implementation attempts.

## Context

Executor agents run in local/sandboxed environments without Google OAuth, Apps Script
runtime, `clasp`, real Sheets workbooks, bank portals, WhatsApp Business API access, or
production credentials. Prior to this ADR, tickets like INF-001 (Sheets Workbook
Bootstrap) had no explicit split between "script written and internally correct" and
"script actually run against a real Google Sheet" — risk of an executor either (a)
falsely claiming full completion for work only locally validated, or (b) burning cycles
rewriting already-correct code because it can't complete live verification it was never
provisioned to do.

## Consequences

1. Every open/future ticket touching an external service gets its acceptance criteria
   split into the two tiers above. Existing tickets are retrofitted (see Propagation).
2. Dashboard ledger's `blocked` state gains a documented blocker-type convention;
   `blocked-external-verification` specifically means "code/local work may be done,
   external step needs credentials/human," distinct from `blocked` for a genuine
   spec/business blocker (e.g. FIX-002's old permission-sandbox confusion must not
   recur under a different name).
3. Architect (acceptance review) must check the local tier independently (as already
   practiced — reading files, running static checks) and treat live-tier gaps as
   expected, not as grounds for rejecting the ticket, provided the executor's report
   correctly names the missing credential/service and next step.
4. Does not change who *holds* credentials — DIS-001/DIS-003 (human tasks) remain the
   path by which real Google Workspace access, bank portal access, and WhatsApp
   Business API access get provisioned. This ADR only governs how tickets are scoped
   and accepted while that access is pending.

## Propagation status (2026-07-18)

Applied to INF-001 (Sheets Workbook Bootstrap), INF-002 (Apps Script Web App Skeleton),
INF-003, INT-001/INT-002 (LEPTON/KDT export), and payment-evidence-touching tickets
(APP-005 and related). Each retrofitted with explicit local vs. live acceptance tiers
per this ADR — see `roadmap.md` ticket bodies for the per-ticket split.

2026-07-18 (later same day): also retrofitted FIX-004 (runner/model selection reset by
poll) — its live tier requires an interactive browser session and real wall-clock 4s
poll cycles, an executor-environment capability gap treated as external verification
under this policy even though no credential is involved. Ledger correction notes in
`roadmap-status.md` (2026-07-18T14:31:14Z) reclassified INF-001 and FIX-004 as
`blocked` / `blocked-external-verification`. Enforcement ticket GOV-002 (relaunch gate:
no relaunch of `blocked-external-verification` tickets without explicit human
acknowledgment + reason) added to `roadmap.md` after repeated no-op relaunches of both
tickets demonstrated the process gap.
