
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
  // SCROLL CONTENT
  // ==========================================

  scrollContent: {
    flexGrow: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
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
    marginBottom: 6,
  },

  // ==========================================
  // EMAIL
  // ==========================================

  emailText: {
    color: "#2E8B57",
    fontSize: 15,
    fontWeight: "700",
    textAlign: "center",
    marginTop: 5,
    marginBottom: 25,
    maxWidth: "100%",
  },

  // ==========================================
  // LABEL
  // ==========================================

  label: {
    width: "100%",
    color: "#17231B",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 10,
    textAlign: "left",
  },

  // ==========================================
  // OTP INPUT
  // ==========================================

  otpInput: {
    width: "100%",
    height: 64,

    backgroundColor: "#F8FAF9",

    borderWidth: 1.5,
    borderColor: "#DCE5DF",

    borderRadius: 13,

    color: "#17231B",

    fontSize: 28,
    fontWeight: "700",

    letterSpacing: 10,

    textAlign: "center",

    paddingHorizontal: 20,

    marginBottom: 12,
  },

  // ==========================================
  // HELPER TEXT
  // ==========================================

  helperText: {
    color: "#8A948E",
    fontSize: 13,
    textAlign: "center",
    marginBottom: 20,
  },

  // ==========================================
  // ERROR MESSAGE
  // ==========================================

  errorText: {
    width: "100%",
    color: "#C0392B",
    backgroundColor: "#FDECEC",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 13,
    lineHeight: 19,
    textAlign: "center",
    marginBottom: 15,
  },

  // ==========================================
  // SUCCESS MESSAGE
  // ==========================================

  successText: {
    width: "100%",
    color: "#287A4B",
    backgroundColor: "#EAF6EE",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 13,
    lineHeight: 19,
    textAlign: "center",
    marginBottom: 15,
  },

  // ==========================================
  // VERIFY BUTTON
  // ==========================================

  verifyButton: {
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

    marginBottom: 16,
  },

  // ==========================================
  // VERIFY BUTTON TEXT
  // ==========================================

  verifyButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 0.8,
    textAlign: "center",
  },

  // ==========================================
  // RESEND CONTAINER
  // ==========================================

  resendContainer: {
    width: "100%",

    flexDirection: "row",

    alignItems: "center",
    justifyContent: "center",

    marginTop: 5,
    marginBottom: 18,
  },

  // ==========================================
  // RESEND TEXT
  // ==========================================

  resendText: {
    color: "#6B756F",
    fontSize: 13,
    marginRight: 5,
  },

  // ==========================================
  // RESEND LINK
  // ==========================================

  resendLink: {
    color: "#2E8B57",
    fontSize: 13,
    fontWeight: "700",
  },

  // ==========================================
  // BACK TO REGISTER
  // ==========================================

  backToRegister: {
    color: "#6B756F",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
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

