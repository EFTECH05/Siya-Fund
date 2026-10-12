
import type { Timestamp } from "firebase/firestore";

export type LoanStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "disbursed"
  | "repaid"
  | "cancelled";

export interface Loan {
  id: string;
  userId: string;
  amount: number;
  currency: "ZAR";
  purpose: string;
  termMonths: number;
  status: LoanStatus;
  createdAt: Timestamp | Date | null;
  updatedAt: Timestamp | Date | null;
}

export interface CreateLoanInput {
  amount: number;
  purpose: string;
  termMonths: number;
}
