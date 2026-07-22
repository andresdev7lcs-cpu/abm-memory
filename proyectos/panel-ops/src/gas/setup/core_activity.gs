/**
 * INF-002 — Activity writer. All writes should leave an auditable trail.
 */

function activityLog_(type, tableName, after, before, patch, meta) {
  var sheet = getSheet_('Activity');
  var now = new Date().toISOString();
  var activityId = nextPrefixedId_('Activity');
  var ticketId = extractTicketId_(tableName, after, before, patch);
  var actor = (meta && meta.actor) || 'system';
  var entry = {
    activity_id: activityId,
    ticket_id: ticketId,
    at: now,
    actor: actor,
    type: type,
    from_state: (meta && meta.from_state) || '',
    to_state: (meta && meta.to_state) || '',
    message: buildActivityMessage_(type, tableName, after, before, patch, meta),
    meta_json: JSON.stringify(meta || {})
  };
  appendRow_(sheet, getTableSpec_('Activity').headers, entry);
  return entry;
}

function extractTicketId_(tableName, after, before, patch) {
  if (after && after.ticket_id) {
    return after.ticket_id;
  }
  if (before && before.ticket_id) {
    return before.ticket_id;
  }
  if (patch && patch.ticket_id) {
    return patch.ticket_id;
  }
  return '';
}

function buildActivityMessage_(type, tableName, after, before, patch, meta) {
  var parts = [type + ' ' + tableName];
  if (after && after.ticket_id) {
    parts.push(after.ticket_id);
  }
  if (meta && meta.note) {
    parts.push(meta.note);
  }
  return parts.join(' - ');
}
