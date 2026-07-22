# Canonical Data Model — Panel-Ops

**Version:** 1.0 · Sheets-first, PostgreSQL-portable. One Google Sheet file, one tab per table.
Row 1 = header (snake_case). All timestamps ISO-8601 with timezone (America/Bogota).
No physical deletes; `deleted_at` soft-delete. IDs server-generated, opaque, never reused.

## ID Formats

| Entity | Format | Example |
|---|---|---|
| Customer | `CUS-` + 6-digit seq | CUS-000001 |
| Ticket/Order | `ORD-YYYYMM-` + 4-digit monthly seq | ORD-202607-0001 |
| Part | `PRT-` + ticket seq | PRT-ORD-202607-0001-001 |
| Quotation | `QUO-` + ticket + version | QUO-ORD-202607-0001-v01 |
| Payment | `PAY-` + 6-digit seq | PAY-000001 |
| Document | `DOC-` + 6-digit seq | DOC-000001 |
| Import | `IMP-` + 6-digit seq | IMP-000001 |

Sequences stored in `Configuration` and incremented under `LockService`.

## Tables

### Customers
`customer_id (PK)`, `legal_name*`, `person_type* (individual|legal_entity)`,
`id_type* (CC|NIT|CE|PASSPORT)`, `id_number*`, `phone*`, `email*`, `contact_name*`,
`notes`, `created_at*`, `updated_at*`, `deleted_at`.
Unique soft key: (`id_type`,`id_number`).

### Tickets
`ticket_id (PK)`, `created_at*`, `intake_channel* (in_person|whatsapp|phone|file|web_tool|import)`,
`advisor_email*`, `customer_id (FK)*`, `workflow_state* (FK Workflow_States)`,
`labels (csv of controlled labels)`, `priority (normal|high|urgent)`,
`internal_deadline`, `last_activity_at*`, `next_action`, `next_action_owner`,
`waiting_on (internal|customer)` — drives aging split,
`quoted_value`, `approved_value`, `paid_value`,
`payment_method (cash|transfer|card)`, `payment_state (pending|verifying|confirmed)`,
`payment_confirmed_at`, `loss_reason (FK Loss_Reasons)`, `notes`,
`drive_folder_url*`, `original_request_url`, `quotation_pdf_url`, `production_file_url`,
`cutting_plan_url`, `payment_evidence_url`, `delivery_evidence_url`,
`closed_at`, `deleted_at`.

### Parts
`part_id (PK)`, `ticket_id (FK)*`, `customer_part_number`, `qty* (int>0)`,
`length_mm* (num>0)`, `width_mm* (num>0)`, `material* (catalog)`,
`panel_ref* (catalog or text)`, `thickness_mm* (catalog)`,
`grain_required* (yes|no|na)`,
`edge_top* (bool)`, `edge_bottom* (bool)`, `edge_left* (bool)`, `edge_right* (bool)`,
`tape_type (flexible|rigid|other|none)`, `tape_thickness`,
`notes`, `source* (manual|import|ai_draft|web_tool)`,
`customer_confirmed (bool)`, `advisor_validated (bool)`,
`validation_warnings (json array)`, `created_at*`, `updated_at*`, `deleted_at`.
Unit rule: everything stored in mm; import layer converts and records original unit in `validation_warnings` provenance.

### Quotations
`quotation_id (PK)`, `ticket_id (FK)*`, `version* (int)`, `status* (draft|sent|approved|rejected|expired|superseded)`,
`sent_at`, `valid_until` (= sent_at + 48h, extendable by management),
`decision (approved|rejected|changes_requested|pending)`, `decision_at`, `decision_evidence_doc (FK Documents)`,
`subtotal`, `vat_rate (default 0.19, from Configuration)`, `vat_amount`,
`withholding_json (configurable, informational)`, `total`,
`price_snapshot_json*` — full copy of every price row + rule inputs used,
`immutable (bool)` — true once paid, `pdf_doc (FK Documents)`, `created_by*`, `created_at*`.

### Quotation_Lines
`line_id (PK)`, `quotation_id (FK)*`, `line_type* (panel|cut|edge_tape|edge_service|transport|other|adjustment)`,
`description*`, `qty*`, `unit`, `unit_price*`, `line_total*`,
`source_price_id` (FK into price table used), `meta_json`
(e.g. edge metres requested / waste 10% / billable metres stored separately).

