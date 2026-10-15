import { Request, Response } from "express";
import { generateOTP, verifyOTP } from "../services/otpService";
import { sendOTPEmail } from "../services/emailService";

export const sendOTP = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({
        success: false,
        message: "Email is required"
      });
      return;
    }

    const otp = generateOTP(email);

    await sendOTPEmail(email, otp);

    res.status(200).json({
      success: true,
      message: "OTP sent successfully"
    });
  } catch (error) {
    console.error("Error sending OTP:", error);

    res.status(500).json({
      success: false,
      message: "Failed to send OTP"
    });
  }
};

export const verifyOTPCode = (
  req: Request,
  res: Response
): void => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      res.status(400).json({
        success: false,
        message: "Email and OTP are required"
      });
      return;
    }

    const isValid = verifyOTP(email, otp);

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