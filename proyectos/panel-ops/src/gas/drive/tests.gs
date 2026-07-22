/**
 * INF-003 — Test suite for the Drive case-file automation module.
 * Mirrors core/tests.gs (FIX-006) manual-run pattern: each check returns
 * {name, pass, detail}; runInf003Tests() runs all and logs PASS/FAIL.
 *
 * testFolderSpecShape_ needs no Drive/OAuth access (local tier).
 * The rest need a real Drive session (live tier, per roadmap.md INF-003
 * verification section) and use a `_TEST` customer/ticket prefix so the
 * whole tree is disposable (rollback notes: "test folders under a `_TEST`
 * prefix, deletable").
 */

function runInf003Tests() {
  var results = [];
  results.push(testFolderSpecShape_());

  var liveResult = runInf003LiveChecks_();
  results = results.concat(liveResult);

  var allPass = results.every(function (r) { return r.pass; });
  results.forEach(function (r) {
    Logger.log((r.pass ? 'PASS' : 'FAIL') + ' — ' + r.name + (r.detail ? ' — ' + r.detail : ''));
  });
  Logger.log('runInf003Tests ' + (allPass ? 'ALL PASS' : 'FAILURES PRESENT') +
    ' (' + results.length + ' checks)');
  return { allPass: allPass, results: results };
}

function testFolderSpecShape_() {
  var expectedNames = [
    '00_ORIGINAL_REQUEST', '01_NORMALIZED', '02_CONFIRMATION', '03_QUOTATION',
    '04_PAYMENT', '05_PRODUCTION', '06_DELIVERY', '07_CLOSURE'
  ];
  var actualNames = PANEL_OPS_ORDER_SUBFOLDERS.map(function (s) { return s.name; });
  var pass = actualNames.length === 8 && JSON.stringify(actualNames) === JSON.stringify(expectedNames);
  return {
    name: 'order subfolder spec is 00-07, matches Documents.category enum order',
    pass: pass,
    detail: pass ? actualNames.join(',') : 'got ' + actualNames.join(',')
  };
}

function runInf003LiveChecks_() {
  var results = [];
  var tag = '_TEST-INF003-' + new Date().getTime();
  var customerName = tag + '-customer';
  var ticketId = tag + '-ORD';

  var tree;
  try {
    tree = drive.createOrderFolders(ticketId, customerName);
  } catch (e) {
    return [{
      name: 'live Drive checks',
      pass: false,
      detail: 'blocked-external-verification — createOrderFolders threw: ' + e.message
    }];
  }

  results.push({
    name: 'createOrderFolders builds 8 subfolders (00-07)',
    pass: Object.keys(tree.subfolders).length === 8,
    detail: Object.keys(tree.subfolders).join(',')
  });

  var dummyBlob = Utilities.newBlob('test content', 'text/plain', 'sample.txt');
  var storedRecord;
  try {
    storedRecord = drive.storeFile(ticketId, 'original_request', dummyBlob, { actor: 'test:INF-003', note: tag });
    results.push({
      name: 'storeFile writes Documents row for original_request, immutable=true',
      pass: !!storedRecord.doc_id && storedRecord.immutable === true,
      detail: JSON.stringify(storedRecord)
    });
  } catch (e) {
    results.push({ name: 'storeFile original_request', pass: false, detail: e.message });
  }

  var overwriteRejected = false;
  var overwriteDetail = '';
  try {
    drive.storeFile(ticketId, 'original_request', Utilities.newBlob('second file', 'text/plain', 'sample2.txt'), { actor: 'test:INF-003' });
    overwriteDetail = 'expected rejection, but second storeFile into original_request succeeded';
  } catch (e) {
    overwriteRejected = true;
    overwriteDetail = e.message;
  }
  results.push({
    name: 'second storeFile into original_request is rejected (write-once)',
    pass: overwriteRejected,
    detail: overwriteDetail
  });

  try {
    var quotationRecord = drive.storeFile(ticketId, 'quotation', Utilities.newBlob('quote', 'text/plain', 'quote.pdf'), { actor: 'test:INF-003' });
    results.push({
      name: 'storeFile writes non-immutable category (quotation) without rejection',
      pass: !!quotationRecord.doc_id && quotationRecord.immutable === false,
      detail: JSON.stringify(quotationRecord)
    });
  } catch (e) {
    results.push({ name: 'storeFile quotation', pass: false, detail: e.message });
  }

  var docRows = db.read('Documents', function (row) { return row.ticket_id === ticketId; });
  results.push({
    name: 'every stored file has a Documents row',
    pass: docRows.length === 2,
    detail: docRows.length + ' Documents row(s) for ' + ticketId
  });

  cleanupInf003TestTree_(tree);
  return results;
}

function cleanupInf003TestTree_(tree) {
  if (tree && tree.customerFolder) {
    tree.customerFolder.setTrashed(true);
  }
}
