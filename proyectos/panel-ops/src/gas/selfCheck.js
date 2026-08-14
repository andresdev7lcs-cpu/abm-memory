/**
 * INF-001 — Self-check: reads back every tab/header from the live workbook
 * and diffs against PANEL_OPS_SCHEMA, logging PASS/FAIL per tab. Also
 * checks seed presence (Workflow_States=17 rows, all Configuration seed
 * keys present, Loss_Reasons non-empty, Users>=3 rows). Run after
 * setupPanelOpsWorkbook(); safe to run any number of times (read-only).
 */

function runSelfCheck() {
  var props = PropertiesService.getScriptProperties();
  var id = props.getProperty(PANEL_OPS_SS_ID_PROP);
  if (!id) {
    Logger.log('FAIL — no ' + PANEL_OPS_SS_ID_PROP + ' script property found. Run setupPanelOpsWorkbook() first.');
    return { allPass: false, results: [] };
  }
  var ss = SpreadsheetApp.openById(id);
  var results = [];

  PANEL_OPS_SCHEMA.forEach(function (table) {
    results.push(checkTabHeaders_(ss, table));
  });
  results.push(checkWorkflowStatesSeed_(ss));
  results.push(checkConfigurationSeed_(ss));
  results.push(checkLossReasonsSeed_(ss));
  results.push(checkUsersSeed_(ss));

  var allPass = results.every(function (r) { return r.pass; });
  results.forEach(function (r) {
    Logger.log((r.pass ? 'PASS' : 'FAIL') + ' — ' + r.name + (r.detail ? ' — ' + r.detail : ''));
  });
  Logger.log('runSelfCheck ' + (allPass ? 'ALL PASS' : 'FAILURES PRESENT') +
    ' (' + results.length + ' checks, spreadsheet ' + ss.getUrl() + ')');
  return { allPass: allPass, results: results };
}

function checkTabHeaders_(ss, table) {
  var sheet = ss.getSheetByName(table.name);
  if (!sheet) {
    return { name: table.name, pass: false, detail: 'tab missing' };
  }
  var current = sheet.getRange(1, 1, 1, table.headers.length).getValues()[0];
  var mismatches = [];
  table.headers.forEach(function (h, i) {
    if (current[i] !== h) {
      mismatches.push('col ' + (i + 1) + ' expected "' + h + '" got "' + current[i] + '"');
    }
  });
  if (mismatches.length > 0) {
    return { name: table.name, pass: false, detail: mismatches.join('; ') };
  }
  return { name: table.name, pass: true };
}

function checkWorkflowStatesSeed_(ss) {
  var sheet = ss.getSheetByName('Workflow_States');
  var rows = sheet.getLastRow() - 1;
  var expected = WORKFLOW_STATES_SEED.length;
  return {
    name: 'Workflow_States seed',
    pass: rows === expected,
    detail: rows + '/' + expected + ' rows'
  };
}

function checkConfigurationSeed_(ss) {
  var sheet = ss.getSheetByName('Configuration');
  var lastRow = sheet.getLastRow();
  var existingKeys = {};
  if (lastRow > 1) {
    sheet.getRange(2, 1, lastRow - 1, 1).getValues().forEach(function (row) {
      existingKeys[row[0]] = true;
    });
  }
  var missing = CONFIGURATION_SEED
    .map(function (entry) { return entry[0]; })
    .filter(function (key) { return !existingKeys[key]; });
  return {
    name: 'Configuration seed keys',
    pass: missing.length === 0,
    detail: missing.length === 0 ? 'all present' : 'missing: ' + missing.join(', ')
  };
}

function checkLossReasonsSeed_(ss) {
  var sheet = ss.getSheetByName('Loss_Reasons');
  var rows = sheet.getLastRow() - 1;
  return { name: 'Loss_Reasons seed', pass: rows >= LOSS_REASONS_SEED.length, detail: rows + ' rows' };
}

function checkUsersSeed_(ss) {
  var sheet = ss.getSheetByName('Users');
  var rows = sheet.getLastRow() - 1;
  return { name: 'Users seed', pass: rows >= 3, detail: rows + ' rows' };
}
