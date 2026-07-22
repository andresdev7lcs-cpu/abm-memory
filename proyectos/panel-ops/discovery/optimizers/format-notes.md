# DIS-001 — Optimizer Format Notes (LEPTON + KDT)

**Status: BLOCKED — human discovery task. All answers below are UNANSWERED.**
Executors must never invent these formats (per roadmap.md DIS-001 + integration-contracts.md §1–2).
This file only enumerates the questions to be answered by a human with access to the real
LEPTON and KDT Optimizer software. Do not fill in guessed values.

## Deliverables still required (none obtained by agent)

- [ ] Real import file **accepted by LEPTON** (attach next to this file)
- [ ] Real import file **accepted by KDT Optimizer** (attach next to this file)
- [ ] Both files verified accepted by the real software (screenshots of import screens if docs unavailable)

## Format questions — LEPTON (integration-contracts.md §1) — ALL UNANSWERED

- [ ] Exact columns and their order
- [ ] Units
- [ ] Decimal separator
- [ ] CSV delimiter
- [ ] Encoding
- [ ] Grain / rotation rules encoding
- [ ] Material / thickness encoding
- [ ] Edge-band encoding
- [ ] Required vs optional columns

## Format questions — KDT Optimizer (integration-contracts.md §2) — ALL UNANSWERED

- [ ] Exact columns and their order
- [ ] Units
- [ ] Decimal separator
- [ ] CSV delimiter
- [ ] Encoding
- [ ] Grain / rotation rules encoding
- [ ] Material / thickness encoding
- [ ] Edge-band encoding
- [ ] Required vs optional columns

## Acceptance criteria (not met)

Both files verified accepted by the real software; every format question above answered in writing.

## Unblock path

Human (Management / Advisor) with LEPTON and KDT Optimizer access must:
1. Export/obtain one real accepted import file per optimizer and place them in `discovery/optimizers/`.
2. Answer every question above in writing here.
3. Photograph/screenshot the software import screens if written specs are unavailable.

Until then INT-001 and INT-002 remain hard-blocked.
