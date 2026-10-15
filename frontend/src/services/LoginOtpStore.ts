let loginEmail: string | null = null;

export const setLoginEmail = (
  email: string
): void => {
  loginEmail = email;
};

export const getLoginEmail = (): string | null => {
  return loginEmail;
};

export const clearLoginEmail = (): void => {
  loginEmail = null;
};