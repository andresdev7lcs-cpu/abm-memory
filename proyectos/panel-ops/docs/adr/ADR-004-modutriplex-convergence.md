# ADR-004 — Modutriplex and Panel-Ops Converge (Same Client, Single Future System)

**Status:** Accepted · 2026-07-18 · Owner: User (business), Architect (technical)

## Decision
Modutriplex (`proyectos/modutriplex/` — landing page + 3-step quotation tool, live/deployed)
and Panel-Ops (`proyectos/panel-ops/` — this architecture) are **the same end client**.
Modutriplex is the existing front door (marketing site + quotation UI); Panel-Ops is the
back-office order-management layer being designed. They will merge into one system:
Modutriplex's quotation tool becomes (or feeds) Panel-Ops' intake + quotation modules,
not a separate Route-D integration bolted on later.

## Context
User confirmed 2026-07-18: "a futuro fusionaremos los dos proyectos en uno solo... es el
mismo cliente final." Discovered while executing DIS-002 (existing quotation tool
discovery) — the tool found in Modutriplex's `index.html` is not a third-party reference,
it is this client's own live cotizador.

## Consequences

1. **DIS-002 is substantially answered**, not just "a comparable reference." Findings in
   `discovery/quotation-tool/notes.md` describe the client's actual current tool. Numeric
   values found there (prices, board presets, waste factors) are candidate real seeds for
   DIS-003, not foreign data — but still require explicit user confirmation before being
   treated as validated (see Open Questions below), since they were read from code, not
   handed over as a business-confirmed price sheet.

2. **Route D (master doc §5.2, integration-contracts.md §4) is upgraded from "future
   nice-to-have" to a near-term architectural concern.** The eventual system should not
   run two parallel quotation engines. Two convergence paths exist, to be decided in a
   follow-up ADR once more is known:
   - (a) Modutriplex's cotizador becomes the Panel-Ops APP-006/APP-009 front-end, talking
     to the Panel-Ops canonical Parts/Quotations schema instead of its own local state.
   - (b) Panel-Ops absorbs Modutriplex's UI patterns (3-step flow, per-side edge banding,
     material-gated grain) into APP-006/APP-009 from the start, and the standalone
     Modutriplex site is retired or reduced to pure marketing/landing once Panel-Ops ships.

3. **Real numeric findings surfaced by DIS-002, useful to DIS-003 / APP-008 / APP-009,
   pending explicit user validation:**
   - Edge-band waste 10% (`EDGE_WASTE=0.10`) — matches Panel-Ops' already-documented rule.
     Independent corroboration, not new information.
   - A *second*, distinct waste factor `SIDE_WASTE=0.10` applied to usable board area —
     **not currently in `data-model.md`**. Needs a decision: does Panel-Ops' company use
     this too, or is it Modutriplex-specific? Candidate Configuration key if confirmed.
   - Saw kerf `KERF_MM=5`, pre-baked into fixed board-preset "usable" dimensions rather
     than modeled as an explicit configurable value. Panel-Ops currently sells full sheets
     (master doc rule) — kerf has no home yet; only matters if/when a cut-optimization
     feature is scoped.
   - VAT 19% — matches Panel-Ops' documented assumption. Corroboration, not new.
   - Grain/rotation is **material-gated** in Modutriplex's tool (some materials, e.g.
     veneer/chapilla, never allow rotation) — Panel-Ops' current `Parts.grain_required`
     field (yes/no/na) does not encode a per-material default/restriction. Candidate
     refinement for APP-006.
   - Board sizes are a **closed set of fixed presets** (3 sizes), not freeform dimensions.
     Panel-Ops' Parts model currently assumes any length/width. Needs a decision: does the
     real company sell from fixed sheet sizes only (likely yes, panels normally sold as
     complete sheets per master-doc rule 7) — if so, `Panel_Prices` should probably
     enumerate fixed board dimensions rather than being schema-open on `panel_length_mm`/
     `panel_width_mm` as free-typed values it already is compatible with; no schema change
     needed, just a seeding convention.
   - No minimum-part-size validation found in Modutriplex's code — either it doesn't
     enforce one, or enforcement lives elsewhere unconfirmed. Do not assume a rule exists
     without user confirmation.

