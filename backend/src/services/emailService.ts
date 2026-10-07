import nodemailer from "nodemailer";

import fs from "fs";

import path from "path";

// ==========================================
// GMAIL SMTP CONFIGURATION
// ==========================================

const smtpHost =
  process.env.SMTP_HOST || "smtp.gmail.com";

const smtpPort = Number(
  process.env.SMTP_PORT || 587
);

const smtpUser = process.env.SMTP_USER;

const smtpPass = process.env.SMTP_PASS;

// ==========================================
// ENVIRONMENT CHECK
// ==========================================

if (!smtpUser) {
  console.warn(
    "WARNING: SMTP_USER is not configured in the .env file."
  );
}

if (!smtpPass) {
  console.warn(
    "WARNING: SMTP_PASS is not configured in the .env file."
  );
}

// ==========================================
// CREATE GMAIL SMTP TRANSPORTER
// ==========================================

const transporter = nodemailer.createTransport({
  host: smtpHost,

  port: smtpPort,

  secure: false,

  auth: {
    user: smtpUser,

    pass: smtpPass,
  },

  tls: {
    rejectUnauthorized: true,
  },
});

// ==========================================
// SIYA-FUND LOGO
// ==========================================

const logoPath = path.join(
  __dirname,
  "../../assets/siya-logo.png"
);

// ==========================================
// SEND OTP EMAIL
// ==========================================

