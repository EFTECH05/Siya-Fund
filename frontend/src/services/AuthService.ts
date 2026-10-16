import { Platform } from "react-native";

import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithCredential,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";

import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";

import { auth, db } from "./firebase";

// ============================================================
// GOOGLE SIGN-IN CONFIGURATION
// ============================================================

// Native Google Sign-In is not used on web.
let GoogleSignin: any = null;

if (Platform.OS !== "web") {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    GoogleSignin =
      require("@react-native-google-signin/google-signin").GoogleSignin;

    GoogleSignin.configure({
      webClientId:
        "636115954194-kinn7fjmes08ka559auuk2l1mkj618mb.apps.googleusercontent.com",
    });
  } catch (error) {
    console.warn(
      "Native Google Sign-In is unavailable. Check your development build.",
      error,
    );
  }
}

// ============================================================
// REGISTER USER
// ============================================================

export const registerUser = async (
  firstName: string,
  lastName: string,
  email: string,
  password: string,
) => {
  const cleanFirstName = firstName.trim();
  const cleanLastName = lastName.trim();
  const cleanEmail = email.trim().toLowerCase();
  const displayName = `${cleanFirstName} ${cleanLastName}`.trim();

  const userCredential = await createUserWithEmailAndPassword(
    auth,
    cleanEmail,
    password,
  );

  const user = userCredential.user;

  await updateProfile(user, {
    displayName,
  });

  await setDoc(doc(db, "users", user.uid), {
    uid: user.uid,
    firstName: cleanFirstName,
    lastName: cleanLastName,
    displayName,
    email: cleanEmail,
    role: "user",
    emailVerified: true,
    provider: "email",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  console.log("Registration completed:", cleanEmail);

  return user;
};

// ============================================================
// EMAIL + PASSWORD LOGIN
// ============================================================

export const loginUser = async (email: string, password: string) => {
  const cleanEmail = email.trim().toLowerCase();

  const userCredential = await signInWithEmailAndPassword(
    auth,
    cleanEmail,
    password,
  );

  const user = userCredential.user;

  console.log("Firebase login successful:", {
    uid: user.uid,
    email: user.email,
    emailVerified: user.emailVerified,
  });

  return user;
};

// ============================================================
// GOOGLE LOGIN — WEB AND ANDROID / IOS
// ============================================================

export const loginWithGoogle = async () => {
  try {
    console.log("Starting Google login on:", Platform.OS);

    let user;

    if (Platform.OS === "web") {
      // Web: Firebase Authentication handles the Google popup.
      const provider = new GoogleAuthProvider();

      provider.setCustomParameters({
        prompt: "select_account",
      });

      const result = await signInWithPopup(auth, provider);
      user = result.user;
    } else {
      // Native Android/iOS: use Google Sign-In.
      if (!GoogleSignin) {
        throw new Error(
          "Native Google Sign-In is unavailable. Check your development build and OAuth configuration.",
        );
      }

      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });

      const response = await GoogleSignin.signIn();

      if (response.type !== "success") {
        throw new Error("Google Sign-In was cancelled.");
      }

      const idToken = response.data?.idToken;

      if (!idToken) {
        throw new Error(
          "Google Sign-In did not return an ID token. Check your OAuth configuration.",
        );
      }

      const googleCredential = GoogleAuthProvider.credential(idToken);

      const result = await signInWithCredential(auth, googleCredential);

      user = result.user;
    }

    console.log("Firebase Google authentication successful:", user.email);

    // --------------------------------------------------------
    // CREATE OR UPDATE FIRESTORE USER
    // --------------------------------------------------------

    const userRef = doc(db, "users", user.uid);
    const userSnapshot = await getDoc(userRef);

    if (!userSnapshot.exists()) {
      const displayName = user.displayName || "";
      const nameParts = displayName.trim().split(/\s+/).filter(Boolean);

      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ");

      await setDoc(userRef, {
        uid: user.uid,
        firstName,
        lastName,
        displayName,
        email: user.email || "",
        role: "user",
        emailVerified: user.emailVerified,
        provider: "google",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      console.log("New Google user created in Firestore:", user.email);
    } else {
      // Do not overwrite existing role or profile information.
      await setDoc(
        userRef,
        {
          updatedAt: serverTimestamp(),
        },
        {
          merge: true,
        },
      );

      console.log("Existing Google user found:", user.email);
    }

    console.log("Google login successful:", user.email);

    return user;
  } catch (error: any) {
    const message = String(error?.message || "");
    const code = String(error?.code || "");

    if (
      code === "SIGN_IN_CANCELLED" ||
      code === "12501" ||
      message.toLowerCase().includes("cancelled") ||
      message.toLowerCase().includes("canceled")
    ) {
      throw new Error("Google Sign-In was cancelled.");
    }

    console.error("Google login error:", error);

    throw error;
  }
};

// ============================================================
// RESET PASSWORD
// ============================================================

export const resetUserPassword = async (email: string) => {
  const cleanEmail = email.trim().toLowerCase();

  await sendPasswordResetEmail(auth, cleanEmail);

  console.log("Password reset email sent:", cleanEmail);
};

// ============================================================
// GET USER ROLE
// ============================================================

export const getUserRole = async () => {
  const currentUser = auth.currentUser;

  if (!currentUser) {
    return "user";
  }

  const userRef = doc(db, "users", currentUser.uid);
  const userSnapshot = await getDoc(userRef);

  if (!userSnapshot.exists()) {
    return "user";
  }

  const data = userSnapshot.data();

  return data.role || "user";
};

// ============================================================
// LOGOUT
// ============================================================

export const logoutUser = async () => {
  try {
    await signOut(auth);

    // Only call native Google sign-out on native platforms.
    if (Platform.OS !== "web" && GoogleSignin) {
      try {
        await GoogleSignin.signOut();
      } catch (googleError) {
        console.log("Google sign-out skipped:", googleError);
      }
    }

    console.log("User logged out successfully.");
  } catch (error) {
    console.error("Logout error:", error);
    throw error;
  }
};

// ============================================================
// GET CURRENT USER
// ============================================================

export const getCurrentUser = () => {
  return auth.currentUser;
};
