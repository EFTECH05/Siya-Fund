

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
import { sendOTP, verifyOTP } from "../../services/OtpService";
import {
  clearRegistrationData,
  getRegistrationData,
} from "../../services/RegistrationStore";

import { styles } from "./CheckEmailScreen.styles";

export default function CheckEmailScreen() {
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const registrationData = getRegistrationData();

    if (!registrationData) {
      console.log("No registration data found.");
      router.replace("/register");
      return;
    }

    console.log("Registration data loaded for:", registrationData.email);
    setEmail(registrationData.email);
  }, []);

  const handleOtpChange = (value: string) => {
    setOtp(value.replace(/[^0-9]/g, "").slice(0, 6));
    setErrorMessage("");
    setSuccessMessage("");
  };

  const handleVerifyOTP = async () => {
    const registrationData = getRegistrationData();

    if (!registrationData) {
      setErrorMessage(
        "Your registration information could not be found. Please register again."
      );
      return;
    }

    if (!/^\d{6}$/.test(otp)) {
      setErrorMessage("Please enter the complete 6-digit verification code.");
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage("");
      setSuccessMessage("");

      // Step 1: Verify the code with the backend.
      console.log("Verifying registration OTP for:", registrationData.email);

      await verifyOTP(registrationData.email, otp);

      console.log("Registration OTP verified successfully.");

      // Step 2: Create the Firebase account only after verification succeeds.
      await registerUser(
        registrationData.firstName,
        registrationData.lastName,
        registrationData.email,
        registrationData.password
      );

      console.log("Firebase account created successfully.");

      // Step 3: Clear the temporary registration details.
      clearRegistrationData();

      // Step 4: Show success and return to login.
      setSuccessMessage(
        "Your email has been verified and your account has been created successfully."
      );

      setTimeout(() => {
        router.replace("/login");
      }, 1500);
    } catch (error: any) {
      console.error("Registration verification error:", error);

      if (error?.code === "auth/email-already-in-use") {
        setErrorMessage(
          "This email address is already registered. Please log in instead."
        );
      } else {
        const message = String(error?.message ?? "").toLowerCase();

        if (
          message.includes("invalid") ||
          message.includes("expired")
        ) {
          setErrorMessage(
            "The verification code is invalid or has expired. Please check it or request a new code."
          );
        } else {
          setErrorMessage(
            error?.message ||
              "We could not verify your email or create your account. Please try again."
          );
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!email) {
      setErrorMessage(
        "Your email address could not be found. Please register again."
      );
      return;
    }

    try {
      setIsResending(true);
      setErrorMessage("");
      setSuccessMessage("");

      console.log("Resending OTP to:", email);

      await sendOTP(email);

      console.log("OTP resent successfully.");

      setSuccessMessage(
        "A new verification code has been sent to your email."
      );
      setOtp("");
    } catch (error: any) {
      console.error("Resend OTP error:", error);

      setErrorMessage(
        error?.message ||
          "We could not resend the verification code. Please try again."
      );
    } finally {
      setIsResending(false);
    }
  };

  const handleBackToRegister = () => {
    if (isLoading || isResending) {
      return;
    }

    clearRegistrationData();
    router.replace("/register");
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <Text style={styles.title}>Verify Your Email</Text>

          <Text style={styles.description}>
            We sent a 6-digit verification code to:
          </Text>

          <Text style={styles.emailText}>{email}</Text>

          <Text style={styles.label}>Verification Code</Text>

          <TextInput
            style={styles.otpInput}
            value={otp}
            onChangeText={handleOtpChange}
            placeholder="000000"
            placeholderTextColor="#9CA3AF"
            keyboardType="number-pad"
            maxLength={6}
            editable={!isLoading && !isResending}
            autoFocus
          />

          <Text style={styles.helperText}>
            The code will expire in 5 minutes.
          </Text>

          {errorMessage ? (
            <Text style={styles.errorText}>{errorMessage}</Text>
          ) : null}

          {successMessage ? (
            <Text style={styles.successText}>{successMessage}</Text>
          ) : null}

          <Pressable
            style={({ pressed }) => [
              styles.verifyButton,
              pressed && styles.buttonPressed,
              (isLoading || isResending) && styles.buttonDisabled,
            ]}
            onPress={handleVerifyOTP}
            disabled={isLoading || isResending}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.verifyButtonText}>VERIFY EMAIL</Text>
            )}
          </Pressable>

          <View style={styles.resendContainer}>
            <Text style={styles.resendText}>Didn't receive the code?</Text>

            <Pressable
              onPress={handleResendOTP}
              disabled={isLoading || isResending}
            >
              {isResending ? (
                <ActivityIndicator size="small" color="#000000" />
              ) : (
                <Text style={styles.resendLink}>Resend Code</Text>
              )}
            </Pressable>
          </View>

          <Pressable
            onPress={handleBackToRegister}
            disabled={isLoading || isResending}
          >
            <Text style={styles.backToRegister}>← Back to Registration</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
