import express from "express";
import {
  sendOTP,
  verifyOTPCode
} from "../controllers/otpController";

const router = express.Router();

router.post("/send", sendOTP);
router.post("/verify", verifyOTPCode);

export default router;