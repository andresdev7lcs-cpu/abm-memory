/**
 * INF-001 — Idempotent Panel-Ops workbook bootstrap.
 * Entry point: run setupPanelOpsWorkbook() once from the Apps Script editor
 * (or any trigger) bound to this project. Safe to re-run: it will not
 * duplicate the workbook, tabs, header rows, or seed rows.
 */

var PANEL_OPS_SS_ID_PROP = 'PANEL_OPS_SPREADSHEET_ID';
var PANEL_OPS_WORKBOOK_NAME = 'Panel-Ops';

function setupPanelOpsWorkbook() {
  var ss = getOrCreatePanelOpsWorkbook_();
  ensureAllTabs_(ss);
  seedWorkflowStatesIfEmpty_(ss);
  seedConfigurationKeys_(ss);
  seedLossReasonsIfEmpty_(ss);
  seedUsersIfEmpty_(ss);
  removeUnmanagedDefaultSheet_(ss);
  Logger.log('setupPanelOpsWorkbook complete. Spreadsheet: ' + ss.getUrl());
  return ss.getUrl();
}

function getOrCreatePanelOpsWorkbook_() {
  var props = PropertiesService.getScriptProperties();
  var id = props.getProperty(PANEL_OPS_SS_ID_PROP);
  if (id) {
    try {
      return SpreadsheetApp.openById(id);
    } catch (e) {
      Logger.log('Stored spreadsheet id ' + id + ' is no longer accessible, creating a new workbook. ' + e);
    }
  }
  var ss = SpreadsheetApp.create(PANEL_OPS_WORKBOOK_NAME);
  props.setProperty(PANEL_OPS_SS_ID_PROP, ss.getId());
  return ss;
}

function ensureAllTabs_(ss) {
  PANEL_OPS_SCHEMA.forEach(function (table) {
    var sheet = ss.getSheetByName(table.name);
    if (!sheet) {
      sheet = ss.insertSheet(table.name);
    }
    writeHeaderIfNeeded_(sheet, table.headers);
  });
}

function writeHeaderIfNeeded_(sheet, headers) {
  var range = sheet.getRange(1, 1, 1, headers.length);
  var current = range.getValues()[0];
  var matches = headers.every(function (h, i) { return current[i] === h; });
  if (!matches) {
    range.setValues([headers]);
  }
  if (sheet.getFrozenRows() < 1) {
    sheet.setFrozenRows(1);
  }
}

function seedWorkflowStatesIfEmpty_(ss) {
  var sheet = ss.getSheetByName('Workflow_States');
  if (sheet.getLastRow() > 1) {
    return; // already seeded
  }
  sheet.getRange(2, 1, WORKFLOW_STATES_SEED.length, WORKFLOW_STATES_SEED[0].length)
    .setValues(WORKFLOW_STATES_SEED);
}

function seedConfigurationKeys_(ss) {
  var sheet = ss.getSheetByName('Configuration');
  var lastRow = sheet.getLastRow();
  var existingKeys = {};
  if (lastRow > 1) {
    var keyColumn = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
    keyColumn.forEach(function (row) { existingKeys[row[0]] = true; });
  }
  var now = new Date().toISOString();
  var rowsToAppend = [];
  CONFIGURATION_SEED.forEach(function (entry) {
    var key = entry[0];
    if (existingKeys[key]) {
      return; // never overwrite an existing key (may have been edited by a user)
    }
    rowsToAppend.push([key, JSON.stringify(entry[1]), entry[2], 'setupPanelOpsWorkbook', now]);
  });
  if (rowsToAppend.length > 0) {
    sheet.getRange(sheet.getLastRow() + 1, 1, rowsToAppend.length, 5).setValues(rowsToAppend);
  }
}

function seedLossReasonsIfEmpty_(ss) {
  var sheet = ss.getSheetByName('Loss_Reasons');
  if (sheet.getLastRow() > 1) {
    return;
  }
  sheet.getRange(2, 1, LOSS_REASONS_SEED.length, LOSS_REASONS_SEED[0].length)
    .setValues(LOSS_REASONS_SEED);
}

function seedUsersIfEmpty_(ss) {
  var sheet = ss.getSheetByName('Users');
  if (sheet.getLastRow() > 1) {
    return;
  }
  var now = new Date().toISOString();
  var rows = USERS_SEED.map(function (u) { return u.concat([now]); });
  sheet.getRange(2, 1, rows.length, rows[0].length).setValues(rows);
}

function removeUnmanagedDefaultSheet_(ss) {
  var defaultSheet = ss.getSheetByName('Sheet1');
  if (defaultSheet && ss.getSheets().length > 1) {
    var isEmpty = defaultSheet.getLastRow() === 0 && defaultSheet.getLastColumn() === 0;
    if (isEmpty) {
      ss.deleteSheet(defaultSheet);
    }
  }
}
