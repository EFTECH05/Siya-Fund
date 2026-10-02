import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  // ==========================================
  // MAIN CONTAINER
  // ==========================================

  container: {
    flex: 1,
    backgroundColor: "#F4F8F5",
  },

  // ==========================================
  // SCROLL CONTENT
  // ==========================================

  scrollContent: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 35,
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
  // LOGO
  // ==========================================

  logoContainer: {
    width: 105,
    height: 105,
    borderRadius: 52.5,

    backgroundColor: "#F3F8F4",

    alignItems: "center",
    justifyContent: "center",

    alignSelf: "center",

    marginBottom: 22,
  },

  logo: {
    width: 82,
    height: 82,
  },

  // ==========================================
  // TITLE
  // ==========================================

  title: {
    color: "#17231B",
    fontSize: 30,
    fontWeight: "700",

    textAlign: "center",

    marginBottom: 10,
  },

  // ==========================================
  // DESCRIPTION
  // ==========================================

  description: {
    color: "#6B756F",
    fontSize: 15,
    lineHeight: 23,

    textAlign: "center",

    marginBottom: 30,
  },

  // ==========================================
  // INPUT GROUP
  // ==========================================

  inputGroup: {
    width: "100%",
    marginBottom: 18,
  },

  // ==========================================
  // LABEL
  // ==========================================

  label: {
    color: "#27332C",
    fontSize: 14,
    fontWeight: "600",

    marginBottom: 8,
  },

  // ==========================================
  // INPUT
  // ==========================================

  input: {
    width: "100%",
    height: 54,

    backgroundColor: "#F8FAF9",

    borderWidth: 1,
    borderColor: "#DCE5DF",

    borderRadius: 12,

    paddingHorizontal: 16,

    color: "#17231B",
    fontSize: 15,
  },

  // ==========================================
  // REGISTER BUTTON
  // ==========================================

  registerButton: {
    width: "100%",
    height: 56,

    backgroundColor: "#2E8B57",

    borderRadius: 13,

    alignItems: "center",
    justifyContent: "center",

    marginTop: 5,

    shadowColor: "#2E8B57",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.18,
    shadowRadius: 8,

    elevation: 3,
  },

  // ==========================================
  // REGISTER BUTTON TEXT
  // ==========================================

  registerButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0.8,
  },

  // ==========================================
  // BUTTON DISABLED
  // ==========================================

  buttonDisabled: {
    opacity: 0.7,
  },

  // ==========================================
  // BUTTON PRESSED
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
  // LOGIN CONTAINER
  // ==========================================

  loginContainer: {
    flexDirection: "row",

    alignItems: "center",
    justifyContent: "center",

    marginTop: 28,

    gap: 5,
  },

  // ==========================================
  // LOGIN TEXT
  // ==========================================

  loginText: {
    color: "#7A837D",
    fontSize: 14,
  },

  // ==========================================
  // LOGIN LINK
  // ==========================================

  loginLink: {
    color: "#2E8B57",
    fontSize: 14,
    fontWeight: "700",
  },

  // ==========================================
  // FOOTER
  // ==========================================

  footerText: {
    marginTop: 24,

    color: "#9AA39D",

    fontSize: 11,

    textAlign: "center",
  },

  // ==========================================
  // MODAL OVERLAY
  // ==========================================

  modalOverlay: {
    flex: 1,

    backgroundColor: "rgba(15, 30, 20, 0.55)",

    alignItems: "center",
    justifyContent: "center",

    paddingHorizontal: 24,
  },

  // ==========================================
  // ERROR MODAL
  // ==========================================

  errorModal: {
    width: "100%",
    maxWidth: 420,

    backgroundColor: "#FFFFFF",

    borderRadius: 26,

    paddingHorizontal: 28,
    paddingVertical: 30,

    alignItems: "center",

    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.18,
    shadowRadius: 25,

    elevation: 12,
  },

  // ==========================================
  // ERROR ICON CONTAINER
  // ==========================================

  errorIconContainer: {
    width: 68,
    height: 68,

    borderRadius: 34,

    backgroundColor: "#EAF6EE",

    alignItems: "center",
    justifyContent: "center",

    marginBottom: 18,
  },

  // ==========================================
  // ERROR ICON
  // ==========================================

  errorIcon: {
    width: 34,
    height: 34,

    borderRadius: 17,

    backgroundColor: "#2E8B57",

    color: "#FFFFFF",

    fontSize: 23,
    fontWeight: "800",

    textAlign: "center",

    lineHeight: 34,
  },

  // ==========================================
  // ERROR MODAL TITLE
  // ==========================================

  errorModalTitle: {
    color: "#17231B",

    fontSize: 22,
    fontWeight: "700",

    textAlign: "center",

    marginBottom: 10,
  },

  // ==========================================
  // ERROR MODAL MESSAGE
  // ==========================================

  errorModalMessage: {
    color: "#6B756F",

    fontSize: 15,
    lineHeight: 23,

    textAlign: "center",

    maxWidth: 340,

    marginBottom: 24,
  },

  // ==========================================
  // MODAL BUTTON CONTAINER
  // ==========================================

  modalButtonContainer: {
    width: "100%",

    gap: 10,
  },

  // ==========================================
  // MODAL PRIMARY BUTTON
  // ==========================================

  modalPrimaryButton: {
    width: "100%",
    height: 52,

    backgroundColor: "#2E8B57",

    borderRadius: 13,

    alignItems: "center",
    justifyContent: "center",

    shadowColor: "#2E8B57",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.16,
    shadowRadius: 7,

    elevation: 3,
  },

  // ==========================================
  // MODAL PRIMARY BUTTON TEXT
  // ==========================================

  modalPrimaryButtonText: {
    color: "#FFFFFF",

    fontSize: 15,
    fontWeight: "700",

    letterSpacing: 0.8,
  },

  // ==========================================
  // MODAL SECONDARY BUTTON
  // ==========================================

  modalSecondaryButton: {
    width: "100%",
    height: 52,

    backgroundColor: "#F4F8F5",

    borderWidth: 1,
    borderColor: "#DCE5DF",

    borderRadius: 13,

    alignItems: "center",
    justifyContent: "center",
  },

  // ==========================================
  // MODAL SECONDARY BUTTON TEXT
  // ==========================================

  modalSecondaryButtonText: {
    color: "#536159",

    fontSize: 15,
    fontWeight: "700",

    letterSpacing: 0.8,
  },

  // ==========================================
  // MODAL BUTTON PRESSED
  // ==========================================

  modalButtonPressed: {
    opacity: 0.75,

    transform: [
      {
        scale: 0.98,
      },
    ],
  },
});
