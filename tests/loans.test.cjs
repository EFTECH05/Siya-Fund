const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('../frontend/node_modules/typescript');

function load(file, dependencies = {}) {
  const filename = path.join(__dirname, '..', file);
  const code = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const module = { exports: {} };
  vm.runInNewContext(code, {
    module, exports: module.exports, Date, Intl, console,
    require(name) {
      if (!(name in dependencies)) throw new Error(`Unexpected import ${name}`);
      return dependencies[name];
    },
  }, { filename });
  return module.exports;
}
const models = load('frontend/src/models/Loan.ts');
function fixture({ user = { uid: 'owner' }, docs = [], detail = null, group = null, fail = null, changeSession = false, failWrite = false, loseAcknowledgement = false } = {}) {
  const calls = [];
  const auth = { currentUser: user };
  const writes = [];
  let storedDetail = detail;
  const service = load('frontend/src/services/LoanService.ts', {
    './firebase': { auth, db: {} },
    '../models/Loan': models,
    'firebase/firestore': {
      collection: (_, name) => name,
      where: (field, operator, value) => ({ field, operator, value }),
      query: (collection, filter) => ({ collection, filter }),
      doc: (_, collection, id) => collection === undefined ? { collection: _, id: 'new-loan' } : { collection, id },
      serverTimestamp: () => 'SERVER_TIMESTAMP',
      setDoc: async (ref, data) => {
        if (failWrite) throw Object.assign(new Error('denied'), { code: 'permission-denied' });
        writes.push({ ref, data });
        storedDetail = data;
        if (loseAcknowledgement) throw new Error('Connection lost after commit');
      },
      getDocs: async q => {
        calls.push(q);
        if (fail) throw fail;
        if (changeSession) auth.currentUser = { uid: 'another-user' };
        return { docs: docs.map(({ id, ...data }) => ({ id, data: () => data })) };
      },
      getDoc: async ref => {
        if (ref.collection === 'groups') return { exists: () => group !== null, data: () => group };
        calls.push(ref);
        if (fail) throw fail;
        if (changeSession) auth.currentUser = null;
        return { id: ref.id, exists: () => storedDetail !== null, data: () => storedDetail };
      },
    },
  });
  return { service, calls, writes, auth };
}
test('list uses owner-only server query and sorts newest first', async () => {
  const { service, calls } = fixture({ docs: [
    { id: 'older', userId: 'owner', amount: 250, applicationDate: '2026-10-01', status: 'pending' },
    { id: 'other-user', userId: 'someone-else', amount: 999, applicationDate: '2026-10-13', status: 'approved' },
    { id: 'newer', userId: 'owner', amount: 500, applicationDate: '2026-10-12', status: 'rejected' },
  ] });
  const results = await service.getMyLoans();
  assert.equal(calls[0].collection, 'loans');
  assert.deepEqual(Object.assign({}, calls[0].filter), { field: 'userId', operator: '==', value: 'owner' });
  assert.equal(results.map(loan => loan.id).join(','), 'newer,older');
  assert.equal(results[0].status, 'rejected');
});
test('signed-out requests do not touch Firestore', async () => {
  const { service, calls } = fixture({ user: null });
  await assert.rejects(service.getMyLoans(), /log in/);
  await assert.rejects(service.getMyLoan('loan-1'), /log in/);
  assert.equal(calls.length, 0);
});
test('details return own record; foreign, missing and invalid IDs return unavailable', async () => {
  const own = fixture({ detail: { userId: 'owner', amount: 1000, status: 'approved' } });
  assert.equal((await own.service.getMyLoan('loan-1')).amount, 1000);
  const foreign = fixture({ detail: { userId: 'other', amount: 9000 } });
  assert.equal(await foreign.service.getMyLoan('loan-1'), null);
  assert.equal(await fixture().service.getMyLoan('missing'), null);
  const invalid = fixture();
  assert.equal(await invalid.service.getMyLoan('other/path'), null);
  assert.equal(invalid.calls.length, 0);
});
test('permission denial hides loan details, while network failure is reported', async () => {
  const denied = fixture({ fail: { code: 'permission-denied' } });
  assert.equal(await denied.service.getMyLoan('foreign-loan'), null);
  const offline = fixture({ fail: new Error('offline') });
  await assert.rejects(offline.service.getMyLoan('loan-1'), /offline/);
  await assert.rejects(offline.service.getMyLoans(), /offline/);
});
test('results cannot cross an account change or logout during a request', async () => {
  const changed = fixture({ changeSession: true });
  await assert.rejects(changed.service.getMyLoans(), /session changed/);
  const loggedOut = fixture({ changeSession: true, detail: { userId: 'owner' } });
  await assert.rejects(loggedOut.service.getMyLoan('loan-1'), /session changed/);
});
test('timestamps, rand amounts and dates use the stored values', () => {
  const loan = models.loanFromDocument('id', { userId: 'owner', amount: 12500.5, applicationDate: { toDate: () => new Date('2026-10-12T23:30:00Z') }, status: 'under_review' });
  assert.equal(loan.applicationDate.toISOString(), '2026-10-12T23:30:00.000Z');
  assert.match(models.formatLoanAmount(loan), /12.*500.*50/);
  assert.match(models.formatLoanDate(loan.applicationDate), /13.*Oct.*2026/);
  assert.equal(models.loanStatusLabel(loan.status), 'Under Review');
});
test('bad or missing fields never fabricate a pending status, amount or date', () => {
  const loan = models.loanFromDocument('id', { amount: 'not-money', applicationDate: 'not-a-date' });
  assert.equal(loan.status, 'unknown');
  assert.equal(loan.amount, null);
  assert.equal(loan.applicationDate, null);
  assert.equal(models.formatLoanAmount(loan), 'Amount unavailable');
  assert.equal(models.formatLoanDate(loan.applicationDate), 'Date unavailable');
  assert.equal(models.loanStatusLabel('custom_status'), 'Custom Status');
});

