// React Native StyleSheet
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  // ==========================================
  // MAIN SCREEN
  // ==========================================
  container: {
    flex: 1,

    // Soft background
    backgroundColor: "#F4F8F5",

    // Center the card horizontally
    alignItems: "center",

    // Center the card vertically
    justifyContent: "center",

    // Space around the screen
    paddingHorizontal: 20,
  },

  // ==========================================
  // MAIN CONTENT CARD
  // ==========================================
  content: {
    width: "100%",

    // Prevent the card from becoming too wide
    // on desktop screens
    maxWidth: 480,

    // White card
    backgroundColor: "#FFFFFF",

    // Rounded corners
    borderRadius: 24,

    // Space inside the card
    paddingHorizontal: 30,
    paddingVertical: 40,

    // Center everything inside the card
    alignItems: "center",

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
  },

  // ==========================================
  // LOGO CONTAINER
  // ==========================================
  logoContainer: {
    width: 115,
    height: 115,

    // Make the container circular
    borderRadius: 57.5,

    // Very light green background
    backgroundColor: "#F3F8F4",

    // Center logo
    alignItems: "center",
    justifyContent: "center",

    // Space below logo
    marginBottom: 25,
  },

  // ==========================================
  // LOGO
  // ==========================================
  logo: {
    width: 90,
    height: 90,
  },

  // ==========================================
  // TEXT CONTAINER
  // ==========================================
  textContainer: {
    width: "100%",

    // Center text
    alignItems: "center",

    // Space below description
    marginBottom: 35,
  },

  // ==========================================
  // TITLE
  // ==========================================
  title: {
    color: "#17231B",

    // Large heading
    fontSize: 32,

    // Bold heading
    fontWeight: "700",

    // Center heading
    textAlign: "center",

    // Space below heading
    marginBottom: 14,
  },

  // ==========================================
  // DESCRIPTION
  // ==========================================
  description: {
    width: "100%",

    // Prevent the description from becoming
    // too wide on desktop
    maxWidth: 390,

    color: "#6B756F",

    fontSize: 16,

    // Space between lines
    lineHeight: 25,

    // Center description
    textAlign: "center",
  },

  // ==========================================
  // BUTTON CONTAINER
  // ==========================================
  buttonContainer: {
    width: "100%",

    // Space between buttons
    gap: 14,
  },

  // ==========================================
  // LOGIN BUTTON
  // ==========================================
  loginButton: {
    width: "100%",

    height: 56,

    // Siya-Fund green
    backgroundColor: "#2E8B57",

    // Rounded corners
    borderRadius: 13,

    // Center text
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

  // ==========================================
  // LOGIN BUTTON TEXT
  // ==========================================
  loginButtonText: {
    color: "#FFFFFF",

    fontSize: 16,

    fontWeight: "700",

    // Space between letters
    letterSpacing: 1,
  },

  // ==========================================
  // SIGN UP BUTTON
  // ==========================================
  signUpButton: {
    width: "100%",

    height: 56,

    // White background
    backgroundColor: "#FFFFFF",

    // Green border
    borderWidth: 2,
    borderColor: "#2E8B57",

    // Rounded corners
    borderRadius: 13,

    // Center text
    alignItems: "center",
    justifyContent: "center",
  },

  // ==========================================
  // SIGN UP BUTTON TEXT
  // ==========================================
  signUpButtonText: {
    color: "#2E8B57",

    fontSize: 16,

    fontWeight: "700",

    letterSpacing: 1,
  },

  // ==========================================
  // BUTTON PRESSED EFFECT
  // ==========================================
  buttonPressed: {
    // Slight transparency
    opacity: 0.75,

    // Slightly shrink the button
    transform: [
      {
        scale: 0.98,
      },
    ],
  },

  // ==========================================
  // FOOTER
  // ==========================================
  footerText: {
    // Space above footer
    marginTop: 30,

    // Soft grey
    color: "#9AA39D",

    fontSize: 12,

    // Center footer
    textAlign: "center",
  },
});
