// ==========================================
// IMPORTS
// ==========================================

import React, { useState } from "react";

import {
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  Pressable,
  Text,
  View,
} from "react-native";

import { router } from "expo-router";

import {
  checkEmailVerification,
  getCurrentUser,
  logoutUser,
  resendVerificationEmail,
} from "../../services/AuthService";

import { styles } from "./CheckEmailScreen.styles";

// ==========================================
// CHECK EMAIL SCREEN
// ==========================================

export default function CheckEmailScreen() {
  // ==========================================
  // STATE
  // ==========================================

  const [isChecking, setIsChecking] = useState(false);

  const [isResending, setIsResending] = useState(false);

  // ==========================================
  // GET CURRENT USER
  // ==========================================

  const currentUser = getCurrentUser();

  const userEmail = currentUser?.email || "your email address";

  // ==========================================
  // CHECK EMAIL VERIFICATION
  // ==========================================

  const handleCheckVerification = async () => {
    try {
      setIsChecking(true);

      const isVerified = await checkEmailVerification();

      // ==========================================
      // EMAIL VERIFIED
      // ==========================================

      if (isVerified) {
        if (Platform.OS === "web") {
          window.alert(
            "Email Verified!\n\nYour email has been successfully verified. You can now log in to Siya-Fund.",
          );
        } else {
          Alert.alert(
            "Email Verified!",
            "Your email has been successfully verified. You can now log in to Siya-Fund.",
          );
        }

        // Sign the user out after verification.
        // They will log in normally from the Login screen.
        await logoutUser();

        router.replace("/login");
      }

      // ==========================================
      // EMAIL NOT VERIFIED
      // ==========================================
      else {
        if (Platform.OS === "web") {
          window.alert(
            "Email Not Verified\n\nPlease open the verification email in your Gmail and click the verification link.",
          );
        } else {
          Alert.alert(
            "Email Not Verified",
            "Please open the verification email in your Gmail and click the verification link.",
          );
        }
      }
    } catch (error) {
      console.error("Verification check error:", error);

      if (Platform.OS === "web") {
        window.alert(
          "Something went wrong while checking your email. Please try again.",
        );
      } else {
        Alert.alert(
          "Something Went Wrong",
          "We could not check your email verification status. Please try again.",
        );
      }
    } finally {
      setIsChecking(false);
    }
  };

  // ==========================================
  // RESEND VERIFICATION EMAIL
  // ==========================================

  const handleResendEmail = async () => {
    try {
      setIsResending(true);

      await resendVerificationEmail();

      if (Platform.OS === "web") {
        window.alert(
          "Verification Email Sent\n\nA new verification email has been sent to your email address.",
        );
      } else {
        Alert.alert(
          "Verification Email Sent",
          "A new verification email has been sent to your email address.",
        );
      }
    } catch (error: any) {
      console.error("Resend verification error:", error);

      let message =
        "We could not send the verification email. Please try again.";

      // Firebase rate-limit error
      if (error?.code === "auth/too-many-requests") {
        message =
          "Too many verification emails have been requested. Please wait a little while before trying again.";
      }

      if (Platform.OS === "web") {
        window.alert(`Unable to Resend\n\n${message}`);
      } else {
        Alert.alert("Unable to Resend", message);
      }
    } finally {
      setIsResending(false);
    }
  };

  // ==========================================
  // BACK TO LOGIN
  // ==========================================

  const handleBackToLogin = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.log("Logout error:", error);
    }

    router.replace("/login");
  };

  // ==========================================
  // SCREEN
  // ==========================================

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {/* ======================================
            LOGO
        ====================================== */}

        <View style={styles.logoContainer}>
          <Image
            source={require("../../../assets/images/siya-logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        {/* ======================================
            EMAIL ICON
        ====================================== */}

        <View style={styles.emailIconContainer}>
          <Text style={styles.emailIcon}>@</Text>
        </View>

        {/* ======================================
            TITLE
        ====================================== */}

        <Text style={styles.title}>Check Your Email</Text>

        {/* ======================================
            DESCRIPTION
        ====================================== */}

        <Text style={styles.description}>
          We've sent a verification link to:
        </Text>

        {/* ======================================
            EMAIL
        ====================================== */}

        <Text style={styles.email} numberOfLines={1} ellipsizeMode="middle">
          {userEmail}
        </Text>

        {/* ======================================
            INSTRUCTIONS
        ====================================== */}

        <Text style={styles.instructions}>
          Please open your email and click the verification link to activate
          your Siya-Fund account.
        </Text>

        {/* ======================================
            CHECK VERIFICATION BUTTON
        ====================================== */}

        <Pressable
          style={({ pressed }) => [
            styles.primaryButton,
            pressed && styles.buttonPressed,
            isChecking && styles.buttonDisabled,
          ]}
          onPress={handleCheckVerification}
          disabled={isChecking}
        >
          {isChecking ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.primaryButtonText}>I'VE VERIFIED MY EMAIL</Text>
          )}
        </Pressable>

        {/* ======================================
            RESEND EMAIL BUTTON
        ====================================== */}

        <Pressable
          style={({ pressed }) => [
            styles.resendButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={handleResendEmail}
          disabled={isResending}
        >
          {isResending ? (
            <ActivityIndicator size="small" color="#2E8B57" />
          ) : (
            <Text style={styles.resendButtonText}>
              RESEND VERIFICATION EMAIL
            </Text>
          )}
        </Pressable>

        {/* ======================================
            BACK TO LOGIN
        ====================================== */}

        <Pressable
          style={({ pressed }) => [
            styles.backButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={handleBackToLogin}
        >
          <Text style={styles.backButtonText}>Back to Login</Text>
        </Pressable>

        {/* ======================================
            FOOTER
        ====================================== */}

        <Text style={styles.footerText}>
          Save Together • Borrow Smarter • Grow Together
        </Text>
      </View>
    </View>
  );
}
