// ==========================================
// FIREBASE AUTHENTICATION FUNCTIONS
// ==========================================

import {
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut,
  getAuth,
  reload,
} from "firebase/auth";

// Firebase application configuration
import app from "./firebase";

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
  // Create the Firebase account
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email.trim(),
    password,
  );

  // Get the newly created Firebase user
  const user = userCredential.user;

  // Save the user's full name
  await updateProfile(user, {
    displayName: `${firstName.trim()} ${lastName.trim()}`,
  });

  // Send the Firebase verification email
  await sendEmailVerification(user);

  // Return the Firebase user
  return user;
};

// ==========================================
// RESEND VERIFICATION EMAIL
// ==========================================

export const resendVerificationEmail = async () => {
  const user = auth.currentUser;

  // Make sure a user is currently logged in
  if (!user) {
    throw new Error("No user is currently signed in.");
  }

  // Send another verification email
  await sendEmailVerification(user);
};

// ==========================================
// CHECK EMAIL VERIFICATION
// ==========================================

export const checkEmailVerification = async () => {
  const user = auth.currentUser;

  // Make sure a user is currently logged in
  if (!user) {
    return false;
  }

  // Refresh the Firebase user's information
  await reload(user);

  // Return the latest verification status
  return user.emailVerified;
};

// ==========================================
// LOGIN USER
// ==========================================

export const loginUser = async (email: string, password: string) => {
  // Sign the user in
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email.trim(),
    password,
  );

  // Return the logged-in Firebase user
  return userCredential.user;
};

// ==========================================
// LOGOUT USER
// ==========================================

export const logoutUser = async () => {
  // Sign the current user out
  await signOut(auth);
};

// ==========================================
// GET CURRENT USER
// ==========================================

export const getCurrentUser = () => {
  // Return the currently signed-in user
  return auth.currentUser;
};
