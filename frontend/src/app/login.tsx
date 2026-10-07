

import React, { useState } from "react";

import { Alert } from "react-native";

import { router } from "expo-router";

import ActualLoginScreen from "../views/screens/ActualLoginScreen";

import {
  loginUser,
  logoutUser,
  getUserRole,
} from "../services/AuthService";

import { sendOTP } from "../services/OtpService";

import { setLoginEmail } from "../services/LoginOtpStore";

// ==========================================
// LOGIN ROUTE
// ==========================================

export default function LoginRoute() {
  // ==========================================
  // LOADING STATE
  // ==========================================

  const [isLoading, setIsLoading] = useState(false);

  // ==========================================
  // LOGIN
  // ==========================================

  const handleLogin = async (
    email: string,
    password: string,
  ) => {
    // ========================================
    // CLEAN EMAIL
    // ========================================

    const cleanEmail = email.trim().toLowerCase();

    // ========================================
    // CHECK EMAIL
    // ========================================

    if (!cleanEmail) {
      Alert.alert(
        "Email Required",
        "Please enter your email address.",
      );

      return;
    }

    // ========================================
    // CHECK PASSWORD
    // ========================================

    if (!password) {
      Alert.alert(
        "Password Required",
        "Please enter your password.",
      );

      return;
    }

    try {
      // ========================================
      // START LOADING
      // ========================================

      setIsLoading(true);

      // ========================================
      // STEP 1
      // CHECK EMAIL AND PASSWORD
      // ========================================

      await loginUser(
        cleanEmail,
        password,
      );

      console.log(
        "Login successful for:",
        cleanEmail,
      );

      // ========================================
      // STEP 2
      // CHECK USER ROLE
      // ========================================

      const role = await getUserRole();

      console.log(
        "Logged-in user role:",
        role,
      );

      // ========================================
      // STEP 3
      // SUPER ADMIN LOGIN
      // ========================================
      //
      // Super Admin does NOT require OTP.
      //

      if (role === "super_admin") {
        console.log(
          "Super Admin detected. Skipping OTP.",
        );

        router.replace("/super-admin");

        return;
      }

      // ========================================
      // STEP 4
      // NORMAL USER LOGIN
      // ========================================
      //
      // Normal users still require OTP.
      //

      await sendOTP(cleanEmail);

      console.log(
        "Login OTP sent successfully.",
      );

      // ========================================
      // STEP 5
      // SAVE EMAIL TEMPORARILY
      // ========================================

      setLoginEmail(cleanEmail);

      // ========================================
      // STEP 6
      // GO TO LOGIN OTP SCREEN
      // ========================================

      router.push("/login-otp" as any);

    } catch (error: any) {
      // ========================================
      // IMPORTANT:
      // TECHNICAL ERROR ONLY GOES TO CONSOLE
      // ========================================

      console.error(
        "Login error:",
        error,
      );

      // ========================================
      // DEFAULT USER-FRIENDLY MESSAGE
      // ========================================

      let message =
        "Something went wrong. Please try again.";

      // ========================================
      // INVALID LOGIN DETAILS
      // ========================================

      if (
        error?.code ===
          "auth/invalid-credential" ||
        error?.code ===
          "auth/invalid-login-credentials"
      ) {
        message =
          "The email or password is incorrect. Please check your details and try again.";
      }

      // ========================================
      // USER NOT FOUND
      // ========================================

      else if (
        error?.code ===
        "auth/user-not-found"
      ) {
        message =
          "No account was found with this email address.";
      }

      // ========================================
      // WRONG PASSWORD
      // ========================================

      else if (
        error?.code ===
        "auth/wrong-password"
      ) {
        message =
          "The password you entered is incorrect.";
      }

      // ========================================
      // INVALID EMAIL
      // ========================================

      else if (
        error?.code ===
        "auth/invalid-email"
      ) {
        message =
          "Please enter a valid email address.";
      }

      // ========================================
      // TOO MANY REQUESTS
      // ========================================

      else if (
        error?.code ===
        "auth/too-many-requests"
      ) {
        message =
          "Too many login attempts. Please wait a moment and try again.";
      }

      // ========================================
      // NETWORK ERROR
      // ========================================

      else if (
        error?.code ===
        "auth/network-request-failed"
      ) {
        message =
          "Please check your internet connection and try again.";
      }

      // ========================================
      // OTP FAILED
      // ========================================

      else if (
        error?.message?.includes(
          "Failed to send OTP",
        )
      ) {
        // ======================================
        // FIREBASE LOGIN SUCCEEDED
        // BUT OTP FAILED
        // ======================================

        console.error(
          "Login succeeded, but OTP sending failed.",
          error,
        );

        // ======================================
        // LOG USER OUT
        // ======================================

        try {
          await logoutUser();

          console.log(
            "User logged out after OTP failure.",
          );

        } catch (logoutError) {
          console.error(
            "Logout after OTP failure failed:",
            logoutError,
          );
        }

        message =
          "We could not send your verification code. Please try again.";
      }

      // ========================================
      // UNKNOWN ERROR
      // ========================================

      else {
        console.error(
          "Unhandled login error:",
          error,
        );

        message =
          "We could not complete your login. Please try again.";
      }

      // ========================================
      // SHOW ONLY FRIENDLY MESSAGE
      // ========================================

      Alert.alert(
        "Login Failed",
        message,
      );

    } finally {
      // ========================================
      // STOP LOADING
      // ========================================

      setIsLoading(false);
    }
  };

  // ==========================================
  // FORGOT PASSWORD
  // ==========================================

  const handleForgotPassword = () => {
    router.push("/forgot-password");
  };

  // ==========================================
  // LOGIN SCREEN
  // ==========================================

  return (
    <ActualLoginScreen
      onLogin={handleLogin}
      onForgotPassword={handleForgotPassword}
      isLoading={isLoading}
    />
  );
}
