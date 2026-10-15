const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('../frontend/node_modules/typescript');

function load(file, dependencies, onRequire = () => {}) {
  const filename = path.join(__dirname, '..', file);
  const source = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const module = { exports: {} };
  vm.runInNewContext(source, {
    module, exports: module.exports, console: { log() {}, error() {}, warn() {} },
    require(name) {
      onRequire(name);
      if (!(name in dependencies)) throw new Error(`Unexpected import ${name}`);
      return dependencies[name];
    },
  }, { filename });
  return module.exports;
}
function profileFixture({ failWrite = false, user = { uid: 'user-123', email: 'real@example.com' }, platform = 'web', expoGo = false } = {}) {
  const writes = [];
  let cleared = 0;
  let googleImports = 0;
  const auth = { currentUser: user };
  const models = load('frontend/src/models/User.ts', {});
  const service = load('frontend/src/services/AuthService.ts', {
    'firebase/auth': { signOut: async () => { auth.currentUser = null; } },
    'firebase/firestore': {
      doc: (_, collection, uid) => `${collection}/${uid}`,
      getDoc: async () => ({ exists: () => true, data: () => ({ firstName: 'Old', lastName: 'Name', email: 'stale@example.com', role: 'super_admin' }) }),
      updateDoc: async (ref, fields) => { if (failWrite) throw new Error('permission-denied'); writes.push({ ref, fields }); },
      serverTimestamp: () => 'SERVER_TIMESTAMP',
    },
    'react-native': { Platform: { OS: platform } },
    'expo': { isRunningInExpoGo: () => expoGo },
    '../models/User': models,
    './RegistrationStore': { clearRegistrationData: () => cleared++ },
    './LoginOtpStore': { clearLoginEmail: () => cleared++ },
    '@react-native-google-signin/google-signin': { GoogleSignin: { configure() {}, signOut() { throw new Error('Must not call native sign-out on web'); } } },
    './firebase': { auth, db: {} },
  }, name => { if (name === '@react-native-google-signin/google-signin') googleImports++; });
  return { service, auth, writes, getCleared: () => cleared, getGoogleImports: () => googleImports };
}
test('profile reads own UID and uses authenticated email; old phone defaults empty', async () => {
  const { service } = profileFixture();
  const result = await service.getUserProfile();
  assert.equal(result.uid, 'user-123');
  assert.equal(result.email, 'real@example.com');
  assert.equal(result.phone, '');
});
test('profile save trims fields and never writes injected role/email or another UID', async () => {
  const { service, writes } = profileFixture();
  const result = await service.updateUserProfile({ firstName: ' New ', lastName: ' Name ', phone: ' 0712345678 ', role: 'super_admin', email: 'attacker@example.com', uid: 'other-user' });
  assert.equal(writes[0].ref, 'users/user-123');
  assert.deepEqual(Object.keys(writes[0].fields).sort(), ['displayName', 'firstName', 'lastName', 'phoneNumber', 'updatedAt']);
  assert.equal(writes[0].fields.phoneNumber, '0712345678');
  assert.equal(result.displayName, 'New Name');
  assert.equal(result.email, 'real@example.com');
});
test('signed-out access and invalid fields cannot write', async () => {
  const signedOut = profileFixture({ user: null });
  await assert.rejects(signedOut.service.getUserProfile(), /log in/);
  await assert.rejects(signedOut.service.updateUserProfile({ firstName: 'A', lastName: 'B', phone: '' }), /log in/);
  const signedIn = profileFixture();
  await assert.rejects(signedIn.service.updateUserProfile({ firstName: ' ', lastName: 'B', phone: '' }), /first and last name/);
  await assert.rejects(signedIn.service.updateUserProfile({ firstName: 'A', lastName: 'B', phone: 'invalid' }), /phone/);
  assert.equal(signedIn.writes.length, 0);
});
test('Firestore failure rejects save; logout clears Firebase and temporary stores', async () => {
  const fixture = profileFixture({ failWrite: true });
  await assert.rejects(fixture.service.updateUserProfile({ firstName: 'A', lastName: 'B', phone: '' }), /permission-denied/);
  await fixture.service.logoutUser();
  assert.equal(fixture.auth.currentUser, null);
  assert.equal(fixture.getCleared(), 2);
});

test('Expo Go starts and logs out without loading the unsupported native Google module', async () => {
  const fixture = profileFixture({ platform: 'ios', expoGo: true });
  assert.equal(fixture.getGoogleImports(), 0);
  await assert.rejects(fixture.service.loginWithGoogle(), /email and password/);
  assert.equal(fixture.getGoogleImports(), 0);
  await fixture.service.logoutUser();
  assert.equal(fixture.auth.currentUser, null);
  assert.equal(fixture.getGoogleImports(), 0);
});
function response() {
  return { statusCode: 200, body: null, status(value) { this.statusCode = value; return this; }, json(value) { this.body = value; return this; } };
}
test('missing SMTP gives actionable 503 without leaking credential details', async () => {
  const controller = load('backend/src/controllers/otpController.ts', {
    '../services/otpService': { generateOTP: () => '123456' },
    '../services/emailService': { sendOTPEmail: async () => { throw Object.assign(new Error('private SMTP configuration details'), { code: 'OTP_EMAIL_NOT_CONFIGURED' }); } },
  });
  const res = response();
  await controller.sendOTP({ body: { email: 'test@example.com' } }, res);
  assert.equal(res.statusCode, 503);
  assert.equal(res.body.code, 'OTP_EMAIL_UNAVAILABLE');
  assert.ok(!res.body.message.includes('private'));
});
test('OTP rejects malformed requests and normalizes valid recipient', async () => {
  let recipient;
  const controller = load('backend/src/controllers/otpController.ts', {
    '../services/otpService': { generateOTP: () => '123456', verifyOTP: () => true },
    '../services/emailService': { sendOTPEmail: async email => { recipient = email; } },
  });
  const invalid = response();
  await controller.sendOTP({ body: { email: 123 } }, invalid);
  assert.equal(invalid.statusCode, 400);
  const valid = response();
  await controller.sendOTP({ body: { email: ' TEST@Example.com ' } }, valid);
  assert.equal(valid.statusCode, 200);
  assert.equal(recipient, 'test@example.com');
  const badCode = response();
  controller.verifyOTPCode({ body: { email: 'test@example.com', otp: 123456 } }, badCode);
  assert.equal(badCode.statusCode, 400);
});
