import React, { useState } from "react";
import { Alert } from "react-native";
import { router } from "expo-router";

import ActualLoginScreen from "../views/screens/ActualLoginScreen";

import {
  loginUser,
  logoutUser,
} from "../services/AuthService";

import { sendOTP } from "../services/OtpService";
import { setLoginEmail } from "../services/LoginOtpStore";

export default function LoginRoute() {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (
    email: string,
    password: string,
  ) => {
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      Alert.alert(
        "Email Required",
        "Please enter your email address.",
      );
      return;
    }

    if (!password) {
      Alert.alert(
        "Password Required",
        "Please enter your password.",
      );
      return;
    }

    try {
      setIsLoading(true);

      // Step 1: Check email and password with Firebase
      await loginUser(
        cleanEmail,
        password,
      );

      // Step 2: Send OTP to the user's email
      await sendOTP(cleanEmail);

      // Step 3: Save email temporarily
      setLoginEmail(cleanEmail);

      // Step 4: Go to Login OTP screen
      router.push("/login-otp" as any);

    } catch (error: any) {
      console.error("Login error:", error);

      let message =
        "Something went wrong. Please try again.";

      if (
        error?.code === "auth/invalid-credential" ||
        error?.code === "auth/invalid-login-credentials"
      ) {
        message =
          "The email or password is incorrect. Please check your details and try again.";
      } else if (
        error?.code === "auth/user-not-found"
      ) {
        message =
          "No account was found with this email address.";
      } else if (
        error?.code === "auth/wrong-password"
      ) {
        message =
          "The password you entered is incorrect.";
      } else if (
        error?.code === "auth/invalid-email"
      ) {
        message =
          "Please enter a valid email address.";
      } else if (
        error?.code === "auth/too-many-requests"
      ) {
        message =
          "Too many login attempts. Please wait a moment and try again.";
      } else if (
        error?.code === "auth/network-request-failed"
      ) {
        message =
          "Please check your internet connection and try again.";
      } else if (
        error?.message?.includes("Failed to send OTP")
      ) {
        // Firebase login succeeded, but OTP could not be sent.
        // Sign the user out so they are not left authenticated.
        try {
          await logoutUser();
        } catch (logoutError) {
          console.error(
            "Logout after OTP failure failed:",
            logoutError,
          );
        }

        message =
          "We could not send your verification code. Please try again.";
      }

      Alert.alert(
        "Login Failed",
        message,
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    Alert.alert(
      "Forgot Password",
      "Password reset will be available soon.",
    );
  };

  return (
    <ActualLoginScreen
      onLogin={handleLogin}
      onForgotPassword={handleForgotPassword}
      isLoading={isLoading}
    />
  );
}