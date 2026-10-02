// React Native StyleSheet is used to keep
// all Registration screen styles in one file
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  // ==========================================
  // MAIN SCREEN
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
  // REGISTRATION CARD
  // ==========================================
  card: {
    width: "100%",
    maxWidth: 500,
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    paddingHorizontal: 30,
    paddingVertical: 36,

    // Shadow for iPhone and Web
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
  // LOGO CONTAINER
  // ==========================================
  logoContainer: {
    width: 95,
    height: 95,
    borderRadius: 47.5,
    backgroundColor: "#F3F8F4",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: 20,
  },

  // ==========================================
  // LOGO
  // ==========================================
  logo: {
    width: 75,
    height: 75,
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
    marginBottom: 28,
  },

  // ==========================================
  // INPUT GROUP
  // ==========================================
  inputGroup: {
    width: "100%",
    marginBottom: 16,
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
  // INPUT FIELD
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
  // CREATE ACCOUNT BUTTON
  // ==========================================
  registerButton: {
    width: "100%",
    height: 56,
    backgroundColor: "#2E8B57",
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",

    // Button shadow
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

  // ==========================================
  // BUTTON TEXT
  // ==========================================
  registerButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 1,
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
  // LOGIN DESCRIPTION
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
  // BUTTON PRESSED STATE
  // ==========================================
  buttonPressed: {
    opacity: 0.75,
    transform: [
      {
        scale: 0.98,
      },
    ],
  },
});
