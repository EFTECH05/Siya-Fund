const API_URL = "http://10.0.2.2:5000";

export const sendOTP = async (
  email: string
): Promise<void> => {
  const response = await fetch(
    `${API_URL}/api/otp/send`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(
      data.message || "Failed to send OTP"
    );
  }
};

export const verifyOTP = async (
  email: string,
  otp: string
): Promise<void> => {
  const response = await fetch(
    `${API_URL}/api/otp/verify`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        otp,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(
      data.message || "Invalid or expired OTP"
    );
  }
};