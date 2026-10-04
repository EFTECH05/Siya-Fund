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

  // Controls the loading state while
  // checking whether the email is verified
  const [isChecking, setIsChecking] = useState(false);

  // Controls the loading state while
  // sending another verification email
  const [isResending, setIsResending] = useState(false);

  // ==========================================
  // GET CURRENT USER
  // ==========================================

  const currentUser = getCurrentUser();

  // Get the user's email address
  const userEmail =
    currentUser?.email || "your email address";

  // ==========================================
  // SHOW MESSAGE
  // ==========================================

  const showMessage = (
    title: string,
    message: string,
  ) => {

    // Web
    if (Platform.OS === "web") {
      window.alert(
        `${title}\n\n${message}`,
      );

      return;
    }

    // Android / iOS
    Alert.alert(
      title,
      message,
    );
  };

  // ==========================================
  // CHECK EMAIL VERIFICATION
  // ==========================================

  const handleCheckVerification = async () => {

    try {

      // Start loading
      setIsChecking(true);

      console.log(
        "Checking email verification...",
      );

      // Ask Firebase for the latest
      // email verification status
      const isVerified =
        await checkEmailVerification();

      // ========================================
      // EMAIL VERIFIED
      // ========================================

      if (isVerified) {

        console.log(
          "Email has been verified successfully.",
        );

        showMessage(
          "Email Verified!",
          "Your email has been successfully verified. You can now log in to Siya-Fund.",
        );

        // ======================================
        // SIGN USER OUT
        // ======================================

        // The user must log in again after
        // successfully verifying their email.
        await logoutUser();

        // ======================================
        // GO TO LOGIN
        // ======================================

        router.replace("/login");

        return;
      }

      // ========================================
      // EMAIL NOT VERIFIED
      // ========================================

      console.log(
        "Email is not verified yet.",
      );

      showMessage(
        "Email Not Verified",
        "Please open the verification email in your Gmail and click the verification link. Then return here and press this button again.",
      );

    } catch (error: any) {

      // ========================================
      // LOG ERROR
      // ========================================

      console.error(
        "Verification check error:",
        error,
      );

      // ========================================
      // DEFAULT ERROR MESSAGE
      // ========================================

      let message =
        "We could not check your email verification status. Please try again.";

      // ========================================
      // NETWORK ERROR
      // ========================================

      if (
        error?.code ===
        "auth/network-request-failed"
      ) {
        message =
          "Please check your internet connection and try again.";
      }

      // ========================================
      // USER NOT FOUND
      // ========================================

      else if (
        error?.code ===
        "auth/user-not-found"
      ) {
        message =
          "Your account could not be found. Please return to Login and try again.";
      }

      // ========================================
      // SHOW ERROR
      // ========================================

      showMessage(
        "Something Went Wrong",
        message,
      );

    } finally {

      // Stop loading
      setIsChecking(false);
    }
  };

  // ==========================================
  // RESEND VERIFICATION EMAIL
  // ==========================================

  const handleResendEmail = async () => {

    // ========================================
    // PREVENT MULTIPLE REQUESTS
    // ========================================

    if (isResending) {
      return;
    }

    try {

      // Start loading
      setIsResending(true);

      console.log(
        "Requesting another verification email...",
      );

      // Send another Firebase verification email
      await resendVerificationEmail();

      console.log(
        "Verification email sent successfully.",
      );

      // ========================================
      // SUCCESS MESSAGE
      // ========================================

      showMessage(
        "Verification Email Sent",
        `A new verification link has been sent to ${userEmail}.\n\nPlease check your Inbox and Spam/Junk folder.`,
      );

    } catch (error: any) {

      // ========================================
      // LOG ERROR
      // ========================================

      console.error(
        "Resend verification error:",
        error,
      );

      // ========================================
      // DEFAULT ERROR
      // ========================================

      let message =
        "We could not send the verification email. Please try again later.";

      // ========================================
      // RATE LIMIT ERROR
      // ========================================

      if (
        error?.code ===
        "auth/too-many-requests"
      ) {

        message =
          "Too many verification emails have been requested. Please wait before requesting another email.";
      }

      // ========================================
      // USER NOT FOUND
      // ========================================

      else if (
        error?.code ===
        "auth/user-not-found"
      ) {

        message =
          "Your account could not be found. Please return to Login and try again.";
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
      // SHOW ERROR
      // ========================================

      showMessage(
        "Unable to Resend",
        message,
      );

    } finally {

      // Stop loading
      setIsResending(false);
    }
  };

  // ==========================================
  // BACK TO LOGIN
  // ==========================================

  const handleBackToLogin = async () => {

    try {

      // Sign the user out before
      // returning to Login
      await logoutUser();

    } catch (error) {

      console.log(
        "Logout error:",
        error,
      );
    }

    // Go back to Login
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
        ======================================= */}

        <View style={styles.logoContainer}>

          <Image
            source={require("../../../assets/images/siya-logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />

        </View>

        {/* ======================================
            EMAIL ICON
        ======================================= */}

        <View style={styles.emailIconContainer}>

          <Text style={styles.emailIcon}>
            @
          </Text>

        </View>

        {/* ======================================
            TITLE
        ======================================= */}

        <Text style={styles.title}>
          Check Your Email
        </Text>

        {/* ======================================
            DESCRIPTION
        ======================================= */}

        <Text style={styles.description}>
          We've sent a verification link to:
        </Text>

        {/* ======================================
            EMAIL
        ======================================= */}

        <Text
          style={styles.email}
          numberOfLines={1}
          ellipsizeMode="middle"
        >
          {userEmail}
        </Text>

        {/* ======================================
            INSTRUCTIONS
        ======================================= */}

        <Text style={styles.instructions}>

          Please open your email and click the
          verification link to activate your
          Siya-Fund account.

        </Text>

        {/* ======================================
            VERIFICATION INFORMATION
        ======================================= */}

        <Text style={styles.instructions}>

          After clicking the link, return here
          and press "I've Verified My Email".

        </Text>

        {/* ======================================
            CHECK VERIFICATION BUTTON
        ======================================= */}

        <Pressable

          style={({ pressed }) => [
            styles.primaryButton,

            pressed &&
              styles.buttonPressed,

            isChecking &&
              styles.buttonDisabled,
          ]}

          onPress={handleCheckVerification}

          disabled={isChecking}

        >

          {isChecking ? (

            <ActivityIndicator
              size="small"
              color="#FFFFFF"
            />

          ) : (

            <Text style={styles.primaryButtonText}>
              I'VE VERIFIED MY EMAIL
            </Text>

          )}

        </Pressable>

        {/* ======================================
            RESEND EMAIL BUTTON
        ======================================= */}

        <Pressable

          style={({ pressed }) => [
            styles.resendButton,

            pressed &&
              styles.buttonPressed,

            isResending &&
              styles.buttonDisabled,
          ]}

          onPress={handleResendEmail}

          disabled={isResending}

        >

          {isResending ? (

            <ActivityIndicator
              size="small"
              color="#2E8B57"
            />

          ) : (

            <Text style={styles.resendButtonText}>
              RESEND VERIFICATION EMAIL
            </Text>

          )}

        </Pressable>

        {/* ======================================
            BACK TO LOGIN
        ======================================= */}

        <Pressable

          style={({ pressed }) => [
            styles.backButton,

            pressed &&
              styles.buttonPressed,
          ]}

          onPress={handleBackToLogin}

        >

          <Text style={styles.backButtonText}>
            Back to Login
          </Text>

        </Pressable>

        {/* ======================================
            FOOTER
        ======================================= */}

        <Text style={styles.footerText}>
          Save Together • Borrow Smarter • Grow Together
        </Text>

      </View>

    </View>
  );
}