test('submission uses authenticated owner, server time and pending status; ignores injected fields', async () => {
  const { service, writes } = fixture();
  const request = service.prepareLoanApplication({ amount: '2500.25', purpose: ' Repairs ', repaymentMonths: '12', userId: 'other', status: 'approved', interestRate: 0 });
  assert.equal(await request.submit(), 'new-loan');
  assert.equal(writes.length, 1);
  const data = writes[0].data;
  assert.equal(data.userId, 'owner');
  assert.equal(data.status, 'pending');
  assert.equal(data.createdAt, 'SERVER_TIMESTAMP');
  assert.equal(data.updatedAt, 'SERVER_TIMESTAMP');
  assert.equal(data.amount, 2500.25);
  assert.equal(data.purpose, 'Repairs');
  assert.equal(data.termMonths, 12);
  assert.equal('applicationDate' in data, false);
  assert.equal('repaymentMonths' in data, false);
  assert.equal('interestRate' in data, false);
});
test('invalid applications and signed-out users cannot prepare a write', () => {
  const { service, writes } = fixture();
  for (const amount of ['0', '-1', '1.234', 'NaN', '1,000', '']) {
    assert.throws(() => service.prepareLoanApplication({ amount, purpose: 'Repairs', repaymentMonths: '12' }), /amount/);
  }
  assert.throws(() => service.prepareLoanApplication({ amount: '100', purpose: ' ', repaymentMonths: '12' }), /purpose/);
  assert.throws(() => service.prepareLoanApplication({ amount: '100', purpose: 'Repairs', repaymentMonths: '1.5' }), /repayment term/);
  assert.throws(() => fixture({ user: null }).service.prepareLoanApplication({ amount: '100', purpose: 'Repairs', repaymentMonths: '12' }), /log in/);
  assert.equal(writes.length, 0);
});
test('write denial is reported; session change before submit blocks writing', async () => {
  const denied = fixture({ failWrite: true });
  const request = denied.service.prepareLoanApplication({ amount: '100', purpose: 'Repairs', repaymentMonths: '12' });
  await assert.rejects(request.submit(), /denied/);
  assert.equal(denied.writes.length, 0);
  const changed = fixture();
  const prepared = changed.service.prepareLoanApplication({ amount: '100', purpose: 'Repairs', repaymentMonths: '12' });
  changed.auth.currentUser = { uid: 'different-user' };
  await assert.rejects(prepared.submit(), /session changed/);
  assert.equal(changed.writes.length, 0);
});
test('retry after interrupted acknowledgement reuses the saved loan without another write', async () => {
  const { service, writes } = fixture({ loseAcknowledgement: true });
  const request = service.prepareLoanApplication({ amount: '100', purpose: 'Repairs', repaymentMonths: '12' });
  await assert.rejects(request.submit(), /Connection lost/);
  assert.equal(await request.submit(), request.id);
  assert.equal(writes.length, 1);
  assert.equal(writes[0].data.termMonths, 12);
});


test('canonical Firestore creation date and term are displayed; legacy names remain readable', () => {
  const canonical = models.loanFromDocument('id', {
    userId: 'owner', amount: 2500, createdAt: { toDate: () => new Date('2026-10-13T10:00:00Z') }, termMonths: 12, status: 'pending',
  });
  assert.equal(canonical.applicationDate.toISOString(), '2026-10-13T10:00:00.000Z');
  assert.equal(canonical.repaymentMonths, 12);
  const legacy = models.loanFromDocument('old', { applicationDate: '2026-10-01', repaymentMonths: 6 });
  assert.equal(legacy.repaymentMonths, 6);
  assert.ok(legacy.applicationDate);
});
test('repayment term enforces the existing Firebase range of 1 to 120 months', () => {
  for (const repaymentMonths of ['', '0', '121', '-1', '1.5']) {
    assert.throws(() => models.validateLoanApplication({ amount: '100', purpose: 'Repairs', repaymentMonths }), /1 and 120/);
  }
  assert.equal(models.validateLoanApplication({ amount: '100', purpose: 'Repairs', repaymentMonths: '120' }).repaymentMonths, 120);
});

test('merged loan parser reads the shared branch reason field', () => {
  assert.equal(models.loanFromDocument('shared', { reason: 'School fees', status: 'Pending' }).purpose, 'School fees');
});

test('group-linked loan preserves membership and authenticated ownership', async () => {
  const member = fixture({ group: { creatorId: 'admin', members: ['owner'] } });
  const prepared = member.service.prepareLoanApplication({ amount: '100', purpose: 'School fees', repaymentMonths: '12', groupId: 'group-1' });
  await prepared.submit();
  assert.equal(member.writes[0].data.groupId, 'group-1');
  assert.equal(member.writes[0].data.userId, 'owner');
  const outsider = fixture({ group: { creatorId: 'admin', members: ['other'] } });
  await assert.rejects(outsider.service.prepareLoanApplication({ amount: '100', purpose: 'School fees', repaymentMonths: '12', groupId: 'group-1' }).submit(), /belong/);
  assert.equal(outsider.writes.length, 0);
});

test('compatibility API cannot query another user loans', async () => {
  const { service, calls } = fixture();
  await assert.rejects(service.getLoansByUser('other'), /own loan/);
  assert.equal(calls.length, 0);
});
