
import type { Timestamp } from "firebase/firestore";

export type ContributionStatus =
  | "pending"
  | "completed"
  | "cancelled";

export interface Contribution {
  id: string;
  userId: string;
  amount: number;
  currency: "ZAR";
  title: string;
  description: string;
  status: ContributionStatus;
  createdAt: Timestamp | Date | null;
}

export interface CreateContributionInput {
  amount: number;
  title: string;
  description?: string;
}
