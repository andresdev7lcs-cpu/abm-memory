/**
 * INF-002 — Generic read/write data layer with a single locked write path.
 * All table mutation goes through the helpers below to preserve atomic
 * sequence increments and Activity logging.
 */

var PANEL_OPS_ID_PREFIXES = {
  Customers: 'CUS',
  Tickets: 'ORD',
  Parts: 'PRT',
  Quotations: 'QTN',
  Quotation_Lines: 'QTL',
  Payments: 'PAY',
  Panel_Prices: 'PPR',
  Cut_Prices: 'CPR',
  Edge_Banding_Prices: 'EPR',
  Users: 'USR',
  Workflow_States: 'WFS',
  Activity: 'ACT',
  Documents: 'DOC',
  Configuration: 'CFG',
  Loss_Reasons: 'LRS',
  Imports: 'IMP'
};

var db = {
  read: function (tableName, filterFn) {
    var table = getTableSpec_(tableName);
    var sheet = getSheet_(tableName);
    var rows = sheet.getDataRange().getValues();
    if (rows.length <= 1) {
      return [];
    }

    var headers = rows[0];
    var results = [];
    for (var i = 1; i < rows.length; i++) {
      var rowObject = rowToObject_(headers, rows[i]);
      if (!filterFn || filterFn(rowObject)) {
        results.push(rowObject);
      }
    }
    return results;
  },

  insert: function (tableName, row, meta) {
    return withPanelOpsLock_(function () {
      var table = getTableSpec_(tableName);
      var sheet = getSheet_(tableName);
      var record = normalizeRowForInsert_(tableName, row);
      ensureSequenceId_(tableName, record);
      appendRow_(sheet, table.headers, record);
      activityLog_('insert', tableName, record, null, null, meta);
      return record;
    });
  },

  update: function (tableName, matchFn, patch, meta) {
    return withPanelOpsLock_(function () {
      var table = getTableSpec_(tableName);
      var sheet = getSheet_(tableName);
      var data = sheet.getDataRange().getValues();
      if (data.length <= 1) {
        return null;
      }

      var headers = data[0];
      for (var i = 1; i < data.length; i++) {
        var current = rowToObject_(headers, data[i]);
        if (!matchFn(current)) {
          continue;
        }
        var before = copyObject_(current);
        var updated = mergeRow_(table.headers, current, patch);
        writeRow_(sheet, i + 1, table.headers, updated);
        activityLog_('update', tableName, updated, before, patch, meta);
        return updated;
      }
      return null;
    });
  }
};

function getTableSpec_(tableName) {
  for (var i = 0; i < PANEL_OPS_SCHEMA.length; i++) {
    if (PANEL_OPS_SCHEMA[i].name === tableName) {
      return PANEL_OPS_SCHEMA[i];
    }
  }
  throw new Error('Unknown table: ' + tableName);
}

function getSheet_(tableName) {
  var ss = getPanelOpsSpreadsheet_();
  var sheet = ss.getSheetByName(tableName);
  if (!sheet) {
    throw new Error('Missing sheet: ' + tableName);
  }
  return sheet;
}

function getPanelOpsSpreadsheet_() {
  var props = PropertiesService.getScriptProperties();
  var id = props.getProperty(PANEL_OPS_SS_ID_PROP);
  if (!id) {
    throw new Error('Missing spreadsheet id property: ' + PANEL_OPS_SS_ID_PROP);
  }
  return SpreadsheetApp.openById(id);
}

function withPanelOpsLock_(callback) {
  var lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    return callback();
  } finally {
    lock.releaseLock();
  }
}

function rowToObject_(headers, values) {
  var out = {};
  for (var i = 0; i < headers.length; i++) {
    out[headers[i]] = values[i];
  }
  return out;
}

