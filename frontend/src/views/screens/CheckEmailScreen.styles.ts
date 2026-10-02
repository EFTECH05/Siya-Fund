import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  // ==========================================
  // MAIN CONTAINER
  // ==========================================

  container: {
    flex: 1,

    backgroundColor: "#F4F8F5",

    alignItems: "center",
    justifyContent: "center",

    paddingHorizontal: 20,
    paddingVertical: 30,
  },

  // ==========================================
  // CARD
  // ==========================================

  card: {
    width: "100%",
    maxWidth: 460,

    backgroundColor: "#FFFFFF",

    borderRadius: 24,

    paddingHorizontal: 30,
    paddingVertical: 36,

    alignItems: "center",

    shadowColor: "#000000",

    shadowOffset: {
      width: 0,
      height: 8,
    },

    shadowOpacity: 0.08,

    shadowRadius: 20,

    elevation: 5,
  },

  // ==========================================
  // LOGO CONTAINER
  // ==========================================

  logoContainer: {
    width: 92,
    height: 92,

    borderRadius: 46,

    backgroundColor: "#F3F8F4",

    alignItems: "center",
    justifyContent: "center",

    marginBottom: 18,
  },

  // ==========================================
  // LOGO
  // ==========================================

  logo: {
    width: 72,
    height: 72,
  },

  // ==========================================
  // EMAIL ICON CONTAINER
  // ==========================================

  emailIconContainer: {
    width: 64,
    height: 64,

    borderRadius: 32,

    backgroundColor: "#EAF6EE",

    alignItems: "center",
    justifyContent: "center",

    marginBottom: 18,
  },

  // ==========================================
  // EMAIL ICON
  // ==========================================

  emailIcon: {
    color: "#2E8B57",

    fontSize: 27,

    fontWeight: "800",
  },

  // ==========================================
  // TITLE
  // ==========================================

  title: {
    color: "#17231B",

    fontSize: 29,

    fontWeight: "700",

    textAlign: "center",

    marginBottom: 12,
  },

  // ==========================================
  // DESCRIPTION
  // ==========================================

  description: {
    color: "#6B756F",

    fontSize: 15,

    lineHeight: 22,

    textAlign: "center",
  },

  // ==========================================
  // EMAIL
  // ==========================================

  email: {
    color: "#2E8B57",

    fontSize: 15,

    fontWeight: "700",

    textAlign: "center",

    marginTop: 5,

    marginBottom: 15,

    maxWidth: "100%",
  },

  // ==========================================
  // INSTRUCTIONS
  // ==========================================

  instructions: {
    color: "#6B756F",

    fontSize: 14,

    lineHeight: 22,

    textAlign: "center",

    maxWidth: 360,

    marginBottom: 28,
  },

  // ==========================================
  // PRIMARY BUTTON
  // ==========================================

  primaryButton: {
    width: "100%",

    height: 54,

    backgroundColor: "#2E8B57",

    borderRadius: 13,

    alignItems: "center",
    justifyContent: "center",

    shadowColor: "#2E8B57",

    shadowOffset: {
      width: 0,
      height: 5,
    },

    shadowOpacity: 0.18,

    shadowRadius: 8,

    elevation: 3,

    marginBottom: 12,
  },

  // ==========================================
  // PRIMARY BUTTON TEXT
  // ==========================================

  primaryButtonText: {
    color: "#FFFFFF",

    fontSize: 14,

    fontWeight: "700",

    letterSpacing: 0.8,

    textAlign: "center",
  },

  // ==========================================
  // RESEND BUTTON
  // ==========================================

  resendButton: {
    width: "100%",

    height: 54,

    backgroundColor: "#F4F8F5",

    borderWidth: 1,

    borderColor: "#DCE5DF",

    borderRadius: 13,

    alignItems: "center",
    justifyContent: "center",

    marginBottom: 10,
  },

  // ==========================================
  // RESEND BUTTON TEXT
  // ==========================================

  resendButtonText: {
    color: "#2E8B57",

    fontSize: 13,

    fontWeight: "700",

    letterSpacing: 0.6,

    textAlign: "center",
  },

  // ==========================================
  // BACK BUTTON
  // ==========================================

  backButton: {
    paddingVertical: 10,

    paddingHorizontal: 16,
  },

  // ==========================================
  // BACK BUTTON TEXT
  // ==========================================

  backButtonText: {
    color: "#6B756F",

    fontSize: 14,

    fontWeight: "600",

    textAlign: "center",
  },

  // ==========================================
  // PRESSED BUTTON
  // ==========================================

  buttonPressed: {
    opacity: 0.75,

    transform: [
      {
        scale: 0.98,
      },
    ],
  },

  // ==========================================
  // DISABLED BUTTON
  // ==========================================

  buttonDisabled: {
    opacity: 0.7,
  },

  // ==========================================
  // FOOTER
  // ==========================================

  footerText: {
    marginTop: 20,

    color: "#9AA39D",

    fontSize: 11,

    textAlign: "center",
  },
});
