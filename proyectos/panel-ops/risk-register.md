# Risk Register — Panel-Ops

**Version:** 1.0. Review each architecture cycle.

| ID | Risk | Prob. | Impact | Mitigation | Owner |
|---|---|---|---|---|---|
| R-01 | Automating undefined process | M | H | Phase 0 discovery + validate against 10 real orders (ACC-VAL) before Phase 2 | Architect |
| R-02 | Stale prices in quotations | H | H | Effective-dated price rows + immutable snapshots per quotation version | M |
| R-03 | Incorrect part data reaches production | M | H | Structured validation + explicit customer confirmation gate + paid-lock | S |
| R-04 | WhatsApp remains de facto database | H | M | All evidence must be attached/linked to ticket; confirmation gate requires evidence | S |
| R-05 | Optimizer import formats incompatible | M | H | Canonical model + adapters; hard block on real samples (DIS-001) | Architect |
| R-06 | Sheets becomes permanent tech debt | M | M | Stable IDs, relational schema, soft deletes, documented migration triggers | Architect |
| R-07 | Sheets concurrency corruption | M | H | Single LockService write path; append-only Activity; no client-direct Sheets access | Executor |
| R-08 | AI misreads a dimension (future) | M | H | Draft-only AI, confidence + provenance per field, human approval mandatory | Architect |
| R-09 | Poor adoption by 3 users | M | H | Minimal clicks, Spanish UI, pilot with real orders each phase | M |
| R-10 | Tax rules wrong (VAT/withholding) | M | H | Configurable rules, empty until accountant validates (DIS-005); no hard-coding | M |
| R-11 | Apps Script quotas/cold starts | L | M | Batched reads, cache, single-page UI; monitor; migration trigger if breached | Executor |
| R-12 | Executor drift / scope creep | M | M | GOV-001 dashboard, ticket invariants, ledger evidence, architect review gate | Architect |
| R-13 | Secrets/keys exposure (n8n history precedent) | M | H | No credentials in code or Sheets; Apps Script properties service; review at each ticket acceptance | Architect |
| R-14 | Payment confirmed without funds | L | H | Billing-only confirmation + mandatory evidence document | B |
