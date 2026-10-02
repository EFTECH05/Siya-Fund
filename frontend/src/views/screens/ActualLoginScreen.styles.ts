// StyleSheet is used to keep the screen design separate
// from the Login screen component.
import { StyleSheet } from "react-native";

// Siya-Fund Login screen styles
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
  // LOGIN CARD
  // ==========================================

  card: {
    width: "100%",
    maxWidth: 460,
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    paddingHorizontal: 30,
    paddingVertical: 36,

    // iOS shadow
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.08,
    shadowRadius: 20,

    // Android shadow
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
  // INPUT LABEL
  // ==========================================

  label: {
    color: "#27332C",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },

  // ==========================================
  // TEXT INPUT
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
  // FORGOT PASSWORD
  // ==========================================

  forgotButton: {
    alignSelf: "flex-end",
    marginTop: -3,
    marginBottom: 24,
  },

  forgotText: {
    color: "#2E8B57",
    fontSize: 14,
    fontWeight: "600",
  },

  // ==========================================
  // LOGIN BUTTON
  // ==========================================

  loginButton: {
    width: "100%",
    height: 56,
    backgroundColor: "#2E8B57",
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",

    // iOS shadow
    shadowColor: "#2E8B57",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.18,
    shadowRadius: 8,

    // Android shadow
    elevation: 3,
  },

  // Login button while loading
  buttonLoading: {
    opacity: 0.75,
  },

  // ==========================================
  // BUTTON PRESS EFFECT
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
  // LOGIN BUTTON TEXT
  // ==========================================

  loginButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 1,
  },

  // ==========================================
  // SIGN UP CONTAINER
  // ==========================================

  signUpContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 28,
    gap: 5,
  },

  // ==========================================
  // SIGN UP TEXT
  // ==========================================

  signUpText: {
    color: "#7A837D",
    fontSize: 14,
  },

  // ==========================================
  // SIGN UP LINK
  // ==========================================

  signUpLink: {
    color: "#2E8B57",
    fontSize: 14,
    fontWeight: "700",
  },
});
