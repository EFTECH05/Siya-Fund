export interface UserProfile {
  uid: string;
  firstName: string;
  lastName: string;
  displayName: string;
  email: string;
  phone: string;
}

export type ProfileChanges = Pick<UserProfile, "firstName" | "lastName" | "phone">;

export function validateProfile(changes: ProfileChanges): ProfileChanges {
  const firstName = changes.firstName.trim();
  const lastName = changes.lastName.trim();
  const phone = changes.phone.trim();
  if (!firstName || !lastName) throw new Error("Please enter your first and last name.");
  if (firstName.length > 80 || lastName.length > 80) throw new Error("Each name must be 80 characters or fewer.");
  const digits = phone.replace(/\D/g, "");
  if (phone && (!/^\+?[\d\s()-]{7,20}$/.test(phone) || digits.length < 7 || digits.length > 15)) {
    throw new Error("Please enter a valid phone number.");
  }
  return { firstName, lastName, phone };
}
