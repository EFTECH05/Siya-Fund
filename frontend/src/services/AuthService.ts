import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithCredential,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";

import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";

import {
  GoogleSignin,
} from "@react-native-google-signin/google-signin";

import {
  auth,
  db,
} from "./firebase";

GoogleSignin.configure({
  webClientId:
    "636115954194-kinn7fjmes08ka559auuk2l1mkj618mb.apps.googleusercontent.com",
});


// ============================================================
// REGISTER USER
// ============================================================

export const registerUser = async (
  firstName: string,
  lastName: string,
  email: string,
  password: string,
) => {
  const cleanFirstName =
    firstName.trim();

  const cleanLastName =
    lastName.trim();

  const cleanEmail =
    email.trim().toLowerCase();

  const userCredential =
    await createUserWithEmailAndPassword(
      auth,
      cleanEmail,
      password,
    );

  const user =
    userCredential.user;

  await updateProfile(user, {
    displayName:
      `${cleanFirstName} ${cleanLastName}`,
  });

  await setDoc(
    doc(db, "users", user.uid),
    {
      uid: user.uid,
      firstName:
        cleanFirstName,
      lastName:
        cleanLastName,
      displayName:
        `${cleanFirstName} ${cleanLastName}`,
      email:
        cleanEmail,
      role:
        "user",
      emailVerified:
        true,
      provider:
        "email",
      createdAt:
        serverTimestamp(),
      updatedAt:
        serverTimestamp(),
    },
  );

  console.log(
    "Registration completed:",
    cleanEmail,
  );

  return user;
};


// ============================================================
// EMAIL + PASSWORD LOGIN
// ============================================================

export const loginUser = async (
  email: string,
  password: string,
) => {
  const cleanEmail =
    email.trim().toLowerCase();

  const userCredential =
    await signInWithEmailAndPassword(
      auth,
      cleanEmail,
      password,
    );

  const user =
    userCredential.user;

  console.log(
    "Firebase login successful:",
    {
      uid:
        user.uid,

      email:
        user.email,

      emailVerified:
        user.emailVerified,
    },
  );

  return user;
};


// ============================================================
// GOOGLE LOGIN
// ============================================================

export const loginWithGoogle =
  async () => {
    try {
      console.log(
        "Starting Google login...",
      );

      await GoogleSignin.hasPlayServices();

      const response =
        await GoogleSignin.signIn();

      if (
        response.type !==
        "success"
      ) {
        throw new Error(
          "Google Sign-In was cancelled.",
        );
      }

      const idToken =
        response.data?.idToken;

      if (!idToken) {
        throw new Error(
          "Google Sign-In failed: No ID token received.",
        );
      }

      const googleCredential =
        GoogleAuthProvider.credential(
          idToken,
        );

      const userCredential =
        await signInWithCredential(
          auth,
          googleCredential,
        );

      const user =
        userCredential.user;

      console.log(
        "Firebase Google authentication successful:",
        user.email,
      );

      const userRef =
        doc(
          db,
          "users",
          user.uid,
        );

      const userSnapshot =
        await getDoc(userRef);


      // --------------------------------------------------------
      // NEW GOOGLE USER
      // --------------------------------------------------------

      if (
        !userSnapshot.exists()
      ) {
        const displayName =
          user.displayName ||
          "";

        const nameParts =
          displayName
            .trim()
            .split(/\s+/);

        const firstName =
          nameParts[0] ||
          "";

        const lastName =
          nameParts
            .slice(1)
            .join(" ");

        await setDoc(
          userRef,
          {
            uid:
              user.uid,

            firstName:
              firstName,

            lastName:
              lastName,

            displayName:
              user.displayName ||
              "",

            email:
              user.email ||
              "",

            role:
              "user",

            emailVerified:
              true,

            provider:
              "google",

            createdAt:
              serverTimestamp(),

            updatedAt:
              serverTimestamp(),
          },
        );

        console.log(
          "New Google user created in Firestore:",
          user.email,
        );
      }


      // --------------------------------------------------------
      // EXISTING GOOGLE USER
      // --------------------------------------------------------

      else {
        await setDoc(
          userRef,
          {
            updatedAt:
              serverTimestamp(),
          },
          {
            merge:
              true,
          },
        );

        console.log(
          "Existing Google user found:",
          user.email,
        );
      }

      console.log(
        "Google login successful:",
        user.email,
      );

      return user;

    } catch (error: any) {

      console.error(
        "Google login error:",
        error,
      );

      throw error;
    }
  };


// ============================================================
// RESET PASSWORD
// ============================================================

export const resetUserPassword =
  async (
    email: string,
  ) => {
    const cleanEmail =
      email.trim().toLowerCase();

    await sendPasswordResetEmail(
      auth,
      cleanEmail,
    );

    console.log(
      "Password reset email sent:",
      cleanEmail,
    );
  };


// ============================================================
// GET USER ROLE
// ============================================================

export const getUserRole =
  async () => {
    const currentUser =
      auth.currentUser;

    if (!currentUser) {
      return "user";
    }

    const userRef =
      doc(
        db,
        "users",
        currentUser.uid,
      );

    const userSnapshot =
      await getDoc(userRef);

    if (
      !userSnapshot.exists()
    ) {
      return "user";
    }

    const data =
      userSnapshot.data();

    return data.role ||
      "user";
  };


// ============================================================
// LOGOUT
// ============================================================

export const logoutUser =
  async () => {
    try {

      await signOut(auth);

      try {

        await GoogleSignin.signOut();

      } catch (googleError) {

        console.log(
          "Google sign out skipped:",
          googleError,
        );
      }

      console.log(
        "User logged out successfully.",
      );

    } catch (error) {

      console.error(
        "Logout error:",
        error,
      );

      throw error;
    }
  };


// ============================================================
// GET CURRENT USER
// ============================================================

export const getCurrentUser =
  () => {
    return auth.currentUser;
  };