function normalizeRowForInsert_(tableName, row) {
  var table = getTableSpec_(tableName);
  var normalized = {};
  table.headers.forEach(function (header) {
    if (Object.prototype.hasOwnProperty.call(row, header)) {
      normalized[header] = row[header];
    } else {
      normalized[header] = '';
    }
  });
  return normalized;
}

function ensureSequenceId_(tableName, row) {
  var idField = getTableSpec_(tableName).headers[0];
  if (row[idField]) {
    return row;
  }

  if (tableName === 'Tickets') {
    row[idField] = nextTicketId_();
    return row;
  }

  row[idField] = nextPrefixedId_(tableName);
  return row;
}

function nextPrefixedId_(tableName) {
  var seqKey = getSequenceKeyForTable_(tableName);
  var sequences = getSequenceState_();
  sequences[seqKey] = Number(sequences[seqKey] || 0) + 1;
  persistSequenceState_(sequences);
  return PANEL_OPS_ID_PREFIXES[tableName] + '-' + padNumber_(sequences[seqKey], 4);
}

function nextTicketId_() {
  var sequences = getSequenceState_();
  var stamp = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyyMM');
  if (!sequences.ticket_monthly) {
    sequences.ticket_monthly = {};
  }
  sequences.ticket_monthly[stamp] = Number(sequences.ticket_monthly[stamp] || 0) + 1;
  persistSequenceState_(sequences);
  return 'ORD-' + stamp + '-' + padNumber_(sequences.ticket_monthly[stamp], 4);
}

function getSequenceKeyForTable_(tableName) {
  return String(tableName).replace(/[^A-Za-z0-9]/g, '_').toLowerCase();
}

function padNumber_(n, width) {
  var s = String(Number(n));
  while (s.length < width) {
    s = '0' + s;
  }
  return s;
}

function getSequenceState_() {
  var config = getConfigurationMap_();
  var stored = config.sequences;
  if (stored && typeof stored === 'object') {
    return copyObject_(stored);
  }
  return copyObject_(SEQUENCES_SEED);
}

function persistSequenceState_(sequences) {
  upsertConfigurationValue_('sequences', sequences, 'Contadores de secuencia por tipo de ID');
}

function getConfigurationMap_() {
  var rows = db.read('Configuration');
  var map = {};
  rows.forEach(function (row) {
    map[row.key] = parseJsonValue_(row.value_json);
  });
  return map;
}

function upsertConfigurationValue_(key, value, description) {
  var sheet = getSheet_('Configuration');
  var data = sheet.getDataRange().getValues();
  var now = new Date().toISOString();
  var serialized = JSON.stringify(value);
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] === key) {
      sheet.getRange(i + 1, 2, 1, 4).setValues([[serialized, description || data[i][2], 'setupPanelOpsWorkbook', now]]);
      return;
    }
  }
  sheet.getRange(sheet.getLastRow() + 1, 1, 1, 5).setValues([[key, serialized, description || '', 'setupPanelOpsWorkbook', now]]);
}

function parseJsonValue_(value) {
  if (value === '' || value === null || typeof value === 'undefined') {
    return null;
  }
  if (typeof value !== 'string') {
    return value;
  }
  try {
    return JSON.parse(value);
  } catch (e) {
    return value;
  }
}

function appendRow_(sheet, headers, row) {
  var values = headers.map(function (header) {
    return row[header];
  });
  sheet.getRange(sheet.getLastRow() + 1, 1, 1, values.length).setValues([values]);
}

function writeRow_(sheet, rowNumber, headers, row) {
  var values = headers.map(function (header) {
    return row[header];
  });
  sheet.getRange(rowNumber, 1, 1, values.length).setValues([values]);
}

function mergeRow_(headers, current, patch) {
  var merged = copyObject_(current);
  headers.forEach(function (header) {
    if (Object.prototype.hasOwnProperty.call(patch, header)) {
      merged[header] = patch[header];
    }
  });
  return merged;
}

function copyObject_(obj) {
  return JSON.parse(JSON.stringify(obj || {}));
}
