
// ==========================================
// SIYA-FUND OTP TESTING SERVER
// ==========================================
//
// Development/testing only.
//
// This server:
// 1. Generates a 6-digit OTP.
// 2. Sends the OTP using Gmail SMTP.
// 3. Stores the OTP temporarily in memory.
// 4. Verifies the OTP.
//
// IMPORTANT:
// Gmail credentials stay on this server.
// NEVER put Gmail credentials inside the Expo
// frontend application.
//
// ==========================================

import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import crypto from "crypto";

// ==========================================
// LOAD ENVIRONMENT VARIABLES
// ==========================================

dotenv.config();

// ==========================================
// EXPRESS APPLICATION
// ==========================================

const app = express();

// Allow requests from the Expo frontend
app.use(
  cors({
    origin: true,
  }),
);

// Allow JSON request bodies
app.use(express.json());

// ==========================================
// SERVER CONFIGURATION
// ==========================================

const PORT = Number(
  process.env.PORT || 3001,
);

// Gmail email address from .env
const GMAIL_EMAIL =
  process.env.GMAIL_EMAIL;

// Gmail App Password from .env
const GMAIL_APP_PASSWORD =
  process.env.GMAIL_APP_PASSWORD;

// ==========================================
// CHECK REQUIRED CONFIGURATION
// ==========================================

if (!GMAIL_EMAIL) {
  console.error(
    "ERROR: GMAIL_EMAIL is missing from .env",
  );

  process.exit(1);
}

if (!GMAIL_APP_PASSWORD) {
  console.error(
    "ERROR: GMAIL_APP_PASSWORD is missing from .env",
  );

  process.exit(1);
}

// ==========================================
// GMAIL SMTP TRANSPORTER
// ==========================================
//
// Nodemailer uses Gmail to send the OTP email.
//

const transporter =
  nodemailer.createTransport({
    service: "gmail",

    auth: {
      user: GMAIL_EMAIL,
      pass: GMAIL_APP_PASSWORD,
    },
  });

// ==========================================
// OTP STORAGE
// ==========================================
//
// For development we store OTP information
// temporarily in memory.
//
// IMPORTANT:
// Restarting the server clears all OTPs.
//

type OtpRecord = {
  otpHash: string;
  expiresAt: number;
  attempts: number;
  lastSentAt: number;
};

const otpStore =
  new Map<string, OtpRecord>();

// ==========================================
// OTP SETTINGS
// ==========================================

// OTP expires after 10 minutes
const OTP_EXPIRY_MS =
  10 * 60 * 1000;

// User must wait 60 seconds before requesting
// another OTP
const RESEND_COOLDOWN_MS =
  60 * 1000;

// Maximum incorrect OTP attempts
const MAX_ATTEMPTS = 5;

// ==========================================
// GENERATE 6-DIGIT OTP
// ==========================================

function generateOtp(): string {

  // Generate a secure random number
  // between 100000 and 999999.

  const number =
    crypto.randomInt(
      100000,
      1000000,
    );

  return String(number);
}

// ==========================================
// HASH OTP
// ==========================================
//
// We don't store the actual OTP in the
// otpStore. We store a SHA-256 hash instead.
//

function hashOtp(
  otp: string,
): string {

  return crypto
    .createHash("sha256")
    .update(otp)
    .digest("hex");
}

// ==========================================
// SEND OTP EMAIL
// ==========================================