4. **Files stay separated for now.** No code merge is in scope of any current ticket.
   `proyectos/modutriplex/**` remains untouched by Panel-Ops tickets. This ADR records
   intent and known compatibility surface only.

## Open Questions — RESOLVED 2026-07-18 (user decision)

- **OQ-1 — RESOLVED:** `SIDE_WASTE=0.10` is a real client business rule (already implemented
  in the live Modutriplex cotizador). Promote to Panel-Ops `data-model.md` Configuration as
  a first-class key, distinct from `edge_waste_factor`.
- **OQ-2 — RESOLVED:** the 3 board presets (153×244, 183×244, 212×244 cm) are the **complete**
  catalog. `Panel_Prices` should be seeded as a closed enumeration of these 3 sizes × 5
  materials × 6 calibers, not treated as open freeform dimensions.
- **OQ-3 — RESOLVED (architecture decision, path 3b):** Panel-Ops does **not** reuse
  Modutriplex's `index.html` cotizador as-is. Panel-Ops builds a new, improved quotation
  module (APP-006 part editor + APP-009 quotation engine) using Modutriplex's live tool as
  the functional baseline/reference, then that new module replaces the standalone
  Modutriplex cotizador once shipped. Implication: APP-006/APP-009 tickets are scoped as
  "build new, informed by reference" — see roadmap updates below.
- **OQ-4 — RESOLVED:** `PRECIOS_BASE` and other Modutriplex numeric values are **provisional
  placeholders**, not the validated price list. DIS-003 remains the authority for real,
  final pricing/tax data. Modutriplex's numbers may seed early APP-008 rows explicitly
  flagged `notes=PLACEHOLDER_FROM_MODUTRIPLEX`, to be superseded once DIS-003 delivers.

## Consequences of resolution — Architecture Updates Required

1. `data-model.md` Configuration section gains `side_waste_factor` (default 0.10) alongside
   existing `edge_waste_factor`.
2. `data-model.md` Panel_Prices gets a documented seeding convention: closed set of 3 board
   presets (with nominal + usable dimensions, kerf pre-compensated) × material × caliber.
3. APP-006 (Part-List Editor) ticket gains explicit reference to Modutriplex's UX pattern:
   material-gated grain/rotation (chapilla excluded), per-side A–D edge banding, fixed board
   presets as selectable options rather than freeform panel dimensions.
4. APP-009 (Quotation Engine) ticket gains: `side_waste_factor` line item alongside the
   existing edge-waste line, kerf-compensated usable-area logic per board preset, and an
   explicit "improve on Modutriplex" framing — known gaps to close: no cut/pass pricing in
   the reference tool, no customer-supplied-material surcharge, no confirmed minimum-part-size
   rule (Panel-Ops should decide this deliberately, not silently omit it).
5. New discovery follow-up: DIS-003 must explicitly confirm/replace every
   `PLACEHOLDER_FROM_MODUTRIPLEX` price row before Phase 3 payment tickets go live — added
   as an acceptance-gate note, not a new ticket (DIS-003 scope already covers this).
6. Long-term (post-MVP, not yet ticketed): retire/redirect the standalone Modutriplex
   cotizador once the new Panel-Ops quotation module ships, per business decision OQ-3.

## Propagation status (2026-07-18)
Applied to `data-model.md` (Configuration `side_waste_factor` key; Panel_Prices seeding
convention with the 3-preset closed catalog) and to roadmap tickets APP-006 and APP-009
(reference-informed scope additions, "build new" framing explicit). DIS-002 marked
completed in the runtime ledger.
