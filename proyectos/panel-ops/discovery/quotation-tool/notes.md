# DIS-002 — Existing Web Quotation Tool Discovery

**Source found:** `proyectos/modutriplex/index.html` (commit `fad9d1f` — "Modutriplex — cotizador 3-pasos, navbar Vercel, factura Step3, fix navegación"). This is Modutriplex, a *different* client project (maderas y paneles CNC, Bogotá), not the Panel-Ops company itself — but it is the most recent real quotation-tool build the user has produced and is the reference implementation for Route D per the user's direction 2026-07-18.

Caveat carried into Panel-Ops: business values here (prices, waste %, board sizes) belong to Modutriplex's catalog, not necessarily this company's. Structural/UX patterns are reusable; numeric values need re-validation against DIS-003 for Panel-Ops itself.

## Structure — 3 steps

1. **Paso 1 — Materiales** (`#cotStep1Panel`): user picks one or more material+board+caliber combinations via cards (`cotMaterialCards`) opening a side panel (`cotSidePanelOverlay`) to configure: material, board size preset, caliber (thickness), grain/rotation, edge banding per side.
2. **Paso 2 — Piezas** (`#cotStep2Panel`): table of pieces — width (mm), height (mm), quantity, material (linked to a step-1 combination), edge banding, row actions.
3. **Paso 3 — Tu solución** (`#cotStep3Panel`): computed result / invoice-style summary.

## Canonical fields observed

- Material catalog (`MATERIALS`): mdf, pino, aglomerado, melaminico, chapilla.
- Caliber/thickness (`CALIBRES`): 9mm, 12mm, 15mm, 18mm, 25mm, 36mm — fixed list, not free numeric entry.
- Grain/rotation (`ROTATABLE_MATERIALS`): only mdf, pino, aglomerado, melaminico allow "rotate grain" choice; chapilla does not (grain-critical veneer — always natural). **This is a materiality-dependent grain rule Panel-Ops' canonical model doesn't yet encode** (`data-model.md#Parts.grain_required` is yes/no/na per part, not gated by material). Candidate refinement for APP-006.
- Grain UI: radio pills, **required field** (`*obligatorio`) — "Sí, rotar veta" / "No, veta natural".
- Edge banding: per-side (`EDGE_SIDES` = A/B/C/D = largo1/largo2/ancho1/ancho2), each side independently assignable a tape type. Matches Panel-Ops' `edge_top/bottom/left/right` model reasonably well (4 discrete sides vs. named A-D — cosmetic difference).
- Piece fields in Step 2 table: width mm, height mm, quantity, material, edge banding — **all in millimetres already**, consistent with Panel-Ops' mm-canonical rule.
- Board sizes are **fixed presets**, not freeform: 153×244, 183×244, 212×244 (nominal cm shown to customer), each with a computed *usable* area (nominal minus ~2cm safety margin) baked into `BOARD_SPECS`.

## Business rules discovered (numeric, Modutriplex-specific — verify against DIS-003 for Panel-Ops)

- `EDGE_WASTE = 0.10` — 10% edge-banding waste. **Matches Panel-Ops' documented rule exactly** (`architecture.md`, `data-model.md §11.4`: "billable = requested × 1.10"). Independent confirmation this is a real industry-standard figure, not an arbitrary placeholder.
- `SIDE_WASTE = 0.10` — an *additional* 10% waste factor applied to the board's effective/usable area, separate from edge waste. **Not currently modeled in Panel-Ops' data-model.md.** Candidate addition to Configuration / Cut_Prices logic — flag for APP-009 (quotation engine) architect review.
- `KERF_MM = 5` — saw blade kerf, already compensated inside each `BOARD_SPECS.usable` value (explicitly commented "not subtracted again"). Panel-Ops has no explicit kerf concept yet — panels are sold as complete sheets per master doc rules, but if a future cut-optimization feature is added, kerf must be a first-class Configuration value, not baked silently into board presets.
- `IVA = 0.19` — matches Panel-Ops' documented VAT assumption exactly.
- Pricing is a flat lookup table per material+caliber (`PRECIOS_BASE`), not a formula — no cut/pass pricing, no customer-supplied-material surcharge visible in this tool. Panel-Ops' richer pricing model (Cut_Prices, customer-supplied surcharge) goes beyond what this tool does.
- Edge tape price is flat per linear metre by type: rigid `PRECIO_CANTO_RIGIDO_ML=4500`, flexible `PRECIO_CANTO_FLEXIBLE_ML=3800` — no tape-thickness variation modeled.

## Restrictions found

- **CONFIRMED BY USER 2026-07-18 — safety-margin cutting rule:** optimization runs on
  each board's usable area = nominal size **minus 2cm on both length and width**, applied
  internally only, never shown to the customer. Matches `BOARD_SPECS.usable` exactly:
  - 153×244 (1530×2440mm nominal) → usable 151×242 (1510×2420mm)
  - 183×244 (1830×2440mm nominal) → usable 181×242 (1810×2420mm)
  - 212×244 (2120×2440mm nominal) → usable 210×242 (2100×2420mm)
  This is not a "minimum part size" — it is a **maximum cuttable area per board**: no
  single part, and no packed arrangement of parts, may exceed the usable dimensions of
  the board it's cut from. Customer-facing quotes/PDFs must always display nominal board
  size; usable/internal dimensions never surface externally. Rule applies identically to
  all 3 board presets (parametrized by the same −20mm/−20mm formula, not per-board special-cased).
  Distinct from `KERF_MM=5` (blade width during cutting) and `SIDE_WASTE=0.10` (10% waste
  allowance on usable area for pricing) — three separate, independently confirmed concepts.
- Grain/rotation option is gated by material (chapilla excluded) — see above.
- Board sizes are a closed set of 3 presets, not freeform dimensions — customer cannot request a custom sheet size.

## Export / outputs observed

Step 3 renders an on-screen "solución" (quote result) with invoice-style layout (`factura Step3` per commit message); no evidence in this pass of a PDF export or file download hook — would need a live click-through of the tool to confirm final output mechanics (out of scope for a static code read; note as unconfirmed).

## Integration feasibility for Route D

High structural compatibility: mm-native, per-side edge banding, grain toggle, material/caliber selection all map cleanly onto Panel-Ops' canonical Parts schema (`data-model.md`). Main gaps to resolve before any Route D ticket: (1) material-gated grain rule, (2) fixed board-preset model vs. Panel-Ops' any-dimension parts, (3) confirm real PDF/file export exists, (4) SIDE_WASTE and KERF concepts need an explicit home in Panel-Ops pricing config if reused.

## Status

Partial discovery via static code read of a comparable tool (Modutriplex, a sibling client project), not a live walkthrough of Panel-Ops' own company's existing quotation tool. Sufficient to unblock APP-006 validation-rule design with real reference patterns. If the Panel-Ops company (the wood-panel SME from the architecture brief) has its own separate existing quotation tool distinct from Modutriplex, that one is still undiscovered — confirm with the user before closing DIS-002 fully.
