/**
 * APP-001 — Customers module.
 * Business rules (required fields, duplicate detection, soft delete) layered on
 * top of the generic db/session helpers from INF-002. Entry points below have no
 * trailing underscore so they are callable directly (e.g. via google.script.run);
 * internal helpers keep the project's `_` suffix convention.
 */

var CUSTOMERS_TABLE = 'Customers';
var CUSTOMERS_REQUIRED_FIELDS = ['legal_name', 'person_type', 'id_type', 'id_number', 'phone', 'email', 'contact_name'];
var CUSTOMERS_PERSON_TYPES = ['individual', 'legal_entity'];
var CUSTOMERS_ID_TYPES = ['CC', 'NIT', 'CE', 'PASSPORT'];
var CUSTOMERS_SEARCH_FIELDS = ['legal_name', 'id_number', 'phone', 'email', 'contact_name'];

function customersCreate(payload) {
  var session = getSession();
  var access = requireRole_(session, ['management', 'sales']);
  if (!access.ok) {
    return access;
  }

  var record = copyObject_(payload || {});
  var errors = validateCustomerRecord_(record);
  if (errors.length) {
    return { ok: false, status: 400, error: 'Datos de cliente inválidos', fields: errors };
  }

  var now = new Date().toISOString();
  record.created_at = record.created_at || now;
  record.updated_at = now;
  record.deleted_at = '';

  var duplicates = findDuplicateCustomers_(record.id_type, record.id_number, null);
  var inserted = db.insert(CUSTOMERS_TABLE, record, { actor: session.email, note: 'customers.create' });

  return { ok: true, row: inserted, duplicateWarning: duplicates.length > 0, duplicates: duplicates };
}

function customersUpdate(customerId, patch) {
  var session = getSession();
  var access = requireRole_(session, ['management', 'sales']);
  if (!access.ok) {
    return access;
  }
  if (!customerId) {
    return { ok: false, status: 400, error: 'customer_id requerido' };
  }

  var current = findCustomerById_(customerId);
  if (!current) {
    return { ok: false, status: 404, error: 'Cliente no encontrado' };
  }

  var merged = copyObject_(current);
  var safePatch = copyObject_(patch || {});
  Object.keys(safePatch).forEach(function (key) {
    merged[key] = safePatch[key];
  });

  var errors = validateCustomerRecord_(merged);
  if (errors.length) {
    return { ok: false, status: 400, error: 'Datos de cliente inválidos', fields: errors };
  }

  safePatch.updated_at = new Date().toISOString();
  var duplicates = findDuplicateCustomers_(merged.id_type, merged.id_number, customerId);

  var updated = db.update(CUSTOMERS_TABLE, function (row) {
    return row.customer_id === customerId;
  }, safePatch, { actor: session.email, note: 'customers.update' });

  return { ok: true, row: updated, duplicateWarning: duplicates.length > 0, duplicates: duplicates };
}

function customersList(filters) {
  var access = requireRole_(getSession(), ['management', 'sales', 'billing']);
  if (!access.ok) {
    return access;
  }
  var opts = filters || {};
  var rows = db.read(CUSTOMERS_TABLE, function (row) {
    if (!opts.includeDeleted && row.deleted_at) {
      return false;
    }
    if (opts.person_type && row.person_type !== opts.person_type) {
      return false;
    }
    return true;
  });
  return { ok: true, rows: rows };
}

function customersSearch(query) {
  var access = requireRole_(getSession(), ['management', 'sales', 'billing']);
  if (!access.ok) {
    return access;
  }
  var needle = String(query || '').trim().toLowerCase();
  if (!needle) {
    return { ok: true, rows: [] };
  }
  var rows = db.read(CUSTOMERS_TABLE, function (row) {
    if (row.deleted_at) {
      return false;
    }
    return CUSTOMERS_SEARCH_FIELDS.some(function (field) {
      return String(row[field] || '').toLowerCase().indexOf(needle) !== -1;
    });
  });
  return { ok: true, rows: rows };
}

function customersDeactivate(customerId, reason) {
  var session = getSession();
  var access = requireRole_(session, ['management', 'sales']);
  if (!access.ok) {
    return access;
  }
  if (!customerId) {
    return { ok: false, status: 400, error: 'customer_id requerido' };
  }

  var current = findCustomerById_(customerId);
  if (!current) {
    return { ok: false, status: 404, error: 'Cliente no encontrado' };
  }
  if (current.deleted_at) {
    return { ok: false, status: 409, error: 'Cliente ya está desactivado' };
  }

  var now = new Date().toISOString();
  var note = 'customers.deactivate' + (reason ? ' - ' + reason : '');
  var updated = db.update(CUSTOMERS_TABLE, function (row) {
    return row.customer_id === customerId;
  }, { deleted_at: now, updated_at: now }, { actor: session.email, note: note });

  return { ok: true, row: updated };
}

function validateCustomerRecord_(record) {
  var errors = [];
  CUSTOMERS_REQUIRED_FIELDS.forEach(function (field) {
    if (!record[field] || String(record[field]).trim() === '') {
      errors.push(field);
    }
  });
  if (record.person_type && CUSTOMERS_PERSON_TYPES.indexOf(record.person_type) === -1) {
    errors.push('person_type');
  }
  if (record.id_type && CUSTOMERS_ID_TYPES.indexOf(record.id_type) === -1) {
    errors.push('id_type');
  }
  return errors;
}

function findCustomerById_(customerId) {
  var rows = db.read(CUSTOMERS_TABLE, function (row) {
    return row.customer_id === customerId;
  });
  return rows.length ? rows[0] : null;
}

function findDuplicateCustomers_(idType, idNumber, excludeId) {
  if (!idType || !idNumber) {
    return [];
  }
  return db.read(CUSTOMERS_TABLE, function (row) {
    if (row.deleted_at) {
      return false;
    }
    if (excludeId && row.customer_id === excludeId) {
      return false;
    }
    return row.id_type === idType && String(row.id_number) === String(idNumber);
  });
}
