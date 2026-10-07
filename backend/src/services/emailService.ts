import { Resend } from "resend";
import fs from "fs";
import path from "path";

const resend = new Resend(
  process.env.RESEND_API_KEY
);

// Siya-Fund logo
const logoPath = path.join(
  __dirname,
  "../../assets/siya-logo.png"
);

export const sendOTPEmail = async (
  email: string,
  otp: string
): Promise<void> => {
  try {
    // Read Siya-Fund logo
    const logo = fs.readFileSync(logoPath);

    const { data, error } =
      await resend.emails.send({
        from: "onboarding@resend.dev",

        to: email,

        subject:
          "Your Siya-Fund Verification Code",

        // Plain-text fallback
        text: `
Your Siya-Fund verification code is:

${otp}

This code will expire in 5 minutes.

If you did not request this code, you can safely ignore this email.

Siya-Fund Team
Save • Borrow • Grow
        `,

        // Embedded logo
        attachments: [
          {
            filename: "siya-logo.png",
            content: logo,
            contentId: "siya-logo",
          },
        ],

        // HTML email
        html: `
<!DOCTYPE html>

<html>

<head>

  <meta charset="UTF-8">

  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  >

  <title>Siya-Fund Email Verification</title>

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
        `,
      });


    // Resend error

    if (error) {

      console.error(
        "RESEND ERROR:",
        error
      );

      throw new Error(
        error.message
      );
    }


    // Success

    console.log(
      "EMAIL SENT WITH RESEND:"
    );

    console.log(
      "Email ID:",
      data?.id
    );


  } catch (error) {

    console.error(
      "EMAIL SERVICE ERROR:",
      error
    );

    throw error;
  }
};