async function sendOtpEmail(
  email: string,
  otp: string,
) {

  await transporter.sendMail({

    // Sender shown in the email
    from:
      `"Siya-Fund" <${GMAIL_EMAIL}>`,

    // Recipient
    to: email,

    // Email subject
    subject:
      "Your Siya-Fund verification code",

    // Plain-text version
    text:
      `Your Siya-Fund verification code is ${otp}. This code expires in 10 minutes.`,

    // HTML version
    html: `
      <div style="
        font-family: Arial, sans-serif;
        max-width: 500px;
        margin: 0 auto;
        padding: 30px;
        color: #17231B;
      ">

        <h2 style="
          color: #2E8B57;
          margin-bottom: 20px;
        ">
          Siya-Fund
        </h2>

        <p>
          Welcome to Siya-Fund.
        </p>

        <p>
          Use the verification code below
          to complete your registration:
        </p>

        <div style="
          background: #F4F8F5;
          padding: 20px;
          text-align: center;
          border-radius: 10px;
          margin: 25px 0;
        ">

          <span style="
            font-size: 32px;
            font-weight: bold;
            letter-spacing: 8px;
            color: #2E8B57;
          ">
            ${otp}
          </span>

        </div>

        <p>
          This code expires in
          <strong>10 minutes</strong>.
        </p>

        <p>
          You have a maximum of
          <strong>5 attempts</strong>
          to enter the correct code.
        </p>

        <p>
          If you did not request this code,
          you can safely ignore this email.
        </p>

        <p>
          Siya-Fund Team
        </p>

      </div>
    `,
  });
}

// ==========================================
// TEST ROUTE
// ==========================================
//
// Open:
// http://localhost:3001
//
// This confirms that the server is running.
//

app.get(
  "/",
  (_req, res) => {

    return res.json({

      success: true,

      message:
        "Siya-Fund OTP server is running.",

    });

  },
);

// ==========================================
// REQUEST OTP
// ==========================================
//
// POST /request-otp
//
// Body:
// {
//   "email": "example@gmail.com"
// }
//
// ==========================================

app.post(
  "/request-otp",
  async (req, res) => {

    try {

      // --------------------------------------
      // GET EMAIL
      // --------------------------------------

      const email =
        String(
          req.body?.email || "",
        )
          .trim()
          .toLowerCase();

      // --------------------------------------
      // CHECK EMAIL EXISTS
      // --------------------------------------

      if (!email) {

        return res.status(400).json({

          success: false,

          message:
            "Email address is required.",

        });

      }

      // --------------------------------------
      // VALIDATE EMAIL FORMAT
      // --------------------------------------

      const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(email)) {

        return res.status(400).json({

          success: false,

          message:
            "Please provide a valid email address.",

        });

      }

      // --------------------------------------
      // CHECK RESEND COOLDOWN
      // --------------------------------------

      const existing =
        otpStore.get(email);

      if (
        existing &&
        Date.now() -
          existing.lastSentAt <
          RESEND_COOLDOWN_MS
      ) {

        const secondsLeft =
          Math.ceil(
            (
              RESEND_COOLDOWN_MS -
              (
                Date.now() -
                existing.lastSentAt
              )
            ) / 1000,
          );

        return res.status(429).json({

          success: false,

          message:
            `Please wait ${secondsLeft} seconds before requesting another code.`,

        });

      }

      // --------------------------------------
      // GENERATE OTP
      // --------------------------------------

      const otp =
        generateOtp();

      // --------------------------------------
      // HASH OTP
      // --------------------------------------

      const otpHash =
        hashOtp(otp);

      // --------------------------------------
      // STORE OTP
      // --------------------------------------

      otpStore.set(
        email,
        {

          otpHash,

          // OTP expires after 10 minutes
          expiresAt:
            Date.now() +
            OTP_EXPIRY_MS,

          // Start with zero failed attempts
          attempts: 0,

          // Remember when this OTP was sent
          lastSentAt:
            Date.now(),

        },
      );

      // --------------------------------------
      // SEND EMAIL
      // --------------------------------------

      await sendOtpEmail(
        email,
        otp,
      );

      // --------------------------------------
      // DEVELOPMENT CONSOLE
      // --------------------------------------
      //
      // This is useful while testing.
      //
      // In production, DO NOT log the OTP.
      //

      console.log("");

      console.log(
        "==========================================",
      );

      console.log(
        "SIYA-FUND OTP SENT",
      );

      console.log(
        "==========================================",
      );

      console.log(
        `Email: ${email}`,
      );

      console.log(
        `OTP: ${otp}`,
      );

      console.log(
        "Expires: 10 minutes",
      );

      console.log(
        "==========================================",
      );

      console.log("");

      // --------------------------------------
      // SUCCESS RESPONSE
      // --------------------------------------

      return res.json({

        success: true,

        message:
          "Verification code sent successfully.",

      });

    } catch (error) {

      // --------------------------------------
      // SERVER ERROR
      // --------------------------------------

      console.error(
        "OTP sending error:",
        error,
      );

      return res.status(500).json({

        success: false,

        message:
          "Unable to send verification code.",

      });

    }

  },
);

