
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

  const handleLogin = async () => {
    await onLogin(email.trim(), password);
  };

  const handleGoogleLogin = async () => {
    await onGoogleLogin();
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
              editable={!isLoading}
              returnKeyType="next"
            />
          </View>

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
              editable={!isLoading}
              returnKeyType="done"
              onSubmitEditing={handleLogin}
            />
          </View>

          <Pressable
            style={styles.forgotButton}
            onPress={onForgotPassword}
            disabled={isLoading}
          >
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </Pressable>

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
              {isLoading ? "PLEASE WAIT..." : "Sign In"}
            </Text>
          </Pressable>

          <View style={styles.googleDividerContainer}>
            <View style={styles.googleDividerLine} />

            <Text style={styles.googleDividerText}>OR</Text>

            <View style={styles.googleDividerLine} />
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.googleButton,
              pressed && styles.buttonPressed,
              isLoading && styles.googleButtonLoading,
            ]}
            onPress={handleGoogleLogin}
            disabled={isLoading}
          >
            <View style={styles.googleButtonContent}>
              <AntDesign
                name="google"
                size={21}
                color="#4285F4"
              />

              <Text style={styles.googleButtonText}>
                {isLoading
                  ? "Connecting to Google..."
                  : "Continue with Google"}
              </Text>
            </View>
          </Pressable>

          <View style={styles.signUpContainer}>
            <Text style={styles.signUpText}>
              Don't have an account?
            </Text>

            <Pressable
              onPress={() => router.push("/register")}
              disabled={isLoading}
            >
              <Text style={styles.signUpLink}> Sign Up</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

