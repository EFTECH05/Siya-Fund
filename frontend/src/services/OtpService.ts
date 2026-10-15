import { Platform } from "react-native";

const API_URL = (process.env.EXPO_PUBLIC_API_URL ||
  (Platform.OS === "android" ? "http://10.0.2.2:5000" : "http://localhost:5000")).replace(/\/+$/, "");

export class OtpRequestError extends Error {
  constructor(message: string, public readonly code: string) { super(message); }
}

async function requestOTP(action: "send" | "verify", email: string, otp?: string): Promise<void> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);
  try {
    let response: Response;
    try {
      response = await fetch(`${API_URL}/api/otp/${action}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase(), ...(otp !== undefined ? { otp: otp.trim() } : {}) }),
        signal: controller.signal,
      });
    } catch {
      throw new OtpRequestError("We cannot reach the verification service right now. Please try again shortly.", "OTP_UNREACHABLE");
    }
    let data: { success?: boolean; message?: string; code?: string };
    try { data = await response.json(); }
    catch { throw new OtpRequestError("The verification service returned an unexpected response. Please try again.", "OTP_RESPONSE_INVALID"); }
    if (!response.ok || !data.success) {
      throw new OtpRequestError(data.message || "We could not complete email verification. Please try again.", data.code || "OTP_FAILED");
    }
  } finally { clearTimeout(timeout); }
}

export const sendOTP = (email: string): Promise<void> => requestOTP("send", email);
export const verifyOTP = (email: string, otp: string): Promise<void> => requestOTP("verify", email, otp);
