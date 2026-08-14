/**
 * INF-002 — JSON API router and web app entrypoints.
 */

function doGet(e) {
  var session = getSession();
  if (!session.ok) {
    return HtmlService.createHtmlOutput(renderUnauthorizedShell_(session.error))
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.DEFAULT);
  }

  var template = HtmlService.createTemplateFromFile('Shell');
  template.session = session;
  template.apiBase = '';
  return template.evaluate()
    .setTitle('Panel-Ops')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.DEFAULT);
}

function doPost(e) {
  var payload = parseRequestJson_(e);
  var action = String(payload.action || '').trim();
  var session = getSession();
  if (!session.ok) {
    return jsonOutput_({ ok: false, error: session.error }, session.status || 403);
  }

  var response;
  try {
    response = routeAction_(action, payload, session);
  } catch (err) {
    response = { ok: false, error: err && err.message ? err.message : String(err) };
  }
  return jsonOutput_(response, response && response.status ? response.status : 200);
}

function routeAction_(action, payload, session) {
  if (action === 'session.get') {
    return { ok: true, session: { email: session.email, role: session.role, fullName: session.fullName } };
  }
  if (action === 'db.read') {
    return handleDbRead_(payload, session);
  }
  if (action === 'db.insert') {
    return handleDbInsert_(payload, session);
  }
  if (action === 'db.update') {
    return handleDbUpdate_(payload, session);
  }
  if (action === 'activity.log') {
    return handleActivityLog_(payload, session);
  }
  return { ok: false, status: 400, error: 'Acción no soportada: ' + action };
}

function handleDbRead_(payload, session) {
  var table = String(payload.table || '').trim();
  var allowed = requireRole_(session, ['management', 'sales', 'billing']);
  if (!allowed.ok) {
    return allowed;
  }
  var filters = payload.filters || {};
  var rows = db.read(table, function (row) {
    for (var key in filters) {
      if (Object.prototype.hasOwnProperty.call(filters, key) && row[key] !== filters[key]) {
        return false;
      }
    }
    return true;
  });
  return { ok: true, rows: rows };
}

function handleDbInsert_(payload, session) {
  var table = String(payload.table || '').trim();
  var allowed = requireRole_(session, ['management', 'sales']);
  if (!allowed.ok) {
    return allowed;
  }
  var row = payload.row || {};
  row = copyObject_(row);
  row.updated_at = row.updated_at || new Date().toISOString();
  row.created_at = row.created_at || row.updated_at;
  var inserted = db.insert(table, row, { actor: session.email, note: 'API insert' });
  return { ok: true, row: inserted };
}

function handleDbUpdate_(payload, session) {
  var table = String(payload.table || '').trim();
  var allowed = requireRole_(session, ['management', 'sales']);
  if (!allowed.ok) {
    return allowed;
  }
  var patch = payload.patch || {};
  var criteria = payload.criteria || {};
  var updated = db.update(table, function (row) {
    for (var key in criteria) {
      if (Object.prototype.hasOwnProperty.call(criteria, key) && row[key] !== criteria[key]) {
        return false;
      }
    }
    return true;
  }, patch, { actor: session.email, note: 'API update' });
  if (!updated) {
    return { ok: false, status: 404, error: 'Fila no encontrada' };
  }
  return { ok: true, row: updated };
}

function handleActivityLog_(payload, session) {
  var allowed = requireRole_(session, ['management', 'sales', 'billing']);
  if (!allowed.ok) {
    return allowed;
  }
  return { ok: true, entry: activityLog_(
    String(payload.type || 'note'),
    String(payload.table || ''),
    payload.after || {},
    payload.before || {},
    payload.patch || {},
    { actor: session.email, note: payload.message || '', from_state: payload.from_state || '', to_state: payload.to_state || '' }
  ) };
}

function parseRequestJson_(e) {
  if (!e || !e.postData || !e.postData.contents) {
    return {};
  }
  try {
    return JSON.parse(e.postData.contents);
  } catch (err) {
    return {};
  }
}

function jsonOutput_(payload, status) {
  if (payload && typeof payload === 'object' && !payload.status && status) {
    payload.status = status;
  }
  var output = ContentService.createTextOutput(JSON.stringify(payload));
  output.setMimeType(ContentService.MimeType.JSON);
  return output;
}

function renderUnauthorizedShell_(message) {
  return '<!doctype html><html><head><meta charset="utf-8"><title>Panel-Ops</title>' +
    '<style>body{font-family:Arial,sans-serif;background:#f6f3ee;color:#1f2933;margin:0;padding:40px}main{max-width:640px;margin:0 auto;background:#fff;padding:32px;border-radius:20px;box-shadow:0 12px 40px rgba(0,0,0,.08)}</style>' +
    '</head><body><main><h1>Panel-Ops</h1><p>' + escapeHtml_(message || 'Usuario no autorizado') + '</p></main></body></html>';
}

function escapeHtml_(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
