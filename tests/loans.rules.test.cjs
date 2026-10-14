const { test, before, after } = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const moduleRoot = process.env.LOAN_TEST_MODULE_ROOT;
const rulesTesting = moduleRoot ? require(path.join(moduleRoot, '@firebase/rules-unit-testing')) : require('@firebase/rules-unit-testing');
const firestore = moduleRoot ? require(path.join(moduleRoot, 'firebase/firestore')) : require('firebase/firestore');
const { initializeTestEnvironment, assertSucceeds, assertFails } = rulesTesting;
const { doc, getDoc, getDocs, collection, query, where, setDoc, updateDoc, deleteDoc, Timestamp, serverTimestamp } = firestore;
let environment;
before(async () => {
  environment = await initializeTestEnvironment({
    projectId: 'demo-siya-loans',
    firestore: { host: '127.0.0.1', port: 8189, rules: fs.readFileSync(path.join(__dirname, '../firestore.loans.rules'), 'utf8') },
  });
  await environment.withSecurityRulesDisabled(async context => {
    const db = context.firestore();
    await setDoc(doc(db, 'loans', 'own-loan'), { userId: 'owner', amount: 1000, createdAt: Timestamp.now(), status: 'pending' });
    await setDoc(doc(db, 'loans', 'foreign-loan'), { userId: 'other', amount: 9000, createdAt: Timestamp.now(), status: 'approved' });
  });
});
after(async () => { if (environment) await environment.cleanup(); });
test('rule permits owner get and owner-filtered list', async () => {
  const db = environment.authenticatedContext('owner').firestore();
  await assertSucceeds(getDoc(doc(db, 'loans', 'own-loan')));
  const result = await assertSucceeds(getDocs(query(collection(db, 'loans'), where('userId', '==', 'owner'))));
  if (result.size !== 1 || result.docs[0].id !== 'own-loan') throw new Error('Expected only own loan');
});
test('rule denies foreign get, broad list and forged owner filter', async () => {
  const db = environment.authenticatedContext('owner').firestore();
  await assertFails(getDoc(doc(db, 'loans', 'foreign-loan')));
  await assertFails(getDocs(collection(db, 'loans')));
  await assertFails(getDocs(query(collection(db, 'loans'), where('userId', '==', 'other'))));
});
test('rule denies unauthenticated get and list', async () => {
  const db = environment.unauthenticatedContext().firestore();
  await assertFails(getDoc(doc(db, 'loans', 'own-loan')));
  await assertFails(getDocs(query(collection(db, 'loans'), where('userId', '==', 'owner'))));
});
test('rule allows a valid pending own application', async () => {
  const db = environment.authenticatedContext('owner').firestore();
  await assertSucceeds(setDoc(doc(db, 'loans', 'valid-request'), {
    userId: 'owner', amount: 2500.25, currency: 'ZAR', status: 'pending',
    purpose: 'Repairs', createdAt: serverTimestamp(), updatedAt: serverTimestamp(), termMonths: 12,
  }));
});
test('rule denies forged requests and invalid fields', async () => {
  const db = environment.authenticatedContext('owner').firestore();
  const data = { userId: 'owner', amount: 100, currency: 'ZAR', status: 'pending', purpose: 'Repairs', createdAt: serverTimestamp(), updatedAt: serverTimestamp(), termMonths: 12 };
  await assertFails(setDoc(doc(db, 'loans', 'bad-owner'), { ...data, userId: 'other' }));
  await assertFails(setDoc(doc(db, 'loans', 'bad-status'), { ...data, status: 'approved' }));
  await assertFails(setDoc(doc(db, 'loans', 'bad-amount'), { ...data, amount: -1 }));
  await assertFails(setDoc(doc(db, 'loans', 'bad-extra'), { ...data, interestRate: 0 }));
  await assertFails(setDoc(doc(db, 'loans', 'bad-date'), { ...data, createdAt: Timestamp.fromMillis(0) }));
  await assertFails(setDoc(doc(db, 'loans', 'bad-term'), { ...data, termMonths: 1.5 }));
  await assertFails(setDoc(doc(environment.unauthenticatedContext().firestore(), 'loans', 'anonymous'), data));
});
test('rule denies incomplete creation, status changes, owner changes and deletion', async () => {
  const db = environment.authenticatedContext('owner').firestore();
  await assertFails(setDoc(doc(db, 'loans', 'new'), { userId: 'owner', amount: 100 }));
  await assertFails(updateDoc(doc(db, 'loans', 'own-loan'), { status: 'approved' }));
  await assertFails(updateDoc(doc(db, 'loans', 'foreign-loan'), { userId: 'owner' }));
  await assertFails(deleteDoc(doc(db, 'loans', 'own-loan')));
});

