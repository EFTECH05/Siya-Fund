 // ==========================================
 // FIREBASE APP INITIALIZATION
 // ==========================================

 // Import Firebase app initialization functions
 import {
   getApp,
   getApps,
   initializeApp,
 } from "firebase/app";

 // Import Firebase Firestore
 import { getFirestore } from "firebase/firestore";

 // ==========================================
 // FIREBASE CONFIGURATION
 // ==========================================

 const firebaseConfig = {
   apiKey: "AIzaSyAcucO9djMD4NES9yxaIAvOf9jwwKmklto",
   authDomain: "siya-fund.firebaseapp.com",
   projectId: "siya-fund",
   storageBucket: "siya-fund.firebasestorage.app",
   messagingSenderId: "636115954194",
   appId: "1:636115954194:web:8bb7135cf24b43411e86cb",
 };

 // ==========================================
 // INITIALIZE FIREBASE
 // ==========================================

 // Prevent Firebase from being initialized
 // more than once during development.

 const app = getApps().length === 0
   ? initializeApp(firebaseConfig)
   : getApp();

 // ==========================================
 // INITIALIZE FIRESTORE
 // ==========================================

 export const db = getFirestore(app);

 // ==========================================
 // EXPORT FIREBASE APP
 // ==========================================

 export default app;