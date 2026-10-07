
import React, { useState } from "react";

import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { router } from "expo-router";

import { resetUserPassword } from "../services/AuthService";

// ==========================================
// FORGOT PASSWORD SCREEN
// ==========================================

export default function ForgotPasswordScreen() {
  // ==========================================
  // FORM STATE
  // ==========================================

  const [email, setEmail] = useState("");

  // ==========================================
  // LOADING STATE
  // ==========================================

  const [isLoading, setIsLoading] = useState(false);

  // ==========================================
  // SUCCESS STATE
  // ==========================================

  const [emailSent, setEmailSent] = useState(false);

  // ==========================================
  // ERROR STATE
  // ==========================================

  const [errorMessage, setErrorMessage] = useState("");

  // ==========================================
  // SEND PASSWORD RESET EMAIL
  // ==========================================

  const handleSendResetLink = async () => {
    // ========================================
    // CLEAN EMAIL
    // ========================================

    const cleanEmail = email
      .trim()
      .toLowerCase();

    // ========================================
    // CLEAR PREVIOUS ERROR
    // ========================================

    setErrorMessage("");

    // ========================================
    // CHECK EMAIL
    // ========================================

    if (!cleanEmail) {
      setErrorMessage(
        "Please enter your email address.",
      );

      return;
    }

    // ========================================
    // EMAIL VALIDATION
    // ========================================

    if (
      !cleanEmail.includes("@") ||
      !cleanEmail.includes(".")
    ) {
      setErrorMessage(
        "Please enter a valid email address.",
      );

      return;
    }

    // ========================================
    // PREVENT DOUBLE REQUEST
    // ========================================

    if (isLoading) {
      return;
    }

    try {
      // ========================================
      // START LOADING
      // ========================================

      setIsLoading(true);

      console.log(
        "Sending password reset request for:",
        cleanEmail,
      );

      // ========================================
      // SEND RESET EMAIL
      // ========================================

      await resetUserPassword(cleanEmail);

      // ========================================
      // SUCCESS
      // ========================================

      console.log(
        "Password reset email request completed successfully.",
      );

      setEmail(cleanEmail);

      setEmailSent(true);

    } catch (error: any) {
      // ========================================
      // IMPORTANT:
      // TECHNICAL ERROR ONLY GOES TO CONSOLE
      // ========================================

      console.error(
        "Password reset error:",
        error,
      );

      // ========================================
      // DEFAULT FRIENDLY MESSAGE
      // ========================================

      let message =
        "We could not send the password reset email. Please try again.";

      // ========================================
      // INVALID EMAIL
      // ========================================

      if (
        error?.code ===
        "auth/invalid-email"
      ) {
        message =
          "Please enter a valid email address.";
      }

      // ========================================
      // USER NOT FOUND
      // ========================================

      else if (
        error?.code ===
        "auth/user-not-found"
      ) {
        message =
          "We couldn't find an account with that email address.";
      }

      // ========================================
      // TOO MANY REQUESTS
      // ========================================

      else if (
        error?.code ===
        "auth/too-many-requests"
      ) {
        message =
          "Too many reset requests. Please wait a few minutes and try again.";
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
      // OPERATION NOT ALLOWED
      // ========================================

      else if (
        error?.code ===
        "auth/operation-not-allowed"
      ) {
        message =
          "Password recovery is currently unavailable. Please try again later.";
      }

      // ========================================
      // UNKNOWN ERROR
      // ========================================

      else {
        console.error(
          "Unhandled password reset error:",
          error,
        );

        message =
          "We could not send the password reset email. Please try again.";
      }

      // ========================================
      // SHOW ONLY FRIENDLY MESSAGE
      // ========================================

      setErrorMessage(message);

    } finally {
      // ========================================
      // STOP LOADING
      // ========================================

      setIsLoading(false);
    }
  };

  // ==========================================
  // BACK TO LOGIN
  // ==========================================

  const handleBackToLogin = () => {
    router.replace("/login");
  };

  // ==========================================
  // USE DIFFERENT EMAIL
  // ==========================================

  const handleUseDifferentEmail = () => {
    setEmail("");

    setErrorMessage("");

    setEmailSent(false);
  };

  // ==========================================
  // SUCCESS SCREEN
  // ==========================================

  if (emailSent) {
    return (
      <View style={styles.container}>

        <View style={styles.backgroundGlowTop} />

        <View style={styles.backgroundGlowBottom} />

        <ScrollView
          contentContainerStyle={
            styles.scrollContent
          }
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>

            {/* ======================================
                LOGO
            ======================================= */}

            <View style={styles.logoContainer}>
              <Image
                source={require("../../assets/images/siya-logo.png")}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>

            {/* ======================================
                SUCCESS ICON
            ======================================= */}

            <View style={styles.successIcon}>
              <Text
                style={styles.successIconText}
              >
                ✓
              </Text>
            </View>

            {/* ======================================
                SUCCESS TITLE
            ======================================= */}

            <Text style={styles.title}>
              Check Your Email
            </Text>

            <Text style={styles.subtitle}>
              We've sent a password reset link to:
            </Text>

            {/* ======================================
                EMAIL DISPLAY
            ======================================= */}

            <View style={styles.emailDisplay}>
              <Text
                style={styles.emailDisplayText}
                numberOfLines={1}
              >
                {email}
              </Text>
            </View>

            <Text style={styles.description}>
              Open the email and follow the
              instructions to create a new
              password for your Siya-Fund account.
            </Text>

            {/* ======================================
                SECURITY NOTICE
            ======================================= */}

            <View style={styles.securityCard}>

              <View style={styles.securityIcon}>
                <Text
                  style={styles.securityIconText}
                >
                  🔒
                </Text>
              </View>

              <View
                style={styles.securityTextContainer}
              >
                <Text style={styles.securityTitle}>
                  Check your spam folder
                </Text>

                <Text
                  style={
                    styles.securityDescription
                  }
                >
                  If you don't see the email within
                  a few minutes, check your spam or
                  junk folder.
                </Text>
              </View>

            </View>

            {/* ======================================
                BACK TO LOGIN
            ======================================= */}

            <Pressable
              style={({ pressed }) => [
                styles.primaryButton,
                pressed &&
                  styles.primaryButtonPressed,
              ]}
              onPress={handleBackToLogin}
            >
              <Text
                style={styles.primaryButtonText}
              >
                BACK TO LOGIN
              </Text>
            </Pressable>

            {/* ======================================
                DIFFERENT EMAIL
            ======================================= */}

            <Pressable
              style={({ pressed }) => [
                styles.secondaryButton,
                pressed &&
                  styles.secondaryButtonPressed,
              ]}
              onPress={handleUseDifferentEmail}
            >
              <Text
                style={styles.secondaryButtonText}
              >
                USE A DIFFERENT EMAIL
              </Text>
            </Pressable>

            {/* ======================================
                FOOTER
            ======================================= */}

            <View style={styles.footer}>
              <Text style={styles.footerText}>
                Siya-Fund
              </Text>

              <Text style={styles.footerTagline}>
                Save • Borrow • Grow
              </Text>
            </View>

          </View>
        </ScrollView>

      </View>
    );
  }

  // ==========================================
  // FORGOT PASSWORD SCREEN
  // ==========================================

  return (
    <View style={styles.container}>

      <View style={styles.backgroundGlowTop} />

      <View style={styles.backgroundGlowBottom} />

      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={
          Platform.OS === "ios"
            ? "padding"
            : undefined
        }
      >

        <ScrollView
          contentContainerStyle={
            styles.scrollContent
          }
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >

          <View style={styles.content}>

            {/* ======================================
                LOGO
            ======================================= */}

            <View style={styles.logoContainer}>
              <Image
                source={require("../../assets/images/siya-logo.png")}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>

            {/* ======================================
                SECURITY BADGE
            ======================================= */}

            <View style={styles.badge}>

              <Text style={styles.badgeIcon}>
                🔐
              </Text>

              <Text style={styles.badgeText}>
                SECURE PASSWORD RECOVERY
              </Text>

            </View>

            {/* ======================================
                TITLE
            ======================================= */}

            <Text style={styles.title}>
              Forgot Your Password?
            </Text>

            <Text style={styles.subtitle}>
              No worries. Enter the email address
              associated with your Siya-Fund account
              and we'll send you a secure reset link.
            </Text>

            {/* ======================================
                FORM CARD
            ======================================= */}

            <View style={styles.formCard}>

              {/* EMAIL LABEL */}

              <Text style={styles.inputLabel}>
                Email Address
              </Text>

              {/* EMAIL INPUT */}

              <View
                style={[
                  styles.inputContainer,
                  errorMessage &&
                    styles.inputContainerError,
                ]}
              >

                <Text style={styles.inputIcon}>
                  ✉
                </Text>

                <TextInput
                  style={styles.input}
                  placeholder="Enter your email"
                  placeholderTextColor="#8A8A8A"
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    setErrorMessage("");
                  }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="email"
                  textContentType="emailAddress"
                  editable={!isLoading}
                  returnKeyType="done"
                  onSubmitEditing={
                    handleSendResetLink
                  }
                />

              </View>

              {/* ERROR */}

              {errorMessage ? (
                <View style={styles.errorContainer}>

                  <Text style={styles.errorIcon}>
                    !
                  </Text>

                  <Text style={styles.errorText}>
                    {errorMessage}
                  </Text>

                </View>
              ) : null}

              {/* ======================================
                  SEND BUTTON
              ======================================= */}

              <Pressable
                style={({ pressed }) => [
                  styles.primaryButton,
                  pressed &&
                    styles.primaryButtonPressed,
                  isLoading &&
                    styles.primaryButtonDisabled,
                ]}
                onPress={handleSendResetLink}
                disabled={isLoading}
              >

                {isLoading ? (
                  <View
                    style={
                      styles.loadingContainer
                    }
                  >

                    <ActivityIndicator
                      size="small"
                      color="#FFFFFF"
                    />

                    <Text
                      style={
                        styles.loadingText
                      }
                    >
                      SENDING...
                    </Text>

                  </View>
                ) : (
                  <Text
                    style={
                      styles.primaryButtonText
                    }
                  >
                    SEND RESET LINK
                  </Text>
                )}

              </Pressable>

            </View>

            {/* ======================================
                SECURITY MESSAGE
            ======================================= */}

            <View style={styles.securityCard}>

              <View style={styles.securityIcon}>
                <Text
                  style={styles.securityIconText}
                >
                  🔒
                </Text>
              </View>

              <View
                style={styles.securityTextContainer}
              >

                <Text style={styles.securityTitle}>
                  Your security matters
                </Text>

                <Text
                  style={styles.securityDescription}
                >
                  We'll never ask you for your
                  password through email or
                  messages. Your reset link is
                  private and secure.
                </Text>

              </View>

            </View>

            {/* ======================================
                BACK TO LOGIN
            ======================================= */}

            <Pressable
              style={({ pressed }) => [
                styles.backButton,
                pressed &&
                  styles.backButtonPressed,
              ]}
              onPress={handleBackToLogin}
              disabled={isLoading}
            >

              <Text style={styles.backArrow}>
                ←
              </Text>

              <Text style={styles.backButtonText}>
                Back to Login
              </Text>

            </Pressable>

            {/* ======================================
                FOOTER
            ======================================= */}

            <View style={styles.footer}>

              <Text style={styles.footerText}>
                Siya-Fund
              </Text>

              <Text style={styles.footerTagline}>
                Save • Borrow • Grow
              </Text>

            </View>

          </View>

        </ScrollView>

      </KeyboardAvoidingView>

    </View>
  );
}

