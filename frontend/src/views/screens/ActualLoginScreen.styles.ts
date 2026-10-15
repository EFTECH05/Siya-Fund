
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 32,
  },

  card: {
    width: "100%",
    maxWidth: 440,
    alignSelf: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 24,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 4,
  },

  logoContainer: {
    alignItems: "center",
    marginBottom: 20,
  },

  logo: {
    width: 110,
    height: 110,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111827",
    textAlign: "center",
    marginBottom: 8,
  },

  description: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 21,
    marginBottom: 28,
  },

  inputGroup: {
    marginBottom: 18,
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },

  input: {
    width: "100%",
    height: 52,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    paddingHorizontal: 15,
    fontSize: 15,
    color: "#111827",
  },

  forgotButton: {
    alignSelf: "flex-end",
    marginTop: -4,
    marginBottom: 22,
  },

  forgotText: {
    color: "#2563EB",
    fontSize: 13,
    fontWeight: "600",
  },

  loginButton: {
    width: "100%",
    height: 54,
    backgroundColor: "#166534",
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },

  buttonLoading: {
    opacity: 0.65,
  },

  buttonPressed: {
    opacity: 0.8,
  },

  loginButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },

  googleDividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
  },

  googleDividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E5E7EB",
  },

  googleDividerText: {
    color: "#9CA3AF",
    fontSize: 12,
    fontWeight: "600",
    marginHorizontal: 14,
  },

  googleButton: {
    width: "100%",
    height: 56,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },

  googleButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },

  googleButtonText: {
    color: "#1F2937",
    fontSize: 16,
    fontWeight: "600",
  },

  googleButtonLoading: {
    opacity: 0.6,
  },

  signUpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
    marginTop: 26,
  },

  signUpText: {
    color: "#6B7280",
    fontSize: 14,
  },

  signUpLink: {
    color: "#166534",
    fontSize: 14,
    fontWeight: "700",
  },
});

