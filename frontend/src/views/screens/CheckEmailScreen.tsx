
// ==========================================
// IMPORTS
// ==========================================

import React, { useEffect, useState } from "react";

import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

import { router } from "expo-router";

import { registerUser } from "../../services/AuthService";
import {
  sendOTP,
  verifyOTP,
} from "../../services/OtpService";

import {
  clearRegistrationData,
  getRegistrationData,
} from "../../services/RegistrationStore";

import { styles } from "./CheckEmailScreen.styles";

// ==========================================
// CHECK EMAIL / OTP SCREEN
// ==========================================

export default function CheckEmailScreen() {
  // ==========================================
  // OTP STATE
  // ==========================================

  const [otp, setOtp] = useState("");

  // ==========================================
  // EMAIL STATE
  // ==========================================

  const [email, setEmail] = useState("");

  // ==========================================
  // LOADING STATE
  // ==========================================

  const [isLoading, setIsLoading] = useState(false);

  // ==========================================
  // RESEND LOADING STATE
  // ==========================================

  const [isResending, setIsResending] = useState(false);

  // ==========================================
  // ERROR STATE
  // ==========================================

  const [errorMessage, setErrorMessage] = useState("");

  // ==========================================
  // SUCCESS MESSAGE
  // ==========================================

  const [successMessage, setSuccessMessage] = useState("");

  // ==========================================
  // LOAD REGISTRATION DATA
  // ==========================================

  useEffect(() => {
    const registrationData =
      getRegistrationData();

    if (!registrationData) {
      console.log(
        "No registration data found.",
      );

      router.replace("/register");

      return;
    }

    console.log(
      "Registration data loaded for:",
      registrationData.email,
    );

    setEmail(registrationData.email);
  }, []);

  // ==========================================
  // HANDLE OTP INPUT
  // ==========================================

  const handleOtpChange = (
    value: string,
  ) => {
    // Only allow numbers
    const numbersOnly =
      value.replace(/[^0-9]/g, "");

    // Limit OTP to 6 digits
    const limitedOTP =
      numbersOnly.slice(0, 6);

    setOtp(limitedOTP);

    // Clear messages while typing
    setErrorMessage("");
    setSuccessMessage("");
  };

  // ==========================================
  // VERIFY OTP
  // ==========================================

  const handleVerifyOTP = async () => {
    // ==========================================
    // VALIDATE OTP
    // ==========================================

    if (otp.length !== 6) {
      setErrorMessage(
        "Please enter the complete 6-digit verification code.",
      );

      return;
    }

    // ==========================================
    // GET REGISTRATION DATA
    // ==========================================

    const registrationData =
      getRegistrationData();

    if (!registrationData) {
      setErrorMessage(
        "Your registration information could not be found. Please register again.",
      );

      return;
    }

    try {
      setIsLoading(true);

      setErrorMessage("");
      setSuccessMessage("");

      console.log(
        "Verifying OTP for:",
        registrationData.email,
      );

      // ========================================
      // VERIFY OTP WITH BACKEND
      // ========================================

      await verifyOTP(
        registrationData.email,
        otp,
      );

      console.log(
        "OTP verified successfully.",
      );

      // ========================================
      // CREATE FIREBASE ACCOUNT
      // ========================================

      console.log(
        "Creating Firebase account...",
      );

      await registerUser(
        registrationData.firstName,
        registrationData.lastName,
        registrationData.email,
        registrationData.password,
      );

      console.log(
        "Firebase account created successfully.",
      );

      // ========================================
      // CLEAR TEMPORARY DATA
      // ========================================

      clearRegistrationData();

      console.log(
        "Temporary registration data cleared.",
      );

      // ========================================
      // SHOW SUCCESS
      // ========================================

      setSuccessMessage(
        "Your email has been verified and your account has been created successfully.",
      );

      // ========================================
      // GO TO LOGIN
      // ========================================

      setTimeout(() => {
        router.replace("/login");
      }, 1500);

    } catch (error: any) {
      console.error(
        "OTP verification / registration error:",
        error,
      );

      // ========================================
      // FIREBASE EMAIL ALREADY EXISTS
      // ========================================

      if (
        error?.code ===
        "auth/email-already-in-use"
      ) {
        setErrorMessage(
          "This email address is already registered. Please log in instead.",
        );

        return;
      }

      // ========================================
      // INVALID OTP
      // ========================================

      setErrorMessage(
        error?.message ||
          "The verification code is invalid or expired. Please try again.",
      );

    } finally {
      setIsLoading(false);
    }
  };

  // ==========================================
  // RESEND OTP
  // ==========================================

  const handleResendOTP = async () => {
    if (!email) {
      setErrorMessage(
        "Your email address could not be found. Please register again.",
      );

      return;
    }

    try {
      setIsResending(true);

      setErrorMessage("");
      setSuccessMessage("");

      console.log(
        "Resending OTP to:",
        email,
      );

      await sendOTP(email);

      console.log(
        "OTP resent successfully.",
      );

      setSuccessMessage(
        "A new verification code has been sent to your email.",
      );

      setOtp("");

    } catch (error: any) {
      console.error(
        "Resend OTP error:",
        error,
      );

      setErrorMessage(
        error?.message ||
          "We could not resend the verification code. Please try again.",
      );

    } finally {
      setIsResending(false);
    }
  };

  // ==========================================
  // BACK TO REGISTER
  // ==========================================

  const handleBackToRegister = () => {
    if (isLoading || isResending) {
      return;
    }

    clearRegistrationData();

    router.replace("/register");
  };

  // ==========================================
  // SCREEN
  // ==========================================

  return (
    <KeyboardAvoidingView
      style={styles.container}
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
        <View style={styles.card}>

          {/* ======================================
              TITLE
          ======================================= */}

          <Text style={styles.title}>
            Verify Your Email
          </Text>

          {/* ======================================
              DESCRIPTION
          ======================================= */}

          <Text style={styles.description}>
            We sent a 6-digit verification code
            to:
          </Text>

          {/* ======================================
              EMAIL
          ======================================= */}

          <Text style={styles.emailText}>
            {email}
          </Text>

          {/* ======================================
              OTP LABEL
          ======================================= */}

          <Text style={styles.label}>
            Verification Code
          </Text>

          {/* ======================================
              OTP INPUT
          ======================================= */}

          <TextInput
            style={styles.otpInput}
            value={otp}
            onChangeText={handleOtpChange}
            placeholder="000000"
            placeholderTextColor="#9CA3AF"
            keyboardType="number-pad"
            maxLength={6}
            editable={
              !isLoading &&
              !isResending
            }
            autoFocus
          />

          {/* ======================================
              OTP INFORMATION
          ======================================= */}

          <Text style={styles.helperText}>
            The code will expire in 5 minutes.
          </Text>

          {/* ======================================
              ERROR MESSAGE
          ======================================= */}

          {errorMessage ? (
            <Text style={styles.errorText}>
              {errorMessage}
            </Text>
          ) : null}

          {/* ======================================
              SUCCESS MESSAGE
          ======================================= */}

          {successMessage ? (
            <Text style={styles.successText}>
              {successMessage}
            </Text>
          ) : null}

          {/* ======================================
              VERIFY BUTTON
          ======================================= */}

          <Pressable
            style={({ pressed }) => [
              styles.verifyButton,
              pressed &&
                styles.buttonPressed,
              (isLoading ||
                isResending) &&
                styles.buttonDisabled,
            ]}
            onPress={handleVerifyOTP}
            disabled={
              isLoading ||
              isResending
            }
          >
            {isLoading ? (
              <ActivityIndicator
                size="small"
                color="#FFFFFF"
              />
            ) : (
              <Text
                style={
                  styles.verifyButtonText
                }
              >
                VERIFY EMAIL
              </Text>
            )}
          </Pressable>

          {/* ======================================
              RESEND SECTION
          ======================================= */}

          <View
            style={
              styles.resendContainer
            }
          >
            <Text
              style={styles.resendText}
            >
              Didn't receive the code?
            </Text>

            <Pressable
              onPress={handleResendOTP}
              disabled={
                isLoading ||
                isResending
              }
            >
              {isResending ? (
                <ActivityIndicator
                  size="small"
                  color="#000000"
                />
              ) : (
                <Text
                  style={
                    styles.resendLink
                  }
                >
                  Resend Code
                </Text>
              )}
            </Pressable>
          </View>

          {/* ======================================
              BACK TO REGISTER
          ======================================= */}

          <Pressable
            onPress={
              handleBackToRegister
            }
            disabled={
              isLoading ||
              isResending
            }
          >
            <Text
              style={
                styles.backToRegister
              }
            >
              ← Back to Registration
            </Text>
          </Pressable>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