// ==========================================
// VERIFY OTP
// ==========================================
//
// POST /verify-otp
//
// Body:
// {
//   "email": "example@gmail.com",
//   "otp": "123456"
// }
//
// ==========================================

app.post(
  "/verify-otp",
  async (req, res) => {

    try {

      // --------------------------------------
      // GET EMAIL
      // --------------------------------------

      const email =
        String(
          req.body?.email || "",
        )
          .trim()
          .toLowerCase();

      // --------------------------------------
      // GET OTP
      // --------------------------------------

      const otp =
        String(
          req.body?.otp || "",
        ).trim();

      // --------------------------------------
      // VALIDATE INPUT
      // --------------------------------------

      if (!email || !otp) {

        return res.status(400).json({

          success: false,

          message:
            "Email and verification code are required.",

        });

      }

      // --------------------------------------
      // VALIDATE OTP FORMAT
      // --------------------------------------

      if (
        !/^\d{6}$/.test(otp)
      ) {

        return res.status(400).json({

          success: false,

          message:
            "Verification code must contain 6 digits.",

        });

      }

      // --------------------------------------
      // FIND OTP
      // --------------------------------------

      const record =
        otpStore.get(email);

      if (!record) {

        return res.status(400).json({

          success: false,

          message:
            "No verification code was found. Please request a new code.",

        });

      }

      // --------------------------------------
      // CHECK EXPIRY
      // --------------------------------------

      if (
        Date.now() >
        record.expiresAt
      ) {

        // Remove expired OTP
        otpStore.delete(email);

        return res.status(400).json({

          success: false,

          message:
            "Your verification code has expired. Please request a new one.",

        });

      }

      // --------------------------------------
      // CHECK MAXIMUM ATTEMPTS
      // --------------------------------------

      if (
        record.attempts >=
        MAX_ATTEMPTS
      ) {

        // Delete OTP after too many attempts
        otpStore.delete(email);

        return res.status(429).json({

          success: false,

          message:
            "Too many incorrect attempts. Please request a new code.",

        });

      }

      // --------------------------------------
      // HASH SUPPLIED OTP
      // --------------------------------------

      const suppliedHash =
        hashOtp(otp);

      // --------------------------------------
      // COMPARE OTP
      // --------------------------------------

      if (
        suppliedHash !==
        record.otpHash
      ) {

        // Increase failed attempts
        record.attempts++;

        return res.status(400).json({

          success: false,

          message:
            "Incorrect verification code.",

        });

      }

      // --------------------------------------
      // OTP IS CORRECT
      // --------------------------------------

      // Remove OTP after successful verification
      otpStore.delete(email);

      console.log(
        `OTP verified successfully for ${email}`,
      );

      // --------------------------------------
      // SUCCESS RESPONSE
      // --------------------------------------

      return res.json({

        success: true,

        message:
          "Email verified successfully.",

      });

    } catch (error) {

      // --------------------------------------
      // SERVER ERROR
      // --------------------------------------

      console.error(
        "OTP verification error:",
        error,
      );

      return res.status(500).json({

        success: false,

        message:
          "Unable to verify the code.",

      });

    }

  },
);

// ==========================================
// START SERVER
// ==========================================

app.listen(
  PORT,
  "0.0.0.0",
  () => {

    console.log("");

    console.log(
      "==========================================",
    );

    console.log(
      "SIYA-FUND OTP SERVER",
    );

    console.log(
      "==========================================",
    );

    console.log(
      `Server running on port ${PORT}`,
    );

    console.log("");

    console.log(
      `http://localhost:${PORT}`,
    );

    console.log(
      "==========================================",
    );

    console.log("");

  },
);

