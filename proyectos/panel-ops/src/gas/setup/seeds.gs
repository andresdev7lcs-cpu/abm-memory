/**
 * INF-001 — Seed data for the Panel-Ops workbook.
 * Workflow_States rows come directly from workflow-state-machine.md (17 states,
 * one row per table row there). transition_matrix mirrors the "Transition
 * Matrix" + "Guards" sections of that same doc so INF-002+ can enforce
 * transitions from Configuration instead of re-encoding the doc.
 * Loss_Reasons and Users are explicit placeholders per the INF-001 ticket
 * scope ("starter list", "3 Users placeholders") — not business-validated
 * data; editable later via APP-008/APP UI without re-running setup.
 */

var WORKFLOW_STATES_SEED = [
  // state_id, name_en, name_es, order, category, is_terminal, aging_critical
  ['received', 'Request received', 'Solicitud recibida', 1, 'intake', false, true],
  ['incomplete', 'Incomplete information', 'Información incompleta', 2, 'intake', false, false],
  ['review', 'Under review', 'En revisión', 3, 'intake', false, true],
  ['awaiting_confirmation', 'Awaiting customer confirmation', 'Esperando confirmación cliente', 4, 'intake', false, false],
  ['confirmed', 'Data confirmed', 'Datos confirmados', 5, 'commercial', false, true],
  ['quoting', 'Quotation in preparation', 'Cotización en preparación', 6, 'commercial', false, true],
  ['quote_sent', 'Quotation sent', 'Cotización enviada', 7, 'commercial', false, false],
  ['awaiting_approval', 'Awaiting approval', 'Esperando aprobación', 8, 'commercial', false, false],
  ['approved_unpaid', 'Approved — awaiting payment', 'Aprobada — esperando pago', 9, 'payment', false, false],
  ['payment_verifying', 'Payment under verification', 'Pago en verificación', 10, 'payment', false, true],
  ['payment_confirmed', 'Payment confirmed', 'Pago confirmado', 11, 'payment', false, true],
  ['ready_production', 'Ready for production', 'Lista para producción', 12, 'production', false, true],
  ['in_production', 'In production', 'En producción', 13, 'production', false, false],
  ['ready_delivery', 'Ready for delivery', 'Lista para entrega', 14, 'production', false, true],
  ['delivered', 'Delivered', 'Entregada', 15, 'production', false, false],
  ['closed', 'Closed', 'Cerrada', 16, 'closed', true, false],
  ['lost', 'Lost / cancelled', 'Perdida / cancelada', 17, 'closed', true, false]
];

/**
 * Generated from workflow-state-machine.md "Transition Matrix" + "Guards"
 * sections. Guard identifiers reference the numbered guard in that doc.
 */
