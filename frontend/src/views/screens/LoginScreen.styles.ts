
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F4FAF6",
  },

  scrollContent: {
    flexGrow: 1,
  },

  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 22,
    alignItems: "center",
  },

  // Brand header
  brandHeader: {
    alignItems: "center",
    marginBottom: 25,
  },

  logoContainer: {
    width: 86,
    height: 86,
    borderRadius: 28,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E0EFE5",
    shadowColor: "#174E32",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },

  logo: {
    width: 67,
    height: 67,
  },

  brandName: {
    fontSize: 29,
    fontWeight: "800",
    color: "#145B35",
    letterSpacing: -0.8,
  },

  brandTagline: {
    marginTop: 5,
    fontSize: 12,
    color: "#718579",
    letterSpacing: 0.2,
    textAlign: "center",
  },

  // Welcome card
  welcomeCard: {
    width: "100%",
    maxWidth: 440,
    backgroundColor: "#FFFFFF",
    borderRadius: 30,
    paddingHorizontal: 22,
    paddingTop: 26,
    paddingBottom: 24,
    borderWidth: 1,
    borderColor: "#E7F0E9",
    shadowColor: "#174E32",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.07,
    shadowRadius: 20,
    elevation: 5,
  },

  // Hero illustration
  heroCircle: {
    width: 122,
    height: 122,
    borderRadius: 61,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },

  heroInnerCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#D8F0E0",
  },

  heroCoin: {
    position: "absolute",
    right: -4,
    bottom: -2,
    width: 37,
    height: 37,
    borderRadius: 19,
    backgroundColor: "#16834A",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "#FFFFFF",
  },

  // Welcome text
  welcomeTitle: {
    fontSize: 27,
    fontWeight: "800",
    color: "#163D28",
    textAlign: "center",
    letterSpacing: -0.7,
  },

  welcomeDescription: {
    fontSize: 14,
    lineHeight: 22,
    color: "#728078",
    textAlign: "center",
    marginTop: 10,
    marginBottom: 22,
    paddingHorizontal: 3,
  },

  // Feature list
  features: {
    backgroundColor: "#F7FBF8",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 4,
    marginBottom: 22,
    borderWidth: 1,
    borderColor: "#ECF4EE",
  },

  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 13,
  },

  featureIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: "#E6F5EA",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  featureTextContainer: {
    flex: 1,
    paddingRight: 6,
  },

  featureTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#214D34",
  },

  featureDescription: {
    fontSize: 11,
    color: "#819087",
    marginTop: 4,
    lineHeight: 16,
  },

  featureDivider: {
    height: 1,
    backgroundColor: "#E8F0EA",
    marginLeft: 54,
  },

  // Login button
  loginButton: {
    height: 54,
    borderRadius: 16,
    backgroundColor: "#16834A",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    shadowColor: "#16834A",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.18,
    shadowRadius: 9,
    elevation: 3,
  },

  loginButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 1,
    marginRight: 10,
  },

  // Registration button
  signupButton: {
    height: 53,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: "#16834A",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
  },

  signupButtonText: {
    color: "#16834A",
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 0.7,
  },

  buttonPressed: {
    opacity: 0.78,
    transform: [{ scale: 0.99 }],
  },

  // Footer
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 22,
    paddingHorizontal: 4,
  },

  footerIcon: {
    width: 23,
    height: 23,
    borderRadius: 12,
    backgroundColor: "#E4F4E9",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 7,
  },

  footerText: {
    fontSize: 10,
    color: "#75887B",
    textAlign: "center",
  },
});

export default styles;

