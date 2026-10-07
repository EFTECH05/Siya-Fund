

// ==========================================
// FIREBASE AUTHENTICATION FUNCTIONS
// ==========================================

// Import Firebase Authentication functions

import {
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  getAuth,
} from "firebase/auth";

// ==========================================
// FIRESTORE FUNCTIONS
// ==========================================

// Import Firestore functions

import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";

// ==========================================
// FIREBASE APPLICATION CONFIGURATION
// ==========================================

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

  const cleanFirstName =
    firstName.trim();

  const cleanLastName =
    lastName.trim();

  const cleanEmail =
    email.trim().toLowerCase();

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

  const user =
    userCredential.user;

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

      firstName:
        cleanFirstName,

      // User last name

      lastName:
        cleanLastName,

      // Full display name

      displayName:
        `${cleanFirstName} ${cleanLastName}`,

      // User email

      email:
        cleanEmail,

      // Normal users receive the user role

      role: "user",

      // Email has been verified
      // through the Siya-Fund OTP system

      emailVerified: true,

      // Account creation timestamp

      createdAt:
        serverTimestamp(),

      // Last update timestamp

      updatedAt:
        serverTimestamp(),
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
  // ========================================
  // CLEAN EMAIL ADDRESS
  // ========================================

  const cleanEmail =
    email.trim().toLowerCase();

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

  const user =
    userCredential.user;

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
// RESET USER PASSWORD
// ==========================================

export const resetUserPassword = async (
  email: string,
): Promise<void> => {
  // ========================================
  // CLEAN EMAIL ADDRESS
  // ========================================

  const cleanEmail =
    email.trim().toLowerCase();

  // ========================================
  // VALIDATE EMAIL
  // ========================================

  if (!cleanEmail) {
    throw new Error(
      "Email address is required.",
    );
  }

  // ========================================
  // SEND FIREBASE PASSWORD RESET EMAIL
  // ========================================

  console.log(
    "Sending password reset email to:",
    cleanEmail,
  );

  try {
    await sendPasswordResetEmail(
      auth,
      cleanEmail,
    );

    console.log(
      "Password reset email sent successfully.",
    );
  } catch (error: any) {
    // ========================================
    // LOG TECHNICAL ERROR
    // ========================================

    console.error(
      "Password reset error:",
      error,
    );

    // ========================================
    // FIREBASE ERROR HANDLING
    // ========================================

    if (
      error?.code ===
      "auth/invalid-email"
    ) {
      throw new Error(
        "Please enter a valid email address.",
      );
    }

    if (
      error?.code ===
      "auth/user-not-found"
    ) {
      throw new Error(
        "No account was found with this email address.",
      );
    }

    if (
      error?.code ===
      "auth/too-many-requests"
    ) {
      throw new Error(
        "Too many password reset requests. Please wait a while and try again.",
      );
    }

    if (
      error?.code ===
      "auth/network-request-failed"
    ) {
      throw new Error(
        "Please check your internet connection and try again.",
      );
    }

    // ========================================
    // GENERIC ERROR
    // ========================================

    throw new Error(
      "We could not send the password reset email. Please try again.",
    );
  }
};

// ==========================================
// GET USER ROLE
// ==========================================

export const getUserRole = async () => {
  // ========================================
  // GET CURRENT USER
  // ========================================

  const user =
    auth.currentUser;

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
  // GET FIRESTORE USER DOCUMENT
  // ========================================

  try {
    const userRef =
      doc(db, "users", user.uid);

    const userSnapshot =
      await getDoc(userRef);

    // ======================================
    // CHECK IF DOCUMENT EXISTS
    // ======================================

    if (!userSnapshot.exists()) {
      console.log(
        "No Firestore user document found for:",
        user.uid,
      );

      return "user";
    }

    // ======================================
    // GET USER DATA
    // ======================================

    const userData =
      userSnapshot.data();

    // ======================================
    // GET ROLE
    // ======================================

    const role =
      userData.role;

    // ======================================
    // LOG ROLE
    // ======================================

    console.log(
      "Firestore user role:",
      role,
    );

    // ======================================
    // RETURN ROLE
    // ======================================

    return typeof role === "string"
      ? role
      : "user";

  } catch (error) {
    // ======================================
    // LOG TECHNICAL ERROR
    // ======================================

    console.error(
      "Error retrieving user role:",
      error,
    );

    // ======================================
    // SAFE DEFAULT
    // ======================================

    return "user";
  }
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