var TRANSITION_MATRIX_SEED = {
  version: 1,
  source: 'workflow-state-machine.md v1.0',
  transitions: {
    received: [
      { to: 'incomplete', roles: ['sales'] },
      { to: 'review', roles: ['sales'] }
    ],
    incomplete: [
      { to: 'review', roles: ['sales'] }
    ],
    review: [
      { to: 'incomplete', roles: ['sales'] },
      { to: 'awaiting_confirmation', roles: ['sales'] },
      { to: 'confirmed', roles: ['sales'] }
    ],
    awaiting_confirmation: [
      { to: 'review', roles: ['sales'] },
      { to: 'confirmed', roles: ['sales'], guard: 'confirmation_evidence_required' }
    ],
    confirmed: [
      { to: 'quoting', roles: ['sales'] }
    ],
    quoting: [
      { to: 'quote_sent', roles: ['sales'], guard: 'quotation_version_required' }
    ],
    quote_sent: [
      { to: 'awaiting_approval', roles: ['sales'] },
      { to: 'quoting', roles: ['sales'], guard: 'new_version' }
    ],
    awaiting_approval: [
      { to: 'approved_unpaid', roles: ['sales'], guard: 'decision_approved' },
      { to: 'quoting', roles: ['sales'], guard: 'decision_changes_requested' }
    ],
    approved_unpaid: [
      { to: 'payment_verifying', roles: ['sales', 'billing'], guard: 'payment_registered' }
    ],
    payment_verifying: [
      { to: 'payment_confirmed', roles: ['billing'] },
      { to: 'approved_unpaid', roles: ['billing'], guard: 'payment_rejected' }
    ],
    payment_confirmed: [
      { to: 'ready_production', roles: ['system', 'sales'], guard: 'commercial_snapshot_locked' }
    ],
    ready_production: [
      { to: 'in_production', roles: ['sales'] }
    ],
    in_production: [
      { to: 'ready_delivery', roles: ['sales'] }
    ],
    ready_delivery: [
      { to: 'delivered', roles: ['sales'], guard: 'delivery_evidence_required' }
    ],
    delivered: [
      { to: 'closed', roles: ['sales', 'management'] }
    ]
  },
  lost_from_any_non_terminal: { roles: ['sales', 'management'], guard: 'loss_reason_required' },
  management_reopen: [
    { from: 'closed', to: 'review', roles: ['management'], guard: 'activity_note_required' },
    { from: 'lost', to: 'review', roles: ['management'], guard: 'activity_note_required' }
  ]
};

/**
 * Initial sequence counters, one per ID format in data-model.md. Ticket
 * (INF-001) and ADR-002 only require a "sequences" key to exist; this shape
 * is an implementation choice (not specified elsewhere) so later tickets
 * (INF-002 sequence generator) may need to agree on/extend it.
 */
var SEQUENCES_SEED = {
  customer: 0,
  payment: 0,
  document: 0,
  import: 0,
  ticket_monthly: {}
};

var CONFIGURATION_SEED = [
  // key, value_json, description
  ['vat_rate', 0.19, 'IVA aplicado a cotizaciones'],
  ['edge_waste_factor', 1.10, 'Factor de desperdicio sobre metros de canto solicitados'],
  ['quotation_validity_hours', 48, 'Horas de validez de una cotización enviada'],
  ['aging_alert_minutes', 60, 'Minutos de inactividad interna antes de alerta de aging'],
  ['transition_matrix', TRANSITION_MATRIX_SEED, 'Matriz de transiciones del workflow (ver workflow-state-machine.md)'],
  ['sequences', SEQUENCES_SEED, 'Contadores de secuencia por tipo de ID'],
  ['withholding_rules', {}, 'Reglas de retención — vacío hasta validación contable (DIS-003)'],
  ['company_legal_info', {}, 'Datos legales/branding de la empresa — vacío hasta DIS-003']
];

/**
 * Starter list — generic, business-agnostic placeholders per ticket scope.
 * No canonical loss-reason list exists yet in project docs; replace/extend
 * via the Loss_Reasons UI once real data is available.
 */
var LOSS_REASONS_SEED = [
  // reason_id, label_es, active
  ['price_too_high', 'Precio muy alto', true],
  ['delivery_time', 'Tiempo de entrega', true],
  ['bought_elsewhere', 'Compró con la competencia', true],
  ['no_response', 'Cliente no respondió', true],
  ['requirement_changed', 'Cambio de necesidad', true],
  ['other', 'Otro', true]
];

/**
 * Placeholders per ticket scope ("3 Users placeholders, roles
 * management/sales/billing"). Emails are non-functional placeholders — a
 * real Google account email must replace each before INF-002 role
 * resolution can authenticate against them.
 */
var USERS_SEED = [
  // email, full_name, role, active
  ['placeholder-management@panel-ops.local', 'Placeholder — Management', 'management', true],
  ['placeholder-sales@panel-ops.local', 'Placeholder — Sales', 'sales', true],
  ['placeholder-billing@panel-ops.local', 'Placeholder — Billing', 'billing', true]
];
