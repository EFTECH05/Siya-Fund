import type { Timestamp } from "firebase/firestore";

export type TransactionType =
  | "contribution"
  | "loan"
  | "repayment"
  | "withdrawal"
  | "deposit";

export type TransactionStatus =
  | "pending"
  | "completed"
  | "failed"
  | "cancelled";

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  currency: "ZAR";
  type: TransactionType;
  status: TransactionStatus;
  description: string;
  referenceId?: string;
  referenceType?: "contribution" | "loan";
  createdAt: Timestamp | Date | null;
}

export interface CreateTransactionInput {
  amount: number;
  type: TransactionType;
  status: TransactionStatus;
  description: string;
  referenceId?: string;
  referenceType?: "contribution" | "loan";
}