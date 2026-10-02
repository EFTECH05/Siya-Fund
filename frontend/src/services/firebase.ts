// Import Firebase's app initialization function
import { initializeApp } from "firebase/app";

// Firebase configuration for the Siya-Fund application
const firebaseConfig = {
  apiKey: "AIzaSyAcucO9djMD4NES9yxaIAvOf9jwwKmklto",
  authDomain: "siya-fund.firebaseapp.com",
  projectId: "siya-fund",
  storageBucket: "siya-fund.firebasestorage.app",
  messagingSenderId: "636115954194",
  appId: "1:636115954194:web:8bb7135cf24b43411e86cb",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export the Firebase app
export default app;
