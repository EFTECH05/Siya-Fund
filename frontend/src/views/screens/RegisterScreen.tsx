// React is required for useState
import React, { useState } from "react";

// React Native components used for the Registration form
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

// Import the Registration screen styles
import { styles } from "./RegisterScreen.styles";

export default function RegisterScreen() {
  // ==========================================
  // FORM STATE
  // ==========================================

  // Store the user's first name
  const [firstName, setFirstName] = useState("");

  // Store the user's last name
  const [lastName, setLastName] = useState("");

  // Store the user's email
  const [email, setEmail] = useState("");

  // Store the user's phone number
  const [phone, setPhone] = useState("");

  // Store the user's password
  const [password, setPassword] = useState("");

  // Store the password confirmation
  const [confirmPassword, setConfirmPassword] = useState("");

  // ==========================================
  // REGISTER
  // ==========================================

  const handleRegister = () => {
    // Registration functionality will be
    // connected to Firebase/backend later.
    console.log("First Name:", firstName);
    console.log("Last Name:", lastName);
    console.log("Email:", email);
    console.log("Phone:", phone);
    console.log("Password:", password);
    console.log("Confirm Password:", confirmPassword);
  };

  // ==========================================
  // LOGIN
  // ==========================================

  const handleLogin = () => {
    // Navigate back to the Login screen
    router.push("/login");
  };

  return (
    // Keeps the form visible when the keyboard
    // appears on mobile devices
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* Allows the registration form to scroll
          on smaller mobile screens and web */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* ========================================
            REGISTRATION CARD
        ========================================= */}
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
              TITLE
          ======================================= */}
          <Text style={styles.title}>Create Account</Text>

          {/* Description */}
          <Text style={styles.description}>
            Create your Siya-Fund account and start saving, borrowing, and
            growing together.
          </Text>

          {/* ======================================
              FIRST NAME
          ======================================= */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>First Name</Text>

            <TextInput
              style={styles.input}
              placeholder="Enter your first name"
              placeholderTextColor="#9CA3AF"
              value={firstName}
              onChangeText={setFirstName}
              autoCapitalize="words"
              autoCorrect={false}
            />
          </View>

          {/* ======================================
              LAST NAME
          ======================================= */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Last Name</Text>

            <TextInput
              style={styles.input}
              placeholder="Enter your last name"
              placeholderTextColor="#9CA3AF"
              value={lastName}
              onChangeText={setLastName}
              autoCapitalize="words"
              autoCorrect={false}
            />
          </View>

          {/* ======================================
              EMAIL
          ======================================= */}
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
            />
          </View>

          {/* ======================================
              PHONE NUMBER
          ======================================= */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone Number</Text>

            <TextInput
              style={styles.input}
              placeholder="Enter your phone number"
              placeholderTextColor="#9CA3AF"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
          </View>

          {/* ======================================
              PASSWORD
          ======================================= */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>

            <TextInput
              style={styles.input}
              placeholder="Create a password"
              placeholderTextColor="#9CA3AF"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          {/* ======================================
              CONFIRM PASSWORD
          ======================================= */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Confirm Password</Text>

            <TextInput
              style={styles.input}
              placeholder="Confirm your password"
              placeholderTextColor="#9CA3AF"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          {/* ======================================
              CREATE ACCOUNT BUTTON
          ======================================= */}
          <Pressable
            style={({ pressed }) => [
              styles.registerButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={handleRegister}
          >
            <Text style={styles.registerButtonText}>CREATE ACCOUNT</Text>
          </Pressable>

          {/* ======================================
              LOGIN LINK
          ======================================= */}
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account?</Text>

            <Pressable onPress={handleLogin}>
              <Text style={styles.loginLink}>Login</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