### Payments
`payment_id (PK)`, `ticket_id (FK)*`, `quotation_id (FK)*`, `method* (cash|transfer|card)`,
`amount*`, `currency (COP)`, `registered_by*`, `registered_at*`,
`verified_by`, `verified_at`, `status* (registered|verifying|confirmed|rejected)`,
`evidence_doc (FK Documents)`, `notes`.
Rule: only role `billing` may set `status=confirmed`; server records `verified_by` from session.

### Panel_Prices / Cut_Prices / Edge_Banding_Prices
Common columns: `price_id (PK)`, `effective_from*`, `updated_by*`, `active* (bool)`, `notes`.
- **Panel_Prices:** `supplier`, `material*`, `panel_ref*`, `panel_length_mm`, `panel_width_mm`, `thickness_mm*`, `price_before_vat*`, `price_with_vat`.
  Seeding convention (per ADR-004 OQ-2, confirmed complete catalog): **closed set of 3 board presets** —
  1530×2440mm, 1830×2440mm, 2120×2440mm (nominal, customer-facing) × 5 materials
  (mdf, pino, aglomerado, melaminico, chapilla) × 6 calibers (9/12/15/18/25/36mm). Early rows sourced
  from Modutriplex's live tool are placeholders — flag `notes=PLACEHOLDER_FROM_MODUTRIPLEX` until
  DIS-003 confirms or replaces each value.
  **Safety-margin cutting rule (confirmed by user 2026-07-18):** usable/cuttable area per board =
  nominal length −20mm × nominal width −20mm (2cm off each dimension), computed by formula, applied
  identically to all 3 presets, **internal only — never shown to the customer** (quotes/PDFs always
  display nominal size). This is the maximum area any part or packed arrangement of parts may occupy
  when cut from that board — not a minimum part size. Store as a derived value (formula in
  Configuration or computed at quotation time), not as a hardcoded per-row column, so the −20mm rule
  stays a single source of truth. Independent from `side_waste_factor` (10% pricing waste allowance
  on usable area) and saw kerf (~5mm blade width during cutting, not separately modeled since panels
  sell as complete sheets per master doc rule 7).
- **Cut_Prices:** `thickness_mm*`, `price_per_cut*`, `customer_supplied_surcharge_pct_or_amount` (configurable form TBD — DIS-004).
- **Edge_Banding_Prices:** `tape_type*`, `tape_thickness`, `tape_price_per_m*`, `application_price_per_m*`.
Never edited in place: price change = new row + old row `active=false`.

### Users
`email (PK)`, `full_name*`, `role* (management|sales|billing)`, `active* (bool)`, `created_at*`.

### Workflow_States
`state_id (PK)`, `name_en*`, `name_es*`, `order*`, `category (intake|commercial|payment|production|closed)`,
`is_terminal (bool)`, `aging_critical (bool)` — participates in 1h internal alert.
Seeded from `workflow-state-machine.md`; transition matrix lives in Configuration as JSON, versioned.

### Activity  (append-only)
`activity_id (PK)`, `ticket_id (FK)*`, `at*`, `actor*`, `type* (state_change|comment|edit|document|payment|alert|system)`,
`from_state`, `to_state`, `message`, `meta_json`.

### Documents
`doc_id (PK)`, `ticket_id (FK)`, `customer_id (FK)`, `category* (original_request|normalized|confirmation|quotation|payment|production|delivery|closure|other)`,
`filename*`, `drive_file_id*`, `drive_url*`, `immutable (bool)`, `uploaded_by*`, `uploaded_at*`.

### Configuration
`key (PK)`, `value_json*`, `description`, `updated_by*`, `updated_at*`.
Seed keys: `vat_rate` (0.19), `edge_waste_factor` (1.10 = 10% edge-band waste),
`side_waste_factor` (1.10 = 10% board-area waste, confirmed real client rule per ADR-004 OQ-1,
distinct from edge waste — applies to usable board area, not edge-band length),
`quotation_validity_hours` (48), `aging_alert_minutes` (60), `transition_matrix`, `sequences`,
`withholding_rules` (empty until accountant validates), `company_legal_info` (empty until DIS-005).

### Loss_Reasons
`reason_id (PK)`, `label_es*`, `active*`.

### Imports
`import_id (PK)`, `ticket_id (FK)*`, `source_doc (FK Documents)*`, `mapping_json*`,
`rows_total`, `rows_ok`, `rows_failed`, `errors_json`, `imported_by*`, `imported_at*`, `status (draft|applied|discarded)`.

## Relationships (crow's-foot summary)

Customers 1–N Tickets 1–N Parts · Tickets 1–N Quotations 1–N Quotation_Lines ·
Tickets 1–N Payments · Tickets 1–N Activity · Tickets 1–N Documents · Tickets 1–N Imports.
