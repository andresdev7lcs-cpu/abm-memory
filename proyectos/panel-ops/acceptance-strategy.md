# Acceptance Strategy — Panel-Ops

**Version:** 1.0

## Principles

1. No ticket is "complete" without executor evidence: `roadmap-status.md` entry + log file + completion comment in `comments/<TICKET>.jsonl`. Source files existing ≠ done.
2. Architect reviews evidence against ticket acceptance criteria + invariants, then accepts, rejects, or issues a corrective ticket (`FIX-*`). Architect never fixes code.
3. Each phase closes with a validation gate using **real orders** before the next phase's build tickets start.

## Evidence per ticket type

| Type | Required evidence |
|---|---|
| Apps Script / backend | Verification commands output in log; manual test script results; no edits outside "files allowed to change" |
| UI | Screenshot or described walkthrough in completion comment; role-based visibility verified |
| Data schema | Sheet tabs + headers match `data-model.md` exactly; seed rows present |
| Governance (GOV-001) | All 13 acceptance criteria demonstrated; `roadmap.md` byte-identical before/after |
| Adapters | Round-trip test with real sample file (blocked until DIS-001 delivers) |

## Phase gates

- **Gate 0 → 1:** discovery inputs collected or explicitly deferred with M sign-off; GOV-001 operational.
- **Gate 1 → 2:** 10 representative real orders driven through intake→Kanban by actual users; state machine and aging verified; company stops handwritten tracking for new orders.
- **Gate 2 → 3:** 5 real quotations generated and compared against manually calculated quotations; price snapshot verified reproducible.
- **Gate 3 → 4:** full cycle intake→payment confirmed→ready_production on real orders; billing-only confirmation verified; paid snapshot immutability attack-tested (attempt edits, expect rejection).
- **Gate 4 → 5:** LEPTON + KDT files accepted by the real machines/software.

## MVP acceptance (master doc §25)

All 19 criteria, executed by the real users on production Google Workspace, witnessed
and recorded in Activity + a signed-off checklist stored in `03_REPORTS`.
