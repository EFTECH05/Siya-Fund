import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendOTPEmail = async (
  email: string,
  otp: string
): Promise<void> => {
  const { data, error } = await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Your Siya-Fund Verification Code",

    text: `Your Siya-Fund verification code is: ${otp}. This code will expire in 5 minutes.`,

    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto;">

        <h2>Siya-Fund Email Verification</h2>

        <p>Hello,</p>

        <p>Your Siya-Fund verification code is:</p>

        <h1 style="letter-spacing: 8px;">${otp}</h1>

        <p>
          This code will expire in <strong>5 minutes</strong>.
        </p>

        <p>
          If you did not request this code, you can safely ignore this email.
        </p>

        <p>
          Regards,<br>
          Siya-Fund Team
        </p>

      </div>
    `
  });

  if (error) {
    console.error("RESEND ERROR:", error);
    throw new Error(error.message);
  }

  console.log("EMAIL SENT WITH RESEND:");
  console.log("Email ID:", data?.id);
};