// ==========================================
// STYLES
// ==========================================

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#F7FAF8",
  },

  keyboardContainer: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingVertical: 40,
    paddingHorizontal: 20,
  },

  content: {
    width: "100%",
    maxWidth: 520,
    alignSelf: "center",
    alignItems: "center",
  },

  // ==========================================
  // BACKGROUND
  // ==========================================

  backgroundGlowTop: {
    position: "absolute",
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: "#DDF3E5",
    opacity: 0.55,
    top: -120,
    right: -100,
  },

  backgroundGlowBottom: {
    position: "absolute",
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: "#E8F6ED",
    opacity: 0.65,
    bottom: -100,
    left: -100,
  },

  // ==========================================
  // LOGO
  // ==========================================

  logoContainer: {
    width: 120,
    height: 70,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },

  logo: {
    width: 115,
    height: 65,
  },

  // ==========================================
  // BADGE
  // ==========================================

  badge: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E5F5EA",
    borderRadius: 30,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "#CDEAD6",
  },

  badgeIcon: {
    fontSize: 13,
    marginRight: 6,
  },

  badgeText: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.7,
    color: "#138A45",
  },

  // ==========================================
  // TITLE
  // ==========================================

  title: {
    fontSize: 30,
    fontWeight: "800",
    color: "#111111",
    textAlign: "center",
    marginBottom: 12,
    letterSpacing: -0.5,
  },

  subtitle: {
    fontSize: 15,
    lineHeight: 23,
    color: "#626862",
    textAlign: "center",
    maxWidth: 450,
    marginBottom: 28,
  },

  description: {
    fontSize: 14,
    lineHeight: 21,
    color: "#666C67",
    textAlign: "center",
    maxWidth: 420,
    marginBottom: 22,
  },

  // ==========================================
  // FORM CARD
  // ==========================================

  formCard: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 22,
    borderWidth: 1,
    borderColor: "#E7ECE9",
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.07,
    shadowRadius: 20,
    elevation: 4,
  },

  inputLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#252A27",
    marginBottom: 9,
  },

  inputContainer: {
    height: 56,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F7F9F8",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#DDE5E0",
    paddingHorizontal: 15,
  },

  inputContainerError: {
    borderColor: "#D94A4A",
    backgroundColor: "#FFF8F8",
  },

  inputIcon: {
    fontSize: 18,
    color: "#159447",
    marginRight: 11,
  },

  input: {
    flex: 1,
    height: "100%",
    fontSize: 15,
    color: "#151815",
    paddingVertical: 0,
  },

  // ==========================================
  // ERROR
  // ==========================================

  errorContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 10,
    paddingHorizontal: 3,
  },

  errorIcon: {
    width: 17,
    height: 17,
    borderRadius: 9,
    backgroundColor: "#D94A4A",
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "800",
    textAlign: "center",
    lineHeight: 17,
    marginRight: 7,
  },

  errorText: {
    flex: 1,
    color: "#C63D3D",
    fontSize: 12,
    lineHeight: 18,
  },

  // ==========================================
  // PRIMARY BUTTON
  // ==========================================

  primaryButton: {
    width: "100%",
    minHeight: 56,
    borderRadius: 15,
    backgroundColor: "#159447",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    shadowColor: "#159447",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.2,
    shadowRadius: 9,
    elevation: 3,
  },

  primaryButtonPressed: {
    opacity: 0.82,
    transform: [
      {
        scale: 0.985,
      },
    ],
  },

  primaryButtonDisabled: {
    opacity: 0.7,
  },

  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 0.8,
  },

  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  loadingText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 0.8,
    marginLeft: 9,
  },

  // ==========================================
  // SECURITY CARD
  // ==========================================

  securityCard: {
    width: "100%",
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#F0F8F3",
    borderRadius: 17,
    borderWidth: 1,
    borderColor: "#D8EEDF",
    padding: 15,
    marginTop: 18,
  },

  securityIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#DDF2E4",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  securityIconText: {
    fontSize: 16,
  },

  securityTextContainer: {
    flex: 1,
  },

  securityTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: "#1B3A27",
    marginBottom: 4,
  },

  securityDescription: {
    fontSize: 12,
    lineHeight: 18,
    color: "#5E6962",
  },

  // ==========================================
  // BACK BUTTON
  // ==========================================

  backButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 23,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },

  backButtonPressed: {
    opacity: 0.6,
  },

  backArrow: {
    fontSize: 20,
    color: "#159447",
    marginRight: 7,
    marginTop: -1,
  },

  backButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#159447",
  },

  // ==========================================
  // SECONDARY BUTTON
  // ==========================================

  secondaryButton: {
    width: "100%",
    minHeight: 52,
    borderRadius: 15,
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: "#159447",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
  },

  secondaryButtonPressed: {
    backgroundColor: "#F0F8F3",
  },

  secondaryButtonText: {
    color: "#159447",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0.7,
  },

  // ==========================================
  // SUCCESS
  // ==========================================

  successIcon: {
    width: 74,
    height: 74,
    borderRadius: 37,
    backgroundColor: "#159447",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    shadowColor: "#159447",
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 5,
  },

  successIconText: {
    color: "#FFFFFF",
    fontSize: 38,
    fontWeight: "700",
    marginTop: -3,
  },

  emailDisplay: {
    width: "100%",
    backgroundColor: "#F0F8F3",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#D8EEDF",
    paddingHorizontal: 16,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 17,
  },

  emailDisplayText: {
    color: "#138A45",
    fontSize: 14,
    fontWeight: "700",
  },

  // ==========================================
  // FOOTER
  // ==========================================

  footer: {
    alignItems: "center",
    marginTop: 35,
    paddingBottom: 10,
  },

  footerText: {
    color: "#159447",
    fontSize: 15,
    fontWeight: "800",
    marginBottom: 3,
  },

  footerTagline: {
    color: "#858B87",
    fontSize: 11,
    letterSpacing: 0.5,
  },

});

