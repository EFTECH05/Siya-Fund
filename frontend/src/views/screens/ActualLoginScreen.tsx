
import React, {
  useState,
} from "react";

// React Native components
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

// Expo Router
import {
  router,
} from "expo-router";

// Import styles
import {
  styles,
} from "./ActualLoginScreen.styles";

// ==========================================
// PROPS
// ==========================================

type ActualLoginScreenProps = {
  onLogin: (
    email: string,
    password: string,
  ) => Promise<void>;

  onGoogleLogin: () => Promise<void>;

  onForgotPassword: () => void;

  isLoading: boolean;
};

// ==========================================
// ACTUAL LOGIN SCREEN
// ==========================================

export default function ActualLoginScreen({
  onLogin,
  onGoogleLogin,
  onForgotPassword,
  isLoading,
}: ActualLoginScreenProps) {
  // ========================================
  // FORM STATE
  // ========================================

  const [
    email,
    setEmail,
  ] = useState("");

  const [
    password,
    setPassword,
  ] = useState("");

  // ========================================
  // NORMAL LOGIN
  // ========================================

  const handleLogin =
    async () => {
      await onLogin(
        email,
        password,
      );
    };

  // ========================================
  // GOOGLE LOGIN
  // ========================================

  const handleGoogleLogin =
    async () => {
      await onGoogleLogin();
    };

  // ========================================
  // SIGN UP
  // ========================================

  const handleSignUp =
    () => {
      router.push(
        "/register",
      );
    };

  // ========================================
  // UI
  // ========================================

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
        showsVerticalScrollIndicator={
          false
        }
      >
        <View style={styles.card}>

          {/* ================================= */}
          {/* LOGO */}
          {/* ================================= */}

          <View
            style={
              styles.logoContainer
            }
          >
            <Image
              source={require(
                "../../../assets/images/siya-logo.png",
              )}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          {/* ================================= */}
          {/* TITLE */}
          {/* ================================= */}

          <Text
            style={styles.title}
          >
            Welcome Back!
          </Text>

          {/* ================================= */}
          {/* DESCRIPTION */}
          {/* ================================= */}

          <Text
            style={
              styles.description
            }
          >
            Login to your Siya-Fund account
            and continue saving, borrowing,
            and growing together.
          </Text>

          {/* ================================= */}
          {/* EMAIL */}
          {/* ================================= */}

          <View
            style={
              styles.inputGroup
            }
          >
            <Text
              style={styles.label}
            >
              Email Address
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor="#9CA3AF"
              value={email}
              onChangeText={
                setEmail
              }
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              editable={
                !isLoading
              }
            />
          </View>

          {/* ================================= */}
          {/* PASSWORD */}
          {/* ================================= */}

          <View
            style={
              styles.inputGroup
            }
          >
            <Text
              style={styles.label}
            >
              Password
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              placeholderTextColor="#9CA3AF"
              value={password}
              onChangeText={
                setPassword
              }
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              editable={
                !isLoading
              }
            />
          </View>

          {/* ================================= */}
          {/* FORGOT PASSWORD */}
          {/* ================================= */}

          <Pressable
            style={
              styles.forgotButton
            }
            onPress={
              onForgotPassword
            }
            disabled={
              isLoading
            }
          >
            <Text
              style={
                styles.forgotText
              }
            >
              Forgot Password?
            </Text>
          </Pressable>

          {/* ================================= */}
          {/* NORMAL LOGIN */}
          {/* ================================= */}

          <Pressable
            style={({
              pressed,
            }) => [
              styles.loginButton,

              pressed &&
                styles.buttonPressed,

              isLoading &&
                styles.buttonLoading,
            ]}
            onPress={
              handleLogin
            }
            disabled={
              isLoading
            }
          >
            <Text
              style={
                styles.loginButtonText
              }
            >
              {isLoading
                ? "LOGGING IN..."
                : "LOGIN"}
            </Text>
          </Pressable>

          {/* ================================= */}
          {/* GOOGLE DIVIDER */}
          {/* ================================= */}

          <View
            style={
              styles.googleDividerContainer
            }
          >
            <View
              style={
                styles.googleDividerLine
              }
            />

            <Text
              style={
                styles.googleDividerText
              }
            >
              OR
            </Text>

            <View
              style={
                styles.googleDividerLine
              }
            />
          </View>

          {/* ================================= */}
          {/* GOOGLE LOGIN */}
          {/* ================================= */}

          <Pressable
            style={({
              pressed,
            }) => [
              styles.googleButton,

              pressed &&
                styles.buttonPressed,

              isLoading &&
                styles.googleButtonLoading,
            ]}
            onPress={
              handleGoogleLogin
            }
            disabled={
              isLoading
            }
          >
            <Text
              style={
                styles.googleButtonText
              }
            >
              {isLoading
                ? "CONNECTING TO GOOGLE..."
                : "Continue with Google"}
            </Text>
          </Pressable>

          {/* ================================= */}
          {/* SIGN UP */}
          {/* ================================= */}

          <View
            style={
              styles.signUpContainer
            }
          >
            <Text
              style={
                styles.signUpText
              }
            >
              Don't have an account?
            </Text>

            <Pressable
              onPress={
                handleSignUp
              }
              disabled={
                isLoading
              }
            >
              <Text
                style={
                  styles.signUpLink
                }
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

