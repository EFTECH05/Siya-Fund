
// ==========================================
// IMPORTS
// ==========================================

import React, { useState } from "react";

import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

import { router } from "expo-router";

import { sendOTP } from "../../services/OtpService";
import { setRegistrationData } from "../../services/RegistrationStore";

import { styles } from "./RegisterScreen.styles";

// ==========================================
// REGISTER SCREEN
// ==========================================

export default function RegisterScreen() {
  // ==========================================
  // FORM STATE
  // ==========================================

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // ==========================================
  // LOADING STATE
  // ==========================================

  const [isLoading, setIsLoading] = useState(false);

  // ==========================================
  // ERROR MODAL STATE
  // ==========================================

  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorTitle, setErrorTitle] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // ==========================================
  // SHOW ERROR MODAL
  // ==========================================

  const showError = (
    title: string,
    message: string,
  ) => {
    setErrorTitle(title);
    setErrorMessage(message);
    setShowErrorModal(true);
  };

  // ==========================================
  // REGISTER USER
  // ==========================================

  const handleRegister = async () => {
    // ==========================================
    // CLEAN USER INFORMATION
    // ==========================================

    const cleanFirstName = firstName.trim();
    const cleanLastName = lastName.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone.trim();

    // ==========================================
    // VALIDATION
    // ==========================================

    if (
      !cleanFirstName ||
      !cleanLastName ||
      !cleanEmail ||
      !cleanPhone ||
      !password ||
      !confirmPassword
    ) {
      showError(
        "Missing Information",
        "Please complete all the required fields before creating your account.",
      );
      return;
    }

    // ==========================================
    // EMAIL VALIDATION
    // ==========================================

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(cleanEmail)) {
      showError(
        "Invalid Email",
        "Please enter a valid email address.",
      );
      return;
    }

    // ==========================================
    // PASSWORD VALIDATION
    // ==========================================

    if (password.length < 6) {
      showError(
        "Password Too Short",
        "Your password must contain at least 6 characters.",
      );
      return;
    }

    // ==========================================
    // CONFIRM PASSWORD
    // ==========================================

    if (password !== confirmPassword) {
      showError(
        "Passwords Do Not Match",
        "Please make sure both password fields contain the same password.",
      );
      return;
    }

    // ==========================================
    // SEND OTP
    // ==========================================

    try {
      setIsLoading(true);

      console.log(
        "Starting email verification for:",
        cleanEmail,
      );

      // ========================================
      // SAVE REGISTRATION INFORMATION
      // ========================================

      setRegistrationData({
        firstName: cleanFirstName,
        lastName: cleanLastName,
        email: cleanEmail,
        phone: cleanPhone,
        password,
      });

      console.log(
        "Registration information saved temporarily.",
      );

      // ========================================
      // SEND OTP TO EMAIL
      // ========================================

      console.log(
        "Sending OTP to:",
        cleanEmail,
      );

      await sendOTP(cleanEmail);

      console.log(
        "OTP sent successfully.",
      );

      // ========================================
      // GO TO OTP VERIFICATION SCREEN
      // ========================================

      router.replace("/verify-email");

    } catch (error: any) {
      // ========================================
      // LOG ERROR
      // ========================================

      console.error(
        "OTP sending error:",
        error,
      );

      // ========================================
      // SHOW ERROR
      // ========================================

      showError(
        "Unable to Send OTP",
        error?.message ||
          "We could not send the verification code. Please check your internet connection and try again.",
      );

    } finally {
      // ========================================
      // STOP LOADING
      // ========================================

      setIsLoading(false);
    }
  };

  // ==========================================
  // LOGIN BUTTON FROM ERROR MODAL
  // ==========================================

  const handleLoginFromModal = () => {
    setShowErrorModal(false);
    router.push("/login");
  };

  // ==========================================
  // BACK TO LOGIN
  // ==========================================

  const handleBackToLogin = () => {
    if (isLoading) {
      return;
    }

    router.push("/login");
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
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>

          {/* ======================================
              LOGO
          ======================================= */}

          <View style={styles.logoContainer}>
            <Image
              source={require(
                "../../../assets/images/siya-logo.png"
              )}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          {/* ======================================
              TITLE
          ======================================= */}

          <Text style={styles.title}>
            Create Account
          </Text>

          {/* ======================================
              DESCRIPTION
          ======================================= */}

          <Text style={styles.description}>
            Join Siya-Fund and start saving together,
            borrowing smarter, and growing together.
          </Text>

          {/* ======================================
              FIRST NAME
          ======================================= */}

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              First Name
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Enter your first name"
              placeholderTextColor="#9CA3AF"
              value={firstName}
              onChangeText={setFirstName}
              autoCapitalize="words"
              autoCorrect={false}
              editable={!isLoading}
            />
          </View>

          {/* ======================================
              LAST NAME
          ======================================= */}

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Last Name
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Enter your last name"
              placeholderTextColor="#9CA3AF"
              value={lastName}
              onChangeText={setLastName}
              autoCapitalize="words"
              autoCorrect={false}
              editable={!isLoading}
            />
          </View>

          {/* ======================================
              EMAIL
          ======================================= */}

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Email Address
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor="#9CA3AF"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isLoading}
            />
          </View>

          {/* ======================================
              PHONE
          ======================================= */}

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Phone Number
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Enter your phone number"
              placeholderTextColor="#9CA3AF"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              editable={!isLoading}
            />
          </View>

          {/* ======================================
              PASSWORD
          ======================================= */}

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Password
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Create a password"
              placeholderTextColor="#9CA3AF"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isLoading}
            />
          </View>

          {/* ======================================
              CONFIRM PASSWORD
          ======================================= */}

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Confirm Password
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Confirm your password"
              placeholderTextColor="#9CA3AF"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isLoading}
            />
          </View>

          {/* ======================================
              REGISTER BUTTON
          ======================================= */}

          <Pressable
            style={({ pressed }) => [
              styles.registerButton,
              pressed && styles.buttonPressed,
              isLoading && styles.buttonDisabled,
            ]}
            onPress={handleRegister}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator
                size="small"
                color="#FFFFFF"
              />
            ) : (
              <Text style={styles.registerButtonText}>
                CREATE ACCOUNT
              </Text>
            )}
          </Pressable>

          {/* ======================================
              LOGIN LINK
          ======================================= */}

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>
              Already have an account?
            </Text>

            <Pressable
              onPress={handleBackToLogin}
              disabled={isLoading}
            >
              <Text style={styles.loginLink}>
                Login
              </Text>
            </Pressable>
          </View>

          {/* ======================================
              FOOTER
          ======================================= */}

          <Text style={styles.footerText}>
            Save Together • Borrow Smarter • Grow Together
          </Text>

        </View>
      </ScrollView>

      {/* ==========================================
          ERROR MODAL
      ========================================== */}

      <Modal
        visible={showErrorModal}
        transparent
        animationType="fade"
        onRequestClose={() =>
          setShowErrorModal(false)
        }
      >
        <View style={styles.modalOverlay}>
          <View style={styles.errorModal}>

            {/* ======================================
                ERROR ICON
            ======================================= */}

            <View
              style={styles.errorIconContainer}
            >
              <Text style={styles.errorIcon}>
                !
              </Text>
            </View>

            {/* ======================================
                TITLE
            ======================================= */}

            <Text
              style={styles.errorModalTitle}
            >
              {errorTitle}
            </Text>

            {/* ======================================
                MESSAGE
            ======================================= */}

            <Text
              style={styles.errorModalMessage}
            >
              {errorMessage}
            </Text>

            {/* ======================================
                BUTTONS
            ======================================= */}

            <View
              style={styles.modalButtonContainer}
            >

              {/* LOGIN NOW BUTTON */}

              {errorTitle ===
                "Email Already Registered" && (
                <Pressable
                  style={({ pressed }) => [
                    styles.modalPrimaryButton,
                    pressed &&
                      styles.modalButtonPressed,
                  ]}
                  onPress={
                    handleLoginFromModal
                  }
                >
                  <Text
                    style={
                      styles.modalPrimaryButtonText
                    }
                  >
                    LOGIN NOW
                  </Text>
                </Pressable>
              )}

              {/* CANCEL / OK BUTTON */}

              <Pressable
                style={({ pressed }) => [
                  styles.modalSecondaryButton,
                  pressed &&
                    styles.modalButtonPressed,
                ]}
                onPress={() =>
                  setShowErrorModal(false)
                }
              >
                <Text
                  style={
                    styles.modalSecondaryButtonText
                  }
                >
                  {errorTitle ===
                  "Email Already Registered"
                    ? "CANCEL"
                    : "OK"}
                </Text>
              </Pressable>

            </View>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}
