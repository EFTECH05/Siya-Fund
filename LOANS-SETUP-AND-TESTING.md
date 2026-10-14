# Loans: setup and testing

The original Siya-Fund project folder is updated directly. No ZIP extraction is needed.

## Firebase rules

The standalone loan flow matches the existing canonical fields. The local
`firestore.loans.rules` file also permits an optional groupId for a verified
group member, to integrate the shared branch's group-linked loan requests.
This merge has not published or modified your live rules. Review the optional
groupId rule in a test project before enabling group-linked requests against
Firebase; standalone requests do not require that additional field.

## Use Request Loan

1. Keep the backend running for email OTP login.
2. Start the frontend with `npm.cmd run web` in the frontend folder.
3. Log in. Select Request Loan on the dashboard (or Request a Loan in the loan list).
4. Enter an amount in rand, a purpose and a whole-number repayment term from 1 to
   120 months. The default term is 12 months.
5. Select Submit Application. The saved application's details open with Pending
   status. Return to My Loan Applications to see the amount, application date,
   repayment term and status. Refresh reloads the latest stored status.

## Firestore schema written by the form

Collection: `loans`. Required fields:

| Field | Type | Source |
| --- | --- | --- |
| userId | string | Signed-in Firebase Authentication UID |
| amount | number | Requested amount in rand, not cents |
| currency | string | ZAR |
| purpose | string | Entered purpose, up to 500 characters |
| termMonths | integer | Required repayment term, 1–120 months |
| status | string | pending |
| createdAt | timestamp | Firebase server timestamp |
| updatedAt | timestamp | Firebase server timestamp |
| groupId | optional string | Selected group, with membership checked before submission |

The UI maps createdAt to application date and termMonths to repayment term. It
also reads legacy applicationDate/repaymentMonths records and the shared branch's
reason field if present. Profile
registration and edits now write phoneNumber, matching the user profile rule;
old phone values remain readable.

The current rules permit super-admin reads/changes and owner reads/validated
creation. The member loan screens show only the signed-in user's applications.
Loan approval and repayment processing remain outside this feature.

## Acceptance checks

- Submit a pending application and verify fields in Firestore.
- Confirm it appears in My Loan Applications, sorted newest first.
- Open details; verify amount, date, term and purpose against the saved document.
- Change status using authorized administration in a test project, then refresh.
- Another user's loan URL must show Loan unavailable.
- Logged-out users opening list, details or request routes must return to login.
- Invalid amounts, blank purposes, and terms outside 1–120 must be rejected.
- Denied/offline saves must show an error. Retry an uncertain save without
  changing the form to reuse the application reference and avoid duplicate saves.

## Automated checks

From the project root:

```powershell
frontend\node_modules\.bin\tsc.cmd --project frontend\tsconfig.json --noEmit
node --test tests\loans.test.cjs tests\profile-and-otp.test.cjs
```

The service tests verify exact write fields, server timestamps, pending status,
validation, ownership, failed saves, duplicate retries, date/amount display,
and profile phoneNumber compatibility. Service tests mock Firebase; they do not
prove the live deployment's permissions or email delivery.

The rule tests in tests/loans.rules.test.cjs use firebase.loans-test.json with the
isolated demo-siya-loans project. They require Firebase Emulator Suite, a compatible
Java runtime, @firebase/rules-unit-testing and firebase. Set LOAN_TEST_MODULE_ROOT
to the installed tools' node_modules folder if they are installed separately:

```powershell
firebase emulators:exec --only firestore --project demo-siya-loans --config firebase.loans-test.json "node --test tests/loans.rules.test.cjs"
```

Rule emulator tests were prepared but not run in this environment: the available
Java runtime is version 8, and Firebase Emulator Suite tooling is not installed.
Use a compatible Java runtime and the emulator before publishing any rule change.
Live submission still needs confirmation after restarting the frontend.
