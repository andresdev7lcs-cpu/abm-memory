# Integration Contracts — Panel-Ops

**Version:** 1.0. Principle: one canonical part model (see `data-model.md#Parts`);
every external system talks through an adapter. Core never imports/export external layouts directly.

## 1. LEPTON Export Adapter — **BLOCKED (discovery)**

Required before ticket approval (DIS-001): real accepted file, exact columns + order,
units, decimal separator, CSV delimiter, encoding, grain/rotation encoding,
material/thickness encoding, edge-banding encoding, required vs optional columns.
Adapter contract (once unblocked): `parts[] (canonical, mm) → file (LEPTON layout)`,
technical whitelist only, validation report listing untranslatable rows. **Executors must not invent this format.**

## 2. KDT Optimizer Export Adapter — **BLOCKED (discovery)**

Same required inputs and contract shape as LEPTON. Independent adapter — no shared layout code beyond the canonical model.

## 3. WhatsApp Deep Links (Phase 1)

Contract: `https://wa.me/<phone>?text=<urlencoded template>`.
Templates stored in Configuration (editable by M): missing-info request, dimension
confirmation, quotation delivery, approval reminder, payment reminder, payment
confirmation, production handoff, delivery-ready. Human reviews and sends manually.
No inbound automation in MVP.

## 4. Existing Web Quotation Tool (Route D) — discovery (DIS-002)

Needed: screenshots or technical access, its operational restrictions (min part size,
face orientation) to fold into canonical validation layer. Target contract: tool creates/
updates ticket + attaches original request, normalized parts, estimate, cutting plan, export file.

## 5. CSV/XLSX Customer Import (Phase 2)

Inbound adapter: file → column-mapping UI → canonical Parts draft → validation report
(missing/invalid/ambiguous flagged) → advisor applies. Mapping stored per Imports row
(`mapping_json`) for reuse. Unit conversion to mm recorded with provenance.

## 6. Future (out of MVP)

WhatsApp Business API (bidirectional), n8n automations, bank-email parsing, OCR/AI intake.
Each requires its own ADR + discovery ticket before any implementation ticket.
