
const API_URL =
  "https://viscosity-resident-strategy.ngrok-free.dev";

// ==========================================
// SEND OTP
// ==========================================

export const sendOTP = async (email: string): Promise<void> => {
  try {
    console.log("Sending OTP to:", email);

    const url = `${API_URL}/api/otp/send`;
    console.log("OTP API URL:", url);

    const response = await fetch(url, {
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

export const verifyOTP = async (
  email: string,
  otp: string
): Promise<void> => {
  try {
    console.log("Verifying OTP for:", email);

    const url = `${API_URL}/api/otp/verify`;
    console.log("OTP API URL:", url);

    const response = await fetch(url, {
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
