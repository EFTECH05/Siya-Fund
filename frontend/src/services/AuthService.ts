
// ==========================================
// FIREBASE AUTHENTICATION FUNCTIONS
// ==========================================

// Import Firebase Authentication functions
import {
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithEmailAndPassword,
  signOut,
  getAuth,
} from "firebase/auth";

// Import Firestore functions
import {
  doc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";

// Import Firebase application configuration
import app, { db } from "./firebase";

// ==========================================
// GET FIREBASE AUTH INSTANCE
// ==========================================

// Get the Firebase Authentication instance
const auth = getAuth(app);

// ==========================================
// REGISTER USER
// ==========================================

export const registerUser = async (
  firstName: string,
  lastName: string,
  email: string,
  password: string,
) => {

  // ========================================
  // CLEAN USER INFORMATION
  // ========================================

  const cleanFirstName = firstName.trim();
  const cleanLastName = lastName.trim();
  const cleanEmail = email.trim().toLowerCase();

  // ========================================
  // CREATE FIREBASE AUTH ACCOUNT
  // ========================================

  console.log(
    "Creating Firebase account for:",
    cleanEmail,
  );

  const userCredential =
    await createUserWithEmailAndPassword(
      auth,
      cleanEmail,
      password,
    );

  // Get the newly created Firebase user
  const user = userCredential.user;

  console.log(
    "Firebase account created successfully.",
  );

  console.log(
    "Firebase UID:",
    user.uid,
  );

  // ========================================
  // SAVE DISPLAY NAME
  // ========================================

  await updateProfile(user, {
    displayName:
      `${cleanFirstName} ${cleanLastName}`,
  });

  console.log(
    "Firebase display name updated:",
    `${cleanFirstName} ${cleanLastName}`,
  );

  // ========================================
  // CREATE FIRESTORE USER DOCUMENT
  // ========================================

  await setDoc(
    doc(db, "users", user.uid),
    {
      // Firebase Authentication UID
      uid: user.uid,

      // User first name
      firstName: cleanFirstName,

      // User last name
      lastName: cleanLastName,

      // Full display name
      displayName:
        `${cleanFirstName} ${cleanLastName}`,

      // User email
      email: cleanEmail,

      // Normal users receive the user role
      role: "user",

      // Email has already been verified
      // through our OTP system
      emailVerified: true,

      // Account creation timestamp
      createdAt: serverTimestamp(),

      // Last update timestamp
      updatedAt: serverTimestamp(),
    },
  );

  console.log(
    "Firestore user document created successfully.",
  );

  // ========================================
  // REGISTRATION COMPLETE
  // ========================================

  console.log(
    "Registration completed successfully.",
  );

  console.log(
    "Email was verified using Siya-Fund OTP.",
  );

  // ========================================
  // RETURN FIREBASE USER
  // ========================================

  return user;
};

// ==========================================
// LOGIN USER
// ==========================================

export const loginUser = async (
  email: string,
  password: string,
) => {

  // Clean email address
  const cleanEmail = email.trim().toLowerCase();

  // ========================================
  // SIGN IN
  // ========================================

  console.log(
    "Attempting login for:",
    cleanEmail,
  );

  const userCredential =
    await signInWithEmailAndPassword(
      auth,
      cleanEmail,
      password,
    );

  // Get logged-in user
  const user = userCredential.user;

  // ========================================
  // LOG LOGIN INFORMATION
  // ========================================

  console.log(
    "Login successful.",
  );

  console.log(
    "Firebase UID:",
    user.uid,
  );

  console.log(
    "Email:",
    user.email,
  );

  console.log(
    "Email verified:",
    user.emailVerified,
  );

  // ========================================
  // RETURN FIREBASE USER
  // ========================================

  return user;
};

// ==========================================
// GET USER ROLE
// ==========================================

export const getUserRole = async () => {

  // Get the currently logged-in user
  const user = auth.currentUser;

  // ========================================
  // CHECK USER
  // ========================================

  if (!user) {

    console.log(
      "No logged-in user found.",
    );

    return null;
  }

  // ========================================
  // REFRESH ID TOKEN
  // ========================================

  // Force Firebase to refresh the ID token
  // so the latest custom claims are available.
  const tokenResult =
    await user.getIdTokenResult(true);

  // ========================================
  // GET ROLE
  // ========================================

  const role =
    tokenResult.claims.role;

  // ========================================
  // LOG ROLE
  // ========================================

  console.log(
    "Firebase user role:",
    role,
  );

  // ========================================
  // RETURN ROLE
  // ========================================

  return typeof role === "string"
    ? role
    : "user";
};

// ==========================================
// LOGOUT USER
// ==========================================

export const logoutUser = async () => {

  // ========================================
  // SIGN OUT
  // ========================================

  await signOut(auth);

  console.log(
    "User logged out successfully.",
  );
};

// ==========================================
// GET CURRENT USER
// ==========================================

export const getCurrentUser = () => {

  // Return the currently signed-in user
  return auth.currentUser;
};

