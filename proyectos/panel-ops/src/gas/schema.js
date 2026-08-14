/**
 * INF-001 — Canonical tab/header schema for the Panel-Ops workbook.
 * Source of truth: data-model.md. Do not add/remove/reorder columns here
 * without updating data-model.md first — this list must match it exactly.
 * Kept in one module so later tickets (INF-002+) can reuse it for the
 * generic table read/write layer instead of re-declaring headers.
 */

var PANEL_OPS_SCHEMA = [
  {
    name: 'Customers',
    headers: ['customer_id', 'legal_name', 'person_type', 'id_type', 'id_number',
      'phone', 'email', 'contact_name', 'notes', 'created_at', 'updated_at', 'deleted_at']
  },
  {
    name: 'Tickets',
    headers: ['ticket_id', 'created_at', 'intake_channel', 'advisor_email', 'customer_id',
      'workflow_state', 'labels', 'priority', 'internal_deadline', 'last_activity_at',
      'next_action', 'next_action_owner', 'waiting_on', 'quoted_value', 'approved_value',
      'paid_value', 'payment_method', 'payment_state', 'payment_confirmed_at', 'loss_reason',
      'notes', 'drive_folder_url', 'original_request_url', 'quotation_pdf_url',
      'production_file_url', 'cutting_plan_url', 'payment_evidence_url',
      'delivery_evidence_url', 'closed_at', 'deleted_at']
  },
  {
    name: 'Parts',
    headers: ['part_id', 'ticket_id', 'customer_part_number', 'qty', 'length_mm', 'width_mm',
      'material', 'panel_ref', 'thickness_mm', 'grain_required', 'edge_top', 'edge_bottom',
      'edge_left', 'edge_right', 'tape_type', 'tape_thickness', 'notes', 'source',
      'customer_confirmed', 'advisor_validated', 'validation_warnings', 'created_at',
      'updated_at', 'deleted_at']
  },
  {
    name: 'Quotations',
    headers: ['quotation_id', 'ticket_id', 'version', 'status', 'sent_at', 'valid_until',
      'decision', 'decision_at', 'decision_evidence_doc', 'subtotal', 'vat_rate', 'vat_amount',
      'withholding_json', 'total', 'price_snapshot_json', 'immutable', 'pdf_doc', 'created_by',
      'created_at']
  },
  {
    name: 'Quotation_Lines',
    headers: ['line_id', 'quotation_id', 'line_type', 'description', 'qty', 'unit',
      'unit_price', 'line_total', 'source_price_id', 'meta_json']
  },
  {
    name: 'Payments',
    headers: ['payment_id', 'ticket_id', 'quotation_id', 'method', 'amount', 'currency',
      'registered_by', 'registered_at', 'verified_by', 'verified_at', 'status',
      'evidence_doc', 'notes']
  },
  {
    name: 'Panel_Prices',
    headers: ['price_id', 'effective_from', 'updated_by', 'active', 'notes', 'supplier',
      'material', 'panel_ref', 'panel_length_mm', 'panel_width_mm', 'thickness_mm',
      'price_before_vat', 'price_with_vat']
  },
  {
    name: 'Cut_Prices',
    headers: ['price_id', 'effective_from', 'updated_by', 'active', 'notes', 'thickness_mm',
      'price_per_cut', 'customer_supplied_surcharge_pct_or_amount']
  },
  {
    name: 'Edge_Banding_Prices',
    headers: ['price_id', 'effective_from', 'updated_by', 'active', 'notes', 'tape_type',
      'tape_thickness', 'tape_price_per_m', 'application_price_per_m']
  },
  {
    name: 'Users',
    headers: ['email', 'full_name', 'role', 'active', 'created_at']
  },
  {
    name: 'Workflow_States',
    headers: ['state_id', 'name_en', 'name_es', 'order', 'category', 'is_terminal',
      'aging_critical']
  },
  {
    name: 'Activity',
    headers: ['activity_id', 'ticket_id', 'at', 'actor', 'type', 'from_state', 'to_state',
      'message', 'meta_json']
  },
  {
    name: 'Documents',
    headers: ['doc_id', 'ticket_id', 'customer_id', 'category', 'filename', 'drive_file_id',
      'drive_url', 'immutable', 'uploaded_by', 'uploaded_at']
  },
  {
    name: 'Configuration',
    headers: ['key', 'value_json', 'description', 'updated_by', 'updated_at']
  },
  {
    name: 'Loss_Reasons',
    headers: ['reason_id', 'label_es', 'active']
  },
  {
    name: 'Imports',
    headers: ['import_id', 'ticket_id', 'source_doc', 'mapping_json', 'rows_total', 'rows_ok',
      'rows_failed', 'errors_json', 'imported_by', 'imported_at', 'status']
  }
];
