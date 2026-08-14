/**
 * APP-001 — Customers module tests.
 * Manual-run PASS/FAIL pattern (mirrors core/tests.gs and drive/tests.gs).
 * Run runAppOneTests() from the Apps Script editor against the real workbook.
 */

function runAppOneTests() {
  var results = [];
  results.push(testRequiredFieldsRejected_());
  results.push(testInvalidEnumsRejected_());
  results.push(testValidRecordPassesValidation_());
  results.push(testCreateInvalidRejectedByEntryPoint_());
  results.push(testCreateValidInsertsAndLogsActivity_());
  results.push(testDuplicateDetectedOnMatchingIdTypeAndNumber_());
  results.push(testDeactivateSoftDeletesAndBlocksSecondCall_());
  results.push(testBillingRoleWriteRejected_());

  var failed = results.filter(function (r) { return !r.pass; });
  Logger.log(results.map(function (r) { return (r.pass ? 'PASS' : 'FAIL') + ' - ' + r.name + (r.pass ? '' : ' :: ' + r.detail); }).join('\n'));
  Logger.log(failed.length === 0 ? 'ALL PASS (' + results.length + '/' + results.length + ')' : (results.length - failed.length) + '/' + results.length + ' passed');
  return results;
}

function testRequiredFieldsRejected_() {
  var errors = validateCustomerRecord_({});
  var expected = ['legal_name', 'person_type', 'id_type', 'id_number', 'phone', 'email', 'contact_name'];
  var pass = expected.every(function (f) { return errors.indexOf(f) !== -1; });
  return { name: 'testRequiredFieldsRejected_', pass: pass, detail: JSON.stringify(errors) };
}

function testInvalidEnumsRejected_() {
  var record = validCustomerFixture_();
  record.person_type = 'not_a_type';
  record.id_type = 'DNI';
  var errors = validateCustomerRecord_(record);
  var pass = errors.indexOf('person_type') !== -1 && errors.indexOf('id_type') !== -1;
  return { name: 'testInvalidEnumsRejected_', pass: pass, detail: JSON.stringify(errors) };
}

function testValidRecordPassesValidation_() {
  var errors = validateCustomerRecord_(validCustomerFixture_());
  return { name: 'testValidRecordPassesValidation_', pass: errors.length === 0, detail: JSON.stringify(errors) };
}

function testCreateInvalidRejectedByEntryPoint_() {
  var result = customersCreate({ legal_name: 'Solo nombre' });
  var pass = result.ok === false && result.status === 400 && Array.isArray(result.fields);
  return { name: 'testCreateInvalidRejectedByEntryPoint_', pass: pass, detail: JSON.stringify(result) };
}

function testCreateValidInsertsAndLogsActivity_() {
  var fixture = validCustomerFixture_();
  fixture.id_number = 'APP001-TEST-' + new Date().getTime();
  var result = customersCreate(fixture);
  if (!result.ok) {
    return { name: 'testCreateValidInsertsAndLogsActivity_', pass: false, detail: JSON.stringify(result) };
  }
  var activityRows = db.read('Activity', function (row) {
    return row.message && String(row.message).indexOf('customers.create') !== -1 && String(row.message).indexOf(result.row.customer_id) !== -1;
  });
  var pass = !!result.row.customer_id && activityRows.length >= 1;
  deactivateAppOneTestCustomer_(result.row.customer_id);
  return { name: 'testCreateValidInsertsAndLogsActivity_', pass: pass, detail: 'customer_id=' + result.row.customer_id + ' activityRows=' + activityRows.length };
}

function testDuplicateDetectedOnMatchingIdTypeAndNumber_() {
  var idNumber = 'APP001-DUP-' + new Date().getTime();
  var first = validCustomerFixture_();
  first.id_number = idNumber;
  var firstResult = customersCreate(first);

  var second = validCustomerFixture_();
  second.id_number = idNumber;
  var secondResult = customersCreate(second);

  var pass = firstResult.ok && secondResult.ok && firstResult.duplicateWarning === false && secondResult.duplicateWarning === true;
  deactivateAppOneTestCustomer_(firstResult.row && firstResult.row.customer_id);
  deactivateAppOneTestCustomer_(secondResult.row && secondResult.row.customer_id);
  return { name: 'testDuplicateDetectedOnMatchingIdTypeAndNumber_', pass: pass, detail: JSON.stringify({ first: firstResult.duplicateWarning, second: secondResult.duplicateWarning }) };
}

function testDeactivateSoftDeletesAndBlocksSecondCall_() {
  var fixture = validCustomerFixture_();
  fixture.id_number = 'APP001-DEACT-' + new Date().getTime();
  var created = customersCreate(fixture);
  if (!created.ok) {
    return { name: 'testDeactivateSoftDeletesAndBlocksSecondCall_', pass: false, detail: JSON.stringify(created) };
  }

  var firstDeactivate = customersDeactivate(created.row.customer_id, 'app-001 test cleanup');
  var secondDeactivate = customersDeactivate(created.row.customer_id, 'app-001 test cleanup retry');
  var stillListedByDefault = customersList({}).rows.some(function (row) { return row.customer_id === created.row.customer_id; });

  var pass = firstDeactivate.ok === true && !!firstDeactivate.row.deleted_at &&
    secondDeactivate.ok === false && secondDeactivate.status === 409 &&
    stillListedByDefault === false;
  return { name: 'testDeactivateSoftDeletesAndBlocksSecondCall_', pass: pass, detail: JSON.stringify({ firstDeactivate: firstDeactivate, secondDeactivate: secondDeactivate, stillListedByDefault: stillListedByDefault }) };
}

function testBillingRoleWriteRejected_() {
  // getSession() reads Session.getActiveUser() directly and cannot be mocked with a
  // fabricated identity from this test file (same limitation documented in FIX-006's
  // core/tests.gs). This exercises requireRole_ directly with a billing session shape,
  // the same guard every entry point above calls before touching the sheet.
  var billingSession = { ok: true, email: 'billing-fixture@example.com', role: 'billing' };
  var result = requireRole_(billingSession, ['management', 'sales']);
  var pass = result.ok === false && result.status === 403;
  return { name: 'testBillingRoleWriteRejected_', pass: pass, detail: JSON.stringify(result) };
}

function validCustomerFixture_() {
  return {
    legal_name: 'Cliente Prueba APP-001',
    person_type: 'individual',
    id_type: 'CC',
    id_number: 'APP001-FIXTURE',
    phone: '3000000000',
    email: 'cliente.prueba@example.com',
    contact_name: 'Contacto Prueba'
  };
}

function deactivateAppOneTestCustomer_(customerId) {
  if (!customerId) {
    return;
  }
  customersDeactivate(customerId, 'app-001 automated test cleanup');
}
