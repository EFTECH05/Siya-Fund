import { Request, Response } from "express";
import { generateOTP, verifyOTP } from "../services/otpService";
import { sendOTPEmail } from "../services/emailService";

export const sendOTP = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email } = req.body;

    if (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      res.status(400).json({
        success: false,
        message: "A valid email address is required"
      });
      return;
    }

    const cleanEmail = email.trim().toLowerCase();
    const otp = generateOTP(cleanEmail);

    await sendOTPEmail(cleanEmail, otp);

    res.status(200).json({
      success: true,
      message: "OTP sent successfully"
    });
  } catch (error) {
    console.error("Error sending OTP:", error);

    const code = (error as { code?: string }).code;
    const unavailable = code === "OTP_EMAIL_NOT_CONFIGURED" || code === "EAUTH";
    res.status(unavailable ? 503 : 500).json({
      success: false,
      code: unavailable ? "OTP_EMAIL_UNAVAILABLE" : "OTP_SEND_FAILED",
      message: unavailable
        ? "Email verification is temporarily unavailable. Please try again later."
        : "We could not send the verification code. Please try again."
    });
  }
};

export const verifyOTPCode = (
  req: Request,
  res: Response
): void => {
  try {
    const { email, otp } = req.body;

    if (typeof email !== "string" || typeof otp !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) || !/^\d{6}$/.test(otp.trim())) {
      res.status(400).json({
        success: false,
        message: "Email and OTP are required"
      });
      return;
    }

    const isValid = verifyOTP(email.trim().toLowerCase(), otp.trim());

    if (!isValid) {
      res.status(400).json({
        success: false,
        message: "Invalid or expired OTP"
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Email verified successfully"
    });
  } catch (error) {
    console.error("Error verifying OTP:", error);

    res.status(500).json({
      success: false,
      message: "Failed to verify OTP"
    });
  }
};
