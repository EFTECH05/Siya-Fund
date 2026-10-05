type RegistrationData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
};

let registrationData: RegistrationData | null = null;

export const setRegistrationData = (
  data: RegistrationData
): void => {
  registrationData = data;
};

export const getRegistrationData = (): RegistrationData | null => {
  return registrationData;
};

export const clearRegistrationData = (): void => {
  registrationData = null;
};