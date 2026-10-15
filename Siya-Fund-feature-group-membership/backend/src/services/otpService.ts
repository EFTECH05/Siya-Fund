const otpStore = new Map<
  string,
  {
    otp: string;
    expiresAt: number;
  }
>();

export const generateOTP = (email: string): string => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  otpStore.set(email.toLowerCase(), {
    otp,
    expiresAt: Date.now() + 5 * 60 * 1000
  });

  return otp;
};

export const verifyOTP = (
  email: string,
  enteredOTP: string
): boolean => {
  const storedOTP = otpStore.get(email.toLowerCase());

  if (!storedOTP) {
    return false;
  }

  if (Date.now() > storedOTP.expiresAt) {
    otpStore.delete(email.toLowerCase());
    return false;
  }

  if (storedOTP.otp !== enteredOTP) {
    return false;
  }

  otpStore.delete(email.toLowerCase());

  return true;
};