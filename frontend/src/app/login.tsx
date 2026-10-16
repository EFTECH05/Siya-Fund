import React, { useState } from "react";

import { Alert } from "react-native";
import { router } from "expo-router";

import ActualLoginScreen from "../views/screens/ActualLoginScreen";

import {
  loginUser,
  getUserRole,
  loginWithGoogle,
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
  // GOOGLE LOGIN
  // ==========================================

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);

      console.log("Starting Google login...");

      // STEP 1: GOOGLE AUTHENTICATION
      const user = await loginWithGoogle();

      console.log("Google login successful:", user.email);

      // STEP 2: CHECK USER ROLE
      const role = await getUserRole();

      console.log("Google user role:", role);

      // STEP 3: SUPER ADMIN
      if (role === "super_admin") {
        console.log("Google Super Admin detected.");

        router.replace("/super-admin");
        return;
      }

      // STEP 4: NORMAL GOOGLE USER
      // Google has already authenticated the user.
      // Keep the existing behaviour of going to the dashboard.

      console.log("Google normal user detected.");

      router.replace("/dashboard");
    } catch (error: any) {
      console.error("Google login error:", error);

      // GOOGLE LOGIN CANCELLED
      if (error?.message?.toLowerCase().includes("cancelled")) {
        console.log("Google login was cancelled.");
        return;
      }

      let message = "We could not complete Google login. Please try again.";

      // NETWORK ERROR
      if (error?.code === "auth/network-request-failed") {
        message = "Please check your internet connection and try again.";
      }

      // ACCOUNT EXISTS WITH ANOTHER LOGIN METHOD
      else if (
        error?.code === "auth/account-exists-with-different-credential"
      ) {
        message =
          "An account already exists with this email using another login method.";
      }

      Alert.alert("Google Login Failed", message);
    } finally {
      setIsLoading(false);
    }
  };

  // ==========================================
  // NORMAL EMAIL AND PASSWORD LOGIN
  // ==========================================

  const handleLogin = async (email: string, password: string) => {
    // CLEAN EMAIL
    const cleanEmail = email.trim().toLowerCase();

    // CHECK EMAIL
    if (!cleanEmail) {
      Alert.alert("Email Required", "Please enter your email address.");
      return;
    }

    // CHECK PASSWORD
    if (!password) {
      Alert.alert("Password Required", "Please enter your password.");
      return;
    }

    try {
      setIsLoading(true);

      // STEP 1: CHECK EMAIL AND PASSWORD
      await loginUser(cleanEmail, password);

      console.log("Login successful for:", cleanEmail);

      // STEP 2: CHECK USER ROLE
      const role = await getUserRole();

      console.log("Logged-in user role:", role);

      // STEP 3: SUPER ADMIN DOES NOT REQUIRE OTP
      if (role === "super_admin") {
        console.log("Super Admin detected. Skipping OTP.");

        router.replace("/super-admin");
        return;
      }

      // STEP 4: SAVE EMAIL FOR OTP VERIFICATION
      console.log("Preparing login OTP for:", cleanEmail);

      setLoginEmail(cleanEmail);

      // STEP 5: SEND OTP THROUGH THE BACKEND
      await sendOTP(cleanEmail);

      console.log("Login OTP sent successfully.");

      // STEP 6: NAVIGATE TO OTP VERIFICATION
      router.push("/login-otp" as any);
    } catch (error: any) {
      console.error("Login error:", error);

      let message = "We could not complete your login. Please try again.";

      // INVALID LOGIN DETAILS
      if (
        error?.code === "auth/invalid-credential" ||
        error?.code === "auth/invalid-login-credentials"
      ) {
        message =
          "The email or password is incorrect. Please check your details and try again.";
      }

      // USER NOT FOUND
      else if (error?.code === "auth/user-not-found") {
        message = "No account was found with this email address.";
      }

      // WRONG PASSWORD
      else if (error?.code === "auth/wrong-password") {
        message = "The password you entered is incorrect.";
      }

      // INVALID EMAIL
      else if (error?.code === "auth/invalid-email") {
        message = "Please enter a valid email address.";
      }

      // TOO MANY REQUESTS
      else if (error?.code === "auth/too-many-requests") {
        message =
          "Too many login attempts. Please wait a moment and try again.";
      }

      // NETWORK ERROR
      else if (error?.code === "auth/network-request-failed") {
        message = "Please check your internet connection and try again.";
      }

      // OTP / BACKEND ERROR
      else if (
        error?.code === "OTP_EMAIL_NOT_CONFIGURED" ||
        error?.code === "EAUTH" ||
        error?.message?.toLowerCase().includes("otp") ||
        error?.message?.toLowerCase().includes("email verification") ||
        error?.message?.toLowerCase().includes("network")
      ) {
        message =
          "We could not send your verification code. Please try again shortly.";
      }

      Alert.alert("Login Failed", message);
    } finally {
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
      onGoogleLogin={handleGoogleLogin}
      onForgotPassword={handleForgotPassword}
      isLoading={isLoading}
    />
  );
}
