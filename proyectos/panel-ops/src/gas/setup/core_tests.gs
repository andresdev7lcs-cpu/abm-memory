/**
 * FIX-006 — Automated test suite covering INF-002's acceptance criteria.
 * Manual-run pattern (mirrors setup/selfCheck.gs): each check returns
 * {name, pass, detail}; runInf002Tests() runs all 4 and logs PASS/FAIL +
 * a summary line. Uses one disposable Loss_Reasons row for the round-trip
 * and Activity checks, deactivated (soft-delete) at the end so re-runs
 * don't accumulate junk data.
 */

function runInf002Tests() {
  var results = [];
  results.push(testUnknownEmailRejected_());
  results.push(testSequenceIncrementsAtomically_());

  var fixture = insertFix006TestLossReason_();
  results.push(testInsertReadRoundTrip_(fixture));
  results.push(testActivityRowOnWrite_(fixture));
  deactivateFix006TestLossReason_(fixture.record.reason_id, fixture.tag);

  var allPass = results.every(function (r) { return r.pass; });
  results.forEach(function (r) {
    Logger.log((r.pass ? 'PASS' : 'FAIL') + ' — ' + r.name + (r.detail ? ' — ' + r.detail : ''));
  });
  Logger.log('runInf002Tests ' + (allPass ? 'ALL PASS' : 'FAILURES PRESENT') +
    ' (' + results.length + ' checks)');
  return { allPass: allPass, results: results };
}

function testUnknownEmailRejected_() {
  var fabricated = 'fix006-nonexistent-' + new Date().getTime() + '@example.invalid';
  var user = findUserByEmail_(fabricated);
  return {
    name: 'getSession rejects unknown/nonexistent email',
    pass: user === null,
    detail: user === null
      ? 'findUserByEmail_ found no match — getSession() takes the ok:false branch for this email'
      : 'unexpected match found for a fabricated email'
  };
}

function testSequenceIncrementsAtomically_() {
  var ok = true;
  var detail = '';
  withPanelOpsLock_(function () {
    var seen = {};
    var prev = -1;
    for (var i = 0; i < 20; i++) {
      var id = nextPrefixedId_('Loss_Reasons');
      if (seen[id]) {
        ok = false;
        detail = 'duplicate id: ' + id;
        break;
      }
      seen[id] = true;
      var n = Number(id.split('-')[1]);
      if (n <= prev) {
        ok = false;
        detail = 'non-increasing sequence at ' + id;
        break;
      }
      prev = n;
    }
  });
  return {
    name: 'sequence generator strictly increasing, no duplicates (20 iterations)',
    pass: ok,
    detail: detail || '20 ids generated, strictly increasing, no duplicates'
  };
}

function insertFix006TestLossReason_() {
  var tag = 'FIX006-test-' + new Date().getTime();
  var record = db.insert('Loss_Reasons', {
    label_es: tag,
    active: true
  }, { actor: 'test:FIX-006', note: tag });
  return { record: record, tag: tag };
}

function testInsertReadRoundTrip_(fixture) {
  var rows = db.read('Loss_Reasons', function (row) {
    return row.reason_id === fixture.record.reason_id;
  });
  var pass = rows.length === 1 && rows[0].label_es === fixture.record.label_es;
  return {
    name: 'Loss_Reasons insert+read round-trip',
    pass: pass,
    detail: pass ? rows[0].reason_id + ' round-tripped' : 'expected 1 matching row, got ' + rows.length
  };
}

function testActivityRowOnWrite_(fixture) {
  var expectedMessage = 'insert Loss_Reasons - ' + fixture.tag;
  var rows = db.read('Activity', function (row) {
    return row.message === expectedMessage;
  });
  return {
    name: 'Activity row appended on write',
    pass: rows.length === 1,
    detail: rows.length + ' Activity row(s) matched "' + expectedMessage + '"'
  };
}

function deactivateFix006TestLossReason_(reasonId, tag) {
  db.update('Loss_Reasons', function (row) {
    return row.reason_id === reasonId;
  }, { active: false }, { actor: 'test:FIX-006', note: 'cleanup ' + tag });
}
