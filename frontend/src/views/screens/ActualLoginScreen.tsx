import React, { useState } from "react";

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

import { router } from "expo-router";
import { AntDesign } from "@expo/vector-icons";

import { styles } from "./ActualLoginScreen.styles";

type ActualLoginScreenProps = {
  onLogin: (email: string, password: string) => Promise<void>;

  onGoogleLogin: () => Promise<void>;

  onForgotPassword: () => void;

  isLoading: boolean;
};

export default function ActualLoginScreen({
  onLogin,
  onGoogleLogin,
  onForgotPassword,
  isLoading,
}: ActualLoginScreenProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const isBusy = isLoading || isGoogleLoading;

  // ==========================================================
  // EMAIL + PASSWORD LOGIN
  // ==========================================================

  const handleLogin = async () => {
    if (isBusy) return;

    await onLogin(email.trim(), password);
  };

  // ==========================================================
  // GOOGLE LOGIN
  // ==========================================================

  const handleGoogleLogin = async () => {
    if (isBusy) return;

    try {
      setIsGoogleLoading(true);
      await onGoogleLogin();
    } finally {
      setIsGoogleLoading(false);
    }
  };

  // ==========================================================
  // LOGIN SCREEN
  // ==========================================================

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
          <View style={styles.logoContainer}>
            <Image
              source={require("../../../assets/images/siya-logo.png")}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          <Text style={styles.title}>Welcome Back</Text>

          <Text style={styles.description}>
            Sign in to continue to your Siya-Fund account.
          </Text>

          {/* EMAIL ADDRESS */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email Address</Text>

            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor="#9CA3AF"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="email"
              editable={!isBusy}
              returnKeyType="next"
              accessibilityLabel="Email address"
            />
          </View>

          {/* PASSWORD */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>

            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              placeholderTextColor="#9CA3AF"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              autoComplete="current-password"
              editable={!isBusy}
              returnKeyType="done"
              onSubmitEditing={handleLogin}
              accessibilityLabel="Password"
            />
          </View>

          {/* FORGOT PASSWORD */}
          <Pressable
            style={styles.forgotButton}
            onPress={onForgotPassword}
            disabled={isBusy}
            accessibilityRole="button"
          >
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </Pressable>

          {/* EMAIL LOGIN */}
          <Pressable
            style={({ pressed }) => [
              styles.loginButton,
              pressed && styles.buttonPressed,
              isBusy && styles.buttonLoading,
            ]}
            onPress={handleLogin}
            disabled={isBusy}
            accessibilityRole="button"
          >
            <Text style={styles.loginButtonText}>
              {isLoading ? "PLEASE WAIT..." : "Sign In"}
            </Text>
          </Pressable>

          {/* GOOGLE DIVIDER */}
          <View style={styles.googleDividerContainer}>
            <View style={styles.googleDividerLine} />

            <Text style={styles.googleDividerText}>OR</Text>

            <View style={styles.googleDividerLine} />
          </View>

          {/* GOOGLE LOGIN */}
          <Pressable
            style={({ pressed }) => [
              styles.googleButton,
              pressed && styles.buttonPressed,
              isBusy && styles.googleButtonLoading,
            ]}
            onPress={handleGoogleLogin}
            disabled={isBusy}
            accessibilityRole="button"
            accessibilityLabel="Continue with Google"
          >
            <View style={styles.googleButtonContent}>
              <AntDesign name="google" size={21} color="#4285F4" />

              <Text style={styles.googleButtonText}>
                {isGoogleLoading
                  ? "Connecting to Google..."
                  : "Continue with Google"}
              </Text>
            </View>
          </Pressable>

          {/* SIGN-UP LINK */}
          <View style={styles.signUpContainer}>
            <Text style={styles.signUpText}>Don't have an account?</Text>

            <Pressable
              onPress={() => router.push("/register")}
              disabled={isBusy}
              accessibilityRole="button"
            >
              <Text style={styles.signUpLink}> Sign Up</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
