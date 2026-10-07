
import React, { useState } from "react";

// React Native components used for the Login screen

import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

// Expo Router is used for navigation

import { router } from "expo-router";

// Import the styles for this screen

import { styles } from "./ActualLoginScreen.styles";

// Props received from the route

type ActualLoginScreenProps = {
  onLogin: (
    email: string,
    password: string,
  ) => Promise<void>;

  onForgotPassword: () => void;

  isLoading: boolean;
};

// Actual Login screen

export default function ActualLoginScreen({
  onLogin,
  onForgotPassword,
  isLoading,
}: ActualLoginScreenProps) {
  // ==========================================
  // FORM STATE
  // ==========================================

  // Store the user's email

  const [email, setEmail] = useState("");

  // Store the user's password

  const [password, setPassword] = useState("");

  // ==========================================
  // LOGIN
  // ==========================================

  const handleLogin = async () => {
    await onLogin(email, password);
  };

  // ==========================================
  // SIGN UP
  // ==========================================

  const handleSignUp = () => {
    // Navigate to the Registration screen

    router.push("/register");
  };

  return (
    // Keeps the form visible when the keyboard appears

    <KeyboardAvoidingView
      style={styles.container}
      behavior={
        Platform.OS === "ios"
          ? "padding"
          : undefined
      }
    >
      {/* Allows scrolling on smaller mobile screens */}

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* ========================================
            LOGIN CARD
        ========================================= */}

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
            Welcome Back!
          </Text>

          {/* Description */}

          <Text style={styles.description}>
            Login to your Siya-Fund account and
            continue saving, borrowing, and growing
            together.
          </Text>

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
              PASSWORD
          ======================================= */}

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Password
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Enter your password"
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
              FORGOT PASSWORD
          ======================================= */}

          <Pressable
            style={styles.forgotButton}
            onPress={onForgotPassword}
            disabled={isLoading}
          >
            <Text style={styles.forgotText}>
              Forgot Password?
            </Text>
          </Pressable>

          {/* ======================================
              LOGIN BUTTON
          ======================================= */}

          <Pressable
            style={({ pressed }) => [
              styles.loginButton,
              pressed && styles.buttonPressed,
              isLoading && styles.buttonLoading,
            ]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            <Text style={styles.loginButtonText}>
              {isLoading
                ? "LOGGING IN..."
                : "LOGIN"}
            </Text>
          </Pressable>

          {/* ======================================
              SIGN UP
          ======================================= */}

          <View style={styles.signUpContainer}>
            <Text style={styles.signUpText}>
              Don't have an account?
            </Text>

            <Pressable
              onPress={handleSignUp}
              disabled={isLoading}
            >
              <Text style={styles.signUpLink}>
                Sign Up
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}