import { Platform } from "react-native";

/*
  Siya-Fund Backend URLs

  Android Emulator:
  10.0.2.2 points to the computer running the emulator.

  Web:
  localhost points to the same computer running the browser.

  iOS Simulator:
  localhost also points to the computer running the simulator.
*/

const API_URL =
  Platform.OS === "android" ? "http://10.0.2.2:5000" : "http://localhost:5000";

// ==========================================
// SEND OTP
// ==========================================

export const sendOTP = async (email: string): Promise<void> => {
  try {
    console.log("Sending OTP to:", email);

    console.log("OTP API URL:", `${API_URL}/api/otp/send`);

    const response = await fetch(`${API_URL}/api/otp/send`, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        email: email.trim().toLowerCase(),
      }),
    });

    const data = await response.json();

    console.log("Send OTP response:", data);

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Failed to send OTP");
    }
  } catch (error) {
    console.error("Send OTP error:", error);

    throw error;
  }
};

// ==========================================
// VERIFY OTP
// ==========================================

export const verifyOTP = async (email: string, otp: string): Promise<void> => {
  try {
    console.log("Verifying OTP for:", email);

    console.log("OTP API URL:", `${API_URL}/api/otp/verify`);

    const response = await fetch(`${API_URL}/api/otp/verify`, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        email: email.trim().toLowerCase(),
        otp: otp.trim(),
      }),
    });

    const data = await response.json();

    console.log("Verify OTP response:", data);

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Invalid or expired OTP");
    }
  } catch (error) {
    console.error("Verify OTP error:", error);

    throw error;
  }
};
