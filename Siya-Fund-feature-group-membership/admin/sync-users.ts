// ==========================================
// SYNC FIREBASE AUTH USERS TO FIRESTORE
// ==========================================
//
// This script takes all users from Firebase
// Authentication and creates/updates their
// profile documents inside:
//
// Firestore
// └── users
//     └── {uid}
//
// This is a ONE-TIME developer/admin utility.
// It is NOT part of the Expo frontend.
//
// Run this file from the admin folder with:
//
// npx tsx sync-users.ts
//
// ==========================================


// ==========================================
// FIREBASE ADMIN IMPORTS
// ==========================================

import {
  initializeApp,
  applicationDefault,
} from "firebase-admin/app";

import {
  getAuth,
} from "firebase-admin/auth";

import {
  getFirestore,
  FieldValue,
} from "firebase-admin/firestore";


// ==========================================
// INITIALIZE FIREBASE ADMIN
// ==========================================
//
// applicationDefault() uses the service-account
// file from GOOGLE_APPLICATION_CREDENTIALS.
//
// Example:
//
// export GOOGLE_APPLICATION_CREDENTIALS="$HOME/siya-fund-service-account.json"
//

initializeApp({
  credential: applicationDefault(),
  projectId: "siya-fund",
});


// ==========================================
// FIREBASE SERVICES
// ==========================================

const auth = getAuth();
const db = getFirestore();


// ==========================================
// SUPER ADMIN EMAIL
// ==========================================
//
// This account already has the:
//
// role: super_admin
//
// custom claim.
//

const SUPER_ADMIN_EMAIL = "franklin@siya-fund.dev";


// ==========================================
// SYNC USERS
// ==========================================

async function syncUsers() {

  console.log("");
  console.log("==========================================");
  console.log("SIYA-FUND USER SYNCHRONIZATION");
  console.log("==========================================");
  console.log("");
  console.log("Reading users from Firebase Authentication...");
  console.log("");


  // ------------------------------------------
  // Variables used for pagination
  // ------------------------------------------

  let nextPageToken: string | undefined = undefined;

  let totalUsers = 0;

  let totalCreatedOrUpdated = 0;


  // ------------------------------------------
  // Firebase allows up to 1,000 users per page.
  // ------------------------------------------

  do {

    // Get up to 1,000 Firebase Authentication users
    const result = await auth.listUsers(
      1000,
      nextPageToken,
    );


    // ------------------------------------------
    // Process every Firebase Authentication user
    // ------------------------------------------

    for (const user of result.users) {

      totalUsers++;


      // ----------------------------------------
      // Determine the user's role
      // ----------------------------------------
      //
      // Super Admin gets super_admin.
      //
      // Existing custom claims are preserved
      // where possible.
      //
      // All other users default to "user".
      //

      let role = "user";


      if (user.email === SUPER_ADMIN_EMAIL) {

        role = "super_admin";

      } else if (
        typeof user.customClaims?.role === "string"
      ) {

        role = user.customClaims.role;
      }


      // ----------------------------------------
      // Convert Firebase timestamps
      // ----------------------------------------
      //
      // Firebase Admin gives us creationTime
      // and lastSignInTime as strings.
      //
      // We use server timestamps for the
      // Firestore document when appropriate.
      //

      const userRef = db
        .collection("users")
        .doc(user.uid);


      // ----------------------------------------
      // Create/update Firestore user document
      // ----------------------------------------
      //
      // merge: true means:
      //
      // - Create the document if it doesn't exist.
      // - Update the fields if it already exists.
      // - Preserve other Firestore fields.
      //

      await userRef.set(
        {
          uid: user.uid,

          // Firebase Authentication information
          email: user.email ?? "",
          displayName: user.displayName ?? "",

          // Account status
          emailVerified: user.emailVerified,

          // Siya-Fund role
          role: role,

          // Phone number if Firebase has one
          phoneNumber: user.phoneNumber ?? "",

          // Firebase account timestamps
          firebaseCreatedAt: user.metadata.creationTime ?? null,
          lastSignInTime: user.metadata.lastSignInTime ?? null,

          // Update timestamp
          updatedAt: FieldValue.serverTimestamp(),
        },
        {
          merge: true,
        },
      );


      totalCreatedOrUpdated++;


      // ----------------------------------------
      // Display progress
      // ----------------------------------------

      console.log(
        `Synced: ${user.email ?? user.uid} | role: ${role}`,
      );
    }


    // ------------------------------------------
    // Get next page
    // ------------------------------------------

    nextPageToken = result.pageToken;


  } while (nextPageToken);


  // ==========================================
  // FINISHED
  // ==========================================

  console.log("");
  console.log("==========================================");
  console.log("SYNCHRONIZATION COMPLETE");
  console.log("==========================================");
  console.log("");
  console.log("Firebase Authentication users:", totalUsers);
  console.log("Firestore users synced:", totalCreatedOrUpdated);
  console.log("");
  console.log("Firestore collection:");
  console.log("users/{uid}");
  console.log("");
  console.log("==========================================");
}


// ==========================================
// RUN SCRIPT
// ==========================================

syncUsers().catch((error) => {

  console.error("");
  console.error("==========================================");
  console.error("USER SYNCHRONIZATION FAILED");
  console.error("==========================================");
  console.error("");

  console.error(error);

  console.error("");

  process.exit(1);
});