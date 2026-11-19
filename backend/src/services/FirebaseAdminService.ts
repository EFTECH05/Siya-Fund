
// ==========================================
// FIREBASE ADMIN SERVICE
// ==========================================
//
// This file connects the Node.js backend
// to the Siya-Fund Firebase project.
//
// IMPORTANT:
// The Firebase service-account JSON stays
// OUTSIDE the GitHub repository.
//

import {
  applicationDefault,
  getApps,
  initializeApp,
} from "firebase-admin/app";

import {
  getAuth,
} from "firebase-admin/auth";

import {
  getFirestore,
} from "firebase-admin/firestore";

// ==========================================
// INITIALIZE FIREBASE ADMIN
// ==========================================

const firebaseAdminApp =
  getApps().length === 0
    ? initializeApp({
        credential: applicationDefault(),
        projectId: "siya-fund",
      })
    : getApps()[0];

// ==========================================
// FIREBASE ADMIN AUTH
// ==========================================

export const adminAuth =
  getAuth(firebaseAdminApp);

// ==========================================
// FIRESTORE DATABASE
// ==========================================

export const adminDb =
  getFirestore(firebaseAdminApp);

// ==========================================
// EXPORT APP
// ==========================================

export default firebaseAdminApp;
