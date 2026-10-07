
// React Native components used to build the Welcome screen

import { Image, Text, View, Pressable } from "react-native";

// Expo Router is used for navigation

import { router } from "expo-router";

// Import the styles for this screen

import { styles } from "./LoginScreen.styles";

export default function LoginScreen() {
  // ==========================================
  // LOGIN BUTTON
  // ==========================================

  // Navigate to the actual Login screen

  const handleLogin = () => {
    router.push("/login");
  };

  // ==========================================
  // SIGN UP BUTTON
  // ==========================================

  // Navigate to the Registration screen

  const handleSignUp = () => {
    router.push("/register");
  };

  return (
    // Main screen container

    <View style={styles.container}>
      {/* ========================================
          MAIN CONTENT CARD
      ========================================= */}

      <View style={styles.content}>
        {/* ========================================
            SIYA-FUND LOGO
        ========================================= */}

        <View style={styles.logoContainer}>
          <Image
            source={require("../../../assets/images/siya-logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        {/* ========================================
            WELCOME TEXT
        ========================================= */}

        <View style={styles.textContainer}>
          {/* Main welcome heading */}

          <Text style={styles.title}>
            Hello, Welcome!
          </Text>

          {/* Welcome description */}

          <Text style={styles.description}>
            Welcome to Siya-Fund, your platform to save together, borrow
            smarter, and grow together.
          </Text>
        </View>

        {/* ========================================
            LOGIN AND SIGN UP BUTTONS
        ========================================= */}

        <View style={styles.buttonContainer}>
          {/* ======================================
              LOGIN BUTTON
          ======================================= */}

          <Pressable
            style={({ pressed }) => [
              styles.loginButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={handleLogin}
          >
            <Text style={styles.loginButtonText}>
              LOGIN
            </Text>
          </Pressable>

          {/* ======================================
              SIGN UP BUTTON
          ======================================= */}

          <Pressable
            style={({ pressed }) => [
              styles.signUpButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={handleSignUp}
          >
            <Text style={styles.signUpButtonText}>
              SIGN UP
            </Text>
          </Pressable>
        </View>

        {/* ========================================
            FOOTER
        ========================================= */}

        <Text style={styles.footerText}>
          Save Together • Borrow Smarter • Grow Together
        </Text>
      </View>
    </View>
  );
}