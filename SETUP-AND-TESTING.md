# Local setup and profile acceptance checks

## Run the app

Use two PowerShell terminals. All commands below assume the project directory.

1. In `backend`, run `npm.cmd install`. Copy `.env.example` to `.env` and fill in
   `SMTP_USER` and `SMTP_PASS` with your SMTP account credentials. For Gmail,
   use a Google app password, not your normal account password. Other providers
   can set `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, and `SMTP_FROM`.
   Keep `.env` private. Then run `npm.cmd run dev`.
2. In `frontend`, run `npm.cmd run web`.
   The default backend address is `http://localhost:5000` for web and
   `http://10.0.2.2:5000` for an Android emulator. On a physical phone, copy
   `.env.example` to `.env` and set `EXPO_PUBLIC_API_URL` to the computer's LAN
   address, for example `http://192.168.1.20:5000`. Restart Expo after changing it.

The backend root URL should respond with a running message before registering.
An unavailable backend, missing SMTP credentials, or rejected SMTP login prevents
OTP delivery. The frontend now explains unavailable verification separately from
account creation. Delivery has not been verified with real credentials.

## Profile acceptance checks

1. Register a test account, receive and enter its emailed OTP, then log in.
2. On the dashboard, select **My Profile**. Confirm first name, last name,
   Firebase sign-in email, and phone are shown. Old accounts may have an empty
   phone because registration previously discarded it.
3. Edit first name, last name, and phone; select **Save Changes**. Confirm success,
   reload, and check the values persisted in `users/<signed-in UID>` in Firestore.
4. Confirm blank names and invalid phone numbers are rejected. Email is read-only.
   Profile updates must not change `role`, `emailVerified`, provider, or email.
5. Disconnect network or deny the write in a test environment: saving must show
   failure and must not report success.
6. Log out from profile and dashboard. Both must sign out of Firebase and redirect
   to login. Reload `/profile` and `/dashboard` while signed out: neither should
   display private profile data.

Firestore must allow users to read their own profile and update only supported
personal fields. These local changes do not deploy or alter your Firebase rules.
Check the existing rules in Firebase before accepting the story.

## Local automated checks

From the project root:

```powershell
frontend\node_modules\.bin\tsc.cmd --project frontend\tsconfig.json --noEmit
npm.cmd run build --prefix backend
node --test tests\profile-and-otp.test.cjs
```

The service tests mock Firebase and email delivery. They do not prove real email
receipt, deployed Firestore permissions, or browser interaction.
