// React is required for useState
import React, { useState } from "react";

// React Native components used for the Login form
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

// Login screen
export default function LoginScreen() {
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

  const handleLogin = () => {
    // Authentication will be connected later
    console.log("Email:", email);
    console.log("Password:", password);
  };

  // ==========================================
  // FORGOT PASSWORD
  // ==========================================

  const handleForgotPassword = () => {
    // Forgot password functionality will be
    // connected later
    console.log("Forgot password");
  };

  // ==========================================
  // SIGN UP
  // ==========================================

  const handleSignUp = () => {
    // Navigate to the registration screen
    router.push("/register");
  };

  return (
    // Keeps the form visible when the keyboard
    // appears on mobile
    <KeyboardAvoidingView
      style={{
        flex: 1,
        backgroundColor: "#F4F8F5",
      }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* Allows the page to scroll on smaller
          mobile screens and desktop browsers */}
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: 20,
          paddingVertical: 35,
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* ========================================
            LOGIN CARD
        ========================================= */}
        <View
          style={{
            width: "100%",
            maxWidth: 460,
            backgroundColor: "#FFFFFF",
            borderRadius: 24,
            paddingHorizontal: 30,
            paddingVertical: 36,

            // Mobile shadow
            shadowColor: "#000000",
            shadowOffset: {
              width: 0,
              height: 8,
            },
            shadowOpacity: 0.08,
            shadowRadius: 20,

            // Android shadow
            elevation: 5,
          }}
        >
          {/* ======================================
              LOGO
          ======================================= */}
          <View
            style={{
              width: 105,
              height: 105,
              borderRadius: 52.5,
              backgroundColor: "#F3F8F4",
              alignItems: "center",
              justifyContent: "center",
              alignSelf: "center",
              marginBottom: 22,
            }}
          >
            <Image
              source={require("../../assets/images/siya-logo.png")}
              style={{
                width: 82,
                height: 82,
              }}
              resizeMode="contain"
            />
          </View>

          {/* ======================================
              TITLE
          ======================================= */}
          <Text
            style={{
              color: "#17231B",
              fontSize: 30,
              fontWeight: "700",
              textAlign: "center",
              marginBottom: 10,
            }}
          >
            Welcome Back!
          </Text>

          {/* Description */}
          <Text
            style={{
              color: "#6B756F",
              fontSize: 15,
              lineHeight: 23,
              textAlign: "center",
              marginBottom: 30,
            }}
          >
            Login to your Siya-Fund account and continue saving, borrowing, and
            growing together.
          </Text>

          {/* ======================================
              EMAIL
          ======================================= */}
          <View
            style={{
              width: "100%",
              marginBottom: 18,
            }}
          >
            <Text
              style={{
                color: "#27332C",
                fontSize: 14,
                fontWeight: "600",
                marginBottom: 8,
              }}
            >
              Email Address
            </Text>

            <TextInput
              style={{
                width: "100%",
                height: 54,
                backgroundColor: "#F8FAF9",
                borderWidth: 1,
                borderColor: "#DCE5DF",
                borderRadius: 12,
                paddingHorizontal: 16,
                color: "#17231B",
                fontSize: 15,
              }}
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
              PASSWORD
          ======================================= */}
          <View
            style={{
              width: "100%",
              marginBottom: 18,
            }}
          >
            <Text
              style={{
                color: "#27332C",
                fontSize: 14,
                fontWeight: "600",
                marginBottom: 8,
              }}
            >
              Password
            </Text>

            <TextInput
              style={{
                width: "100%",
                height: 54,
                backgroundColor: "#F8FAF9",
                borderWidth: 1,
                borderColor: "#DCE5DF",
                borderRadius: 12,
                paddingHorizontal: 16,
                color: "#17231B",
                fontSize: 15,
              }}
              placeholder="Enter your password"
              placeholderTextColor="#9CA3AF"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          {/* ======================================
              FORGOT PASSWORD
          ======================================= */}
          <Pressable
            style={{
              alignSelf: "flex-end",
              marginTop: -3,
              marginBottom: 24,
            }}
            onPress={handleForgotPassword}
          >
            <Text
              style={{
                color: "#2E8B57",
                fontSize: 14,
                fontWeight: "600",
              }}
            >
              Forgot Password?
            </Text>
          </Pressable>

          {/* ======================================
              LOGIN BUTTON
          ======================================= */}
          <Pressable
            style={({ pressed }) => ({
              width: "100%",
              height: 56,
              backgroundColor: "#2E8B57",
              borderRadius: 13,
              alignItems: "center",
              justifyContent: "center",

              // Press animation
              opacity: pressed ? 0.75 : 1,
              transform: [
                {
                  scale: pressed ? 0.98 : 1,
                },
              ],
            })}
            onPress={handleLogin}
          >
            <Text
              style={{
                color: "#FFFFFF",
                fontSize: 16,
                fontWeight: "700",
                letterSpacing: 1,
              }}
            >
              LOGIN
            </Text>
          </Pressable>

          {/* ======================================
              SIGN UP
          ======================================= */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              marginTop: 28,
              gap: 5,
            }}
          >
            <Text
              style={{
                color: "#7A837D",
                fontSize: 14,
              }}
            >
              Don't have an account?
            </Text>

            <Pressable onPress={handleSignUp}>
              <Text
                style={{
                  color: "#2E8B57",
                  fontSize: 14,
                  fontWeight: "700",
                }}
              >
                Sign Up
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