export const sendOTPEmail = async (
  email: string,
  otp: string
): Promise<void> => {
  try {
    // ========================================
    // VALIDATION
    // ========================================

    if (!email) {
      throw new Error(
        "Recipient email address is required."
      );
    }

    if (!otp) {
      throw new Error(
        "OTP is required."
      );
    }

    if (!smtpUser || !smtpPass) {
      throw new Error(
        "Gmail SMTP credentials are not configured. Please check your .env file."
      );
    }

    // ========================================
    // READ SIYA-FUND LOGO
    // ========================================

    const logo = fs.readFileSync(
      logoPath
    );

    // ========================================
    // EMAIL SUBJECT
    // ========================================

    const subject =
      "Your Siya-Fund Verification Code";

    // ========================================
    // PLAIN-TEXT EMAIL
    // ========================================

    const text = `
Your Siya-Fund verification code is:

${otp}

This code will expire in 5 minutes.

If you did not request this code, you can safely ignore this email.

Siya-Fund Team

Save • Borrow • Grow
    `;

    // ========================================
    // HTML EMAIL
    // ========================================

    const html = `
<!DOCTYPE html>

<html>

<head>

  <meta charset="UTF-8">

  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  >

  <title>
    Siya-Fund Email Verification
  </title>

</head>

<body
  style="
    margin: 0;
    padding: 0;
    background-color: #f4f7f4;
    font-family: Arial, Helvetica, sans-serif;
  "
>

  <!-- Main Background -->

  <table
    width="100%"
    cellpadding="0"
    cellspacing="0"
    border="0"
    style="
      background-color: #f4f7f4;
      padding: 40px 15px;
    "
  >

    <tr>

      <td align="center">

        <!-- Email Card -->

        <table
          width="100%"
          cellpadding="0"
          cellspacing="0"
          border="0"
          style="
            max-width: 520px;
            background-color: #ffffff;
            border-radius: 18px;
            overflow: hidden;
          "
        >

          <!-- GREEN HEADER -->

          <tr>

            <td
              align="center"
              style="
                background-color: #15803d;
                padding: 35px 25px;
              "
            >

              <img
                src="cid:siya-logo"
                alt="Siya-Fund Logo"
                width="135"
                style="
                  display: block;
                  margin: 0 auto;
                "
              >

            </td>

          </tr>

          <!-- CONTENT -->

          <tr>

            <td
              style="
                padding: 38px 35px;
              "
            >

              <!-- Title -->

              <h1
                style="
                  margin: 0 0 12px;
                  text-align: center;
                  color: #111111;
                  font-size: 27px;
                  font-weight: 700;
                "
              >

                Verify Your Email

              </h1>

              <!-- Introduction -->

              <p
                style="
                  margin: 0 auto 28px;
                  max-width: 400px;
                  text-align: center;
                  color: #555555;
                  font-size: 15px;
                  line-height: 24px;
                "
              >

                Welcome to

                <strong style="color: #15803d;">
                  Siya-Fund
                </strong>.

                Use the verification code below
                to continue.

              </p>

              <!-- OTP SECTION -->

              <table
                width="100%"
                cellpadding="0"
                cellspacing="0"
                border="0"
              >

                <tr>

                  <td
                    align="center"
                    style="
                      background-color: #f0fdf4;
                      border: 1px solid #bbf7d0;
                      border-radius: 14px;
                      padding: 25px 15px;
                    "
                  >

                    <!-- OTP Label -->

                    <p
                      style="
                        margin: 0 0 10px;
                        color: #555555;
                        font-size: 12px;
                        font-weight: 600;
                        text-transform: uppercase;
                        letter-spacing: 1.5px;
                      "
                    >

                      Verification Code

                    </p>

                    <!-- OTP -->

                    <div
                      style="
                        color: #15803d;
                        font-size: 34px;
                        font-weight: 700;
                        letter-spacing: 9px;
                        padding-left: 9px;
                      "
                    >

                      ${otp}

                    </div>

                  </td>

                </tr>

              </table>

              <!-- Expiration -->

              <p
                style="
                  margin: 22px 0 0;
                  text-align: center;
                  color: #333333;
                  font-size: 14px;
                "
              >

                This code will expire in

                <strong style="color: #111111;">
                  5 minutes
                </strong>.

              </p>

              <!-- Security Notice -->

              <table
                width="100%"
                cellpadding="0"
                cellspacing="0"
                border="0"
                style="
                  margin-top: 25px;
                "
              >

                <tr>

                  <td
                    style="
                      background-color: #fafafa;
                      border-left: 4px solid #15803d;
                      border-radius: 8px;
                      padding: 15px;
                    "
                  >

                    <p
                      style="
                        margin: 0;
                        color: #555555;
                        font-size: 13px;
                        line-height: 20px;
                      "
                    >

                      <strong style="color: #111111;">
                        Security notice:
                      </strong>

                      If you did not request this code,
                      you can safely ignore this email.

                      Never share your verification code
                      with anyone.

                    </p>

                  </td>

                </tr>

              </table>

              <!-- Divider -->

              <hr
                style="
                  border: 0;
                  border-top: 1px solid #e5e5e5;
                  margin: 32px 0 25px;
                "
              >

              <!-- Footer -->

              <div
                style="
                  text-align: center;
                "
              >

                <p
                  style="
                    margin: 0 0 7px;
                    color: #111111;
                    font-size: 14px;
                    font-weight: 700;
                  "
                >

                  Siya-Fund Team

                </p>

                <p
                  style="
                    margin: 0;
                    color: #15803d;
                    font-size: 12px;
                    font-weight: 600;
                  "
                >

                  Save • Borrow • Grow

                </p>

              </div>

            </td>

          </tr>

          <!-- BOTTOM GREEN STRIP -->

          <tr>

            <td
              style="
                height: 6px;
                background-color: #15803d;
                font-size: 0;
                line-height: 0;
              "
            >

              &nbsp;

            </td>

          </tr>

        </table>

        <!-- Outside Footer -->

        <p
          style="
            margin: 20px 0 0;
            color: #888888;
            font-size: 11px;
            text-align: center;
          "
        >

          This is an automated message from Siya-Fund.
          Please do not reply to this email.

        </p>

      </td>

    </tr>

  </table>

</body>

</html>
    `;

    // ========================================
    // SEND EMAIL WITH GMAIL SMTP
    // ========================================

    const info = await transporter.sendMail({

      from: `"Siya-Fund" <${smtpUser}>`,

      to: email,

      subject,

      text,

      html,

      attachments: [
        {
          filename: "siya-logo.png",

          content: logo,

          cid: "siya-logo",
        },
      ],
    });

    // ========================================
    // SUCCESS LOG
    // ========================================

    console.log(
      "EMAIL SENT SUCCESSFULLY WITH GMAIL SMTP"
    );

    console.log(
      "Message ID:",
      info.messageId
    );

    console.log(
      "Recipient:",
      email
    );

  } catch (error) {

    // ========================================
    // ERROR LOG
    // ========================================

    console.error(
      "GMAIL SMTP EMAIL ERROR:",
      error
    );

    throw error;
  }
};