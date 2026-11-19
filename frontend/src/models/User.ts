import type { Timestamp } from "firebase/firestore";

export interface User {
  uid: string;
  firstName: string;
  lastName: string;
  displayName: string;
  email: string;
  role: "user" | "admin" | "super_admin";
  emailVerified: boolean;
  provider: "email" | "google";
  createdAt: Timestamp | Date | null;
  updatedAt: Timestamp | Date | null;
}