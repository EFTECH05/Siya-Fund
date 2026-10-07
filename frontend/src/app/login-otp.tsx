import React, { useEffect, useRef, useState } from "react";

import {
  Alert,
  BackHandler,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from "react-native";

import { router } from "expo-router";

import { getLoginEmail, clearLoginEmail } from "../services/LoginOtpStore";

import { verifyOTP, sendOTP } from "../services/OtpService";

import { getUserRole } from "../services/AuthService";

// ==========================================
// COLORS
// ==========================================

const GREEN = "#15803D";
const DARK_GREEN = "#166534";
const BLACK = "#111111";
const GREY = "#6B7280";
const LIGHT_GREY = "#F3F4F6";
const PAGE_BACKGROUND = "#F4F7F4";
const WHITE = "#FFFFFF";

// ==========================================
// SCREEN
// ==========================================

export default function LoginOtpScreen() {
  const { width } = useWindowDimensions();

  const isWeb = Platform.OS === "web";
  const isLargeScreen = width >= 768;

  const [email, setEmail] = useState<string | null>(null);

  const [otp, setOtp] = useState("");

  const [isVerifying, setIsVerifying] = useState(false);

  const [isResending, setIsResending] = useState(false);

  const [resendCountdown, setResendCountdown] = useState(0);

  // Prevent double taps
  const verifyLock = useRef(false);
  const resendLock = useRef(false);

  // ==========================================
  // LOAD EMAIL
  // ==========================================

  useEffect(() => {
    const storedEmail = getLoginEmail();

    console.log("OTP screen email:", storedEmail);

    if (!storedEmail) {
      Alert.alert("Session Expired", "Please login again.", [
        {
          text: "OK",
          onPress: () => {
            router.replace("/login");
          },
        },
      ]);

      return;
    }

    setEmail(storedEmail);

    // ========================================
    // ANDROID BACK BUTTON
    // ========================================

    if (Platform.OS === "android") {
      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        () => {
          Alert.alert(
            "Verification Required",
            "Please complete login verification before continuing.",
            [
              {
                text: "OK",
                style: "cancel",
              },
            ],
          );

          return true;
        },
      );

      return () => {
        backHandler.remove();
      };
    }
  }, []);

  // ==========================================
  // RESEND COUNTDOWN
  // ==========================================

  useEffect(() => {
    if (resendCountdown <= 0) {
      return;
    }

    const timer = setInterval(() => {
      setResendCountdown((previous) => {
        if (previous <= 1) {
          clearInterval(timer);
          return 0;
        }

        return previous - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [resendCountdown]);

  // ==========================================
  // VERIFY OTP
  // ==========================================

  const handleVerify = async () => {
    console.log("=================================");

    console.log("VERIFY BUTTON CLICKED");

    console.log("Email:", email);

    console.log("OTP:", otp);

    console.log("=================================");

    if (verifyLock.current) {
      console.log("Verification already running.");

      return;
    }

    if (!email) {
      Alert.alert("Session Expired", "Please login again.", [
        {
          text: "OK",
          onPress: () => {
            router.replace("/login");
          },
        },
      ]);

      return;
    }

    if (!otp) {
      Alert.alert(
        "OTP Required",
        "Please enter your 6-digit verification code.",
      );

      return;
    }

    if (!/^\d{6}$/.test(otp)) {
      Alert.alert(
        "Invalid Code",
        "Your verification code must contain exactly 6 digits.",
      );

      return;
    }

    verifyLock.current = true;
    setIsVerifying(true);

    try {
      console.log("Calling verifyOTP...");

      await verifyOTP(email, otp);

      console.log("OTP verification successful.");

      console.log("Getting Firebase user role...");

      const role = await getUserRole();

      console.log("Firebase user role:", role);

      // Clear temporary OTP login email
      clearLoginEmail();

      console.log("OTP session cleared.");

      // ======================================
      // IMPORTANT:
      // Navigate immediately.
      // Do NOT wait for Alert.alert()
      // on Web.
      // ======================================

      if (role === "super_admin") {
        console.log("Navigating to Super Admin...");

        router.replace("/super-admin");
      } else {
        console.log("Navigating to Dashboard...");

        router.replace("/dashboard");
      }

      // Reset state
      verifyLock.current = false;
      setIsVerifying(false);
    } catch (error: any) {
      console.error("=================================");

      console.error("OTP VERIFICATION ERROR");

      console.error(error);

      console.error("=================================");

      // IMPORTANT:
      // Unlock the button when verification fails.
      verifyLock.current = false;
      setIsVerifying(false);

      Alert.alert(
        "Verification Failed",
        error?.message || "The verification code is incorrect or has expired.",
      );
    }
  };

  // ==========================================
  // RESEND OTP
  // ==========================================

  const handleResend = async () => {
    console.log("=================================");

    console.log("RESEND BUTTON CLICKED");

    console.log("Email:", email);

    console.log("Platform:", Platform.OS);

    console.log("=================================");

    if (resendLock.current) {
      console.log("Resend already running.");

      return;
    }

    if (verifyLock.current) {
      console.log("Resend blocked because verification is running.");

      return;
    }

    if (resendCountdown > 0) {
      console.log(`Resend blocked. ${resendCountdown}s remaining.`);

      return;
    }

    if (!email) {
      Alert.alert("Session Expired", "Please login again.", [
        {
          text: "OK",
          onPress: () => {
            router.replace("/login");
          },
        },
      ]);

      return;
    }

    resendLock.current = true;
    setIsResending(true);

    try {
      console.log("Calling sendOTP...");

      await sendOTP(email);

      console.log("NEW OTP SENT SUCCESSFULLY");

      // Clear old code
      setOtp("");

      // Start cooldown
      setResendCountdown(30);

      Alert.alert(
        "New Code Sent",
        "A new verification code has been sent to your email.",
      );
    } catch (error: any) {
      console.error("RESEND OTP ERROR:", error);

      Alert.alert(
        "Resend Failed",
        error?.message || "We could not send a new verification code.",
      );
    } finally {
      resendLock.current = false;
      setIsResending(false);

      console.log("Resend finished.");
    }
  };

  // ==========================================
  // BUSY
  // ==========================================

  const isBusy = isVerifying || isResending;

  // ==========================================
  // UI
  // ==========================================

  return (
    <KeyboardAvoidingView
      style={styles.page}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* Green background */}

      <View style={styles.topGreen} />

      <View style={[styles.content, isLargeScreen && styles.webContent]}>
        {/* Card */}

        <View style={[styles.card, isLargeScreen && styles.webCard]}>
          {/* Logo */}

          <View style={styles.logoContainer}>
            <Image
              source={require("../../assets/images/siya-logo.png")}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          {/* Security badge */}

          <View style={styles.securityBadge}>
            <View style={styles.securityDot} />

            <Text style={styles.securityText}>SECURE LOGIN</Text>
          </View>

          {/* Title */}

          <Text style={styles.title}>Verify Your Login</Text>

          {/* Description */}

          <Text style={styles.description}>
            We've sent a 6-digit verification code to your email address.
          </Text>

          {/* Email */}

          <View style={styles.emailBox}>
            <Text style={styles.emailLabel}>Verification email</Text>

            <Text style={styles.email} numberOfLines={1}>
              {email}
            </Text>
          </View>

          {/* OTP label */}

          <Text style={styles.inputLabel}>Verification Code</Text>

          {/* OTP input */}

          <TextInput
            value={otp}
            onChangeText={(value) => {
              const numbersOnly = value.replace(/[^0-9]/g, "");

              setOtp(numbersOnly.slice(0, 6));
            }}
            placeholder="000000"
            placeholderTextColor="#C4C9D0"
            keyboardType="number-pad"
            maxLength={6}
            editable={!isBusy}
            autoFocus={!isWeb}
            autoComplete="one-time-code"
            textContentType="oneTimeCode"
            style={[styles.otpInput, isBusy && styles.otpInputDisabled]}
          />

          {/* Helper */}

          <Text style={styles.helperText}>
            Enter the 6-digit code from your Siya-Fund email.
          </Text>

          {/* Verify */}

          <Pressable
            onPress={handleVerify}
            disabled={isBusy}
            style={({ pressed }) => [
              styles.verifyButton,

              pressed && !isBusy && styles.buttonPressed,

              isBusy && styles.buttonDisabled,
            ]}
          >
            <Text style={styles.verifyButtonText}>
              {isVerifying ? "VERIFYING..." : "VERIFY & CONTINUE"}
            </Text>
          </Pressable>

          {/* Resend */}

          <Pressable
            onPress={() => {
              console.log("RESEND PRESSABLE PRESSED");

              handleResend();
            }}
            disabled={isBusy || resendCountdown > 0}
            style={({ pressed }) => [
              styles.resendButton,

              pressed &&
                !isBusy &&
                resendCountdown === 0 &&
                styles.resendPressed,

              (isBusy || resendCountdown > 0) && styles.resendButtonDisabled,
            ]}
          >
            <Text
              style={[
                styles.resendText,

                (isBusy || resendCountdown > 0) && styles.resendDisabled,
              ]}
            >
              {isResending
                ? "SENDING NEW CODE..."
                : resendCountdown > 0
                  ? `RESEND AVAILABLE IN ${resendCountdown}s`
                  : "Didn't receive the code? Resend"}
            </Text>
          </Pressable>

          {/* Security info */}

          <View style={styles.securityInfo}>
            <Text style={styles.lockIcon}>🔒</Text>

            <Text style={styles.securityInfoText}>
              Your verification code expires after 5 minutes.
            </Text>
          </View>
        </View>

        {/* Footer */}

        <Text style={[styles.footer, isLargeScreen && styles.webFooter]}>
          © {new Date().getFullYear()} Siya-Fund
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

// ==========================================
// STYLES
// ==========================================

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: PAGE_BACKGROUND,
  },

  topGreen: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 180,
    backgroundColor: GREEN,
  },

  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 30,
  },

  webContent: {
    maxWidth: 1200,
    width: "100%",
    alignSelf: "center",
  },

  card: {
    width: "100%",
    maxWidth: 500,
    backgroundColor: WHITE,
    borderRadius: 24,
    paddingHorizontal: 28,
    paddingVertical: 30,

    shadowColor: "#000000",

    shadowOffset: {
      width: 0,
      height: 8,
    },

    shadowOpacity: 0.12,
    shadowRadius: 20,

    elevation: 8,
  },

  webCard: {
    maxWidth: 460,
    paddingHorizontal: 40,
    paddingVertical: 36,
  },

  logoContainer: {
    alignItems: "center",
    marginBottom: 12,
  },

  logo: {
    width: 130,
    height: 70,
  },

  securityBadge: {
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0FDF4",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 30,
    marginBottom: 16,
  },

  securityDot: {
    width: 7,
    height: 7,
    borderRadius: 10,
    backgroundColor: GREEN,
    marginRight: 7,
  },

  securityText: {
    fontSize: 11,
    fontWeight: "800",
    color: GREEN,
    letterSpacing: 1,
  },

  title: {
    fontSize: 29,
    fontWeight: "800",
    color: BLACK,
    textAlign: "center",
    marginBottom: 10,
  },

  description: {
    fontSize: 15,
    lineHeight: 22,
    color: GREY,
    textAlign: "center",
    marginBottom: 22,
  },

  emailBox: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 22,
  },

  emailLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: GREY,
    textTransform: "uppercase",
    letterSpacing: 0.7,
    marginBottom: 4,
  },

  email: {
    fontSize: 15,
    fontWeight: "600",
    color: BLACK,
  },

  inputLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: BLACK,
    marginBottom: 8,
  },

  otpInput: {
    width: "100%",
    height: 64,

    borderWidth: 2,
    borderColor: GREEN,

    borderRadius: 15,

    backgroundColor: WHITE,

    fontSize: 27,
    fontWeight: "800",

    letterSpacing: 10,

    color: BLACK,

    textAlign: "center",

    paddingHorizontal: 16,

    ...Platform.select({
      web: {
        outlineStyle: "none",
      },
    }),
  },

  otpInputDisabled: {
    backgroundColor: LIGHT_GREY,
    borderColor: "#D1D5DB",
  },

  helperText: {
    fontSize: 12,
    color: GREY,
    textAlign: "center",
    marginTop: 9,
    marginBottom: 20,
  },

  verifyButton: {
    width: "100%",
    height: 54,

    backgroundColor: GREEN,

    borderRadius: 14,

    alignItems: "center",
    justifyContent: "center",

    shadowColor: GREEN,

    shadowOffset: {
      width: 0,
      height: 4,
    },

    shadowOpacity: 0.18,
    shadowRadius: 8,

    elevation: 4,
  },

  buttonPressed: {
    backgroundColor: DARK_GREEN,

    transform: [
      {
        scale: 0.98,
      },
    ],
  },

  buttonDisabled: {
    backgroundColor: "#9CA3AF",
    shadowOpacity: 0,
    elevation: 0,
  },

  verifyButtonText: {
    color: WHITE,
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: 0.5,
  },

  resendButton: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 10,
    borderRadius: 10,
  },

  resendButtonDisabled: {
    opacity: 0.7,
  },

  resendPressed: {
    opacity: 0.6,
  },

  resendText: {
    color: GREEN,
    fontSize: 14,
    fontWeight: "700",
    textAlign: "center",
  },

  resendDisabled: {
    color: "#9CA3AF",
  },

  securityInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    backgroundColor: "#F8FAFC",

    borderRadius: 12,

    paddingHorizontal: 14,
    paddingVertical: 11,

    marginTop: 4,
  },

  lockIcon: {
    fontSize: 15,
    marginRight: 8,
  },

  securityInfoText: {
    flex: 1,

    fontSize: 11,
    lineHeight: 16,

    color: GREY,

    textAlign: "center",
  },

  footer: {
    marginTop: 18,
    fontSize: 11,
    color: "#6B7280",
    textAlign: "center",
  },

  webFooter: {
    marginTop: 20,
  },
});
