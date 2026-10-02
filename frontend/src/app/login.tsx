// React is required for useState
import React, { useState } from "react";

// React Native Alert is used to show messages to the user
import { Alert } from "react-native";

// Expo Router is used for navigation
import { router } from "expo-router";

// Import the Login screen UI
import ActualLoginScreen from "../views/screens/ActualLoginScreen";

// Import Firebase Authentication service
import { loginUser } from "../services/AuthService";

// Login route
export default function LoginRoute() {
  // ==========================================
  // LOADING STATE
  // ==========================================

  // Tracks whether Firebase is currently logging in
  const [isLoading, setIsLoading] = useState(false);

  // ==========================================
  // LOGIN
  // ==========================================

  const handleLogin = async (email: string, password: string) => {
    // Remove unnecessary spaces from the email
    const cleanEmail = email.trim();

    // ==========================================
    // BASIC VALIDATION
    // ==========================================

    // Check if email is empty
    if (!cleanEmail) {
      Alert.alert("Email Required", "Please enter your email address.");

      return;
    }

    // Check if password is empty
    if (!password) {
      Alert.alert("Password Required", "Please enter your password.");

      return;
    }

    try {
      // Start loading
      setIsLoading(true);

      // ==========================================
      // FIREBASE LOGIN
      // ==========================================

      // Send the login details to Firebase
      await loginUser(cleanEmail, password);

      // ==========================================
      // LOGIN SUCCESS
      // ==========================================

      Alert.alert("Login Successful", "Welcome back to Siya-Fund!");

      // Navigate to the Dashboard
      router.replace("/dashboard");
    } catch (error: any) {
      // ==========================================
      // DEFAULT ERROR
      // ==========================================

      let message = "Something went wrong. Please try again.";

      // ==========================================
      // INVALID CREDENTIALS
      // ==========================================

      if (
        error?.code === "auth/invalid-credential" ||
        error?.code === "auth/invalid-login-credentials"
      ) {
        message =
          "The email or password is incorrect. Please check your details and try again.";
      }

      // ==========================================
      // USER NOT FOUND
      // ==========================================
      else if (error?.code === "auth/user-not-found") {
        message = "No account was found with this email address.";
      }

      // ==========================================
      // WRONG PASSWORD
      // ==========================================
      else if (error?.code === "auth/wrong-password") {
        message = "The password you entered is incorrect.";
      }

      // ==========================================
      // INVALID EMAIL
      // ==========================================
      else if (error?.code === "auth/invalid-email") {
        message = "Please enter a valid email address.";
      }

      // ==========================================
      // TOO MANY REQUESTS
      // ==========================================
      else if (error?.code === "auth/too-many-requests") {
        message =
          "Too many login attempts. Please wait a moment and try again.";
      }

      // ==========================================
      // NETWORK ERROR
      // ==========================================
      else if (error?.code === "auth/network-request-failed") {
        message = "Please check your internet connection and try again.";
      }

      // ==========================================
      // SHOW ERROR
      // ==========================================

      Alert.alert("Login Failed", message);
    } finally {
      // Stop loading
      setIsLoading(false);
    }
  };

  // ==========================================
  // FORGOT PASSWORD
  // ==========================================

  const handleForgotPassword = () => {
    // Firebase password reset will be connected next
    Alert.alert("Forgot Password", "Password reset will be available soon.");
  };

  // ==========================================
  // DISPLAY LOGIN SCREEN
  // ==========================================

  return (
    <ActualLoginScreen
      onLogin={handleLogin}
      onForgotPassword={handleForgotPassword}
      isLoading={isLoading}
    />
  );
}
