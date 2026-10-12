
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  where,
  type Timestamp,
} from "firebase/firestore";

import { auth, db } from "./firebase";

import type {
  CreateLoanInput,
  Loan,
} from "../models/Loan";

const LOANS_COLLECTION = "loans";

function getUserId(): string {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("Please sign in to submit a loan request.");
  }

  return user.uid;
}

function toLoan(
  id: string,
  data: Record<string, unknown>,
): Loan {
  function readDate(
    value: unknown,
  ): Timestamp | Date | null {
    if (value instanceof Date) {
      return value;
    }

    if (
      value &&
      typeof value === "object" &&
      "toDate" in value &&
      typeof value.toDate === "function"
    ) {
      return value as Timestamp;
    }

    return null;
  }

  const allowedStatuses = [
    "approved",
    "rejected",
    "disbursed",
    "repaid",
    "cancelled",
  ] as const;

  const status =
    typeof data.status === "string" &&
    allowedStatuses.includes(
      data.status as (typeof allowedStatuses)[number],
    )
      ? (data.status as Loan["status"])
      : "pending";

  return {
    id,
    userId: String(data.userId ?? ""),
    amount: Number(data.amount ?? 0),
    currency: "ZAR",
    purpose: String(data.purpose ?? ""),
    termMonths: Number(data.termMonths ?? 0),
    status,
    createdAt: readDate(data.createdAt),
    updatedAt: readDate(data.updatedAt),
  };
}

function validateLoanInput(input: CreateLoanInput): void {
  if (!Number.isFinite(input.amount) || input.amount <= 0) {
    throw new Error("Enter a loan amount greater than zero.");
  }

  if (!input.purpose.trim()) {
    throw new Error("Explain why you need the loan.");
  }

  if (
    !Number.isInteger(input.termMonths) ||
    input.termMonths < 1 ||
    input.termMonths > 120
  ) {
    throw new Error("Choose a loan term between 1 and 120 months.");
  }
}

export async function createLoanRequest(
  input: CreateLoanInput,
): Promise<string> {
  const userId = getUserId();

  validateLoanInput(input);

  const loanRef = await addDoc(
    collection(db, LOANS_COLLECTION),
    {
      userId,
      amount: input.amount,
      currency: "ZAR",
      purpose: input.purpose.trim(),
      termMonths: input.termMonths,
      status: "pending",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
  );

  return loanRef.id;
}

export async function getLoanRequests(): Promise<Loan[]> {
  const userId = getUserId();

  const loansQuery = query(
    collection(db, LOANS_COLLECTION),
    where("userId", "==", userId),
  );

  const snapshot = await getDocs(loansQuery);

  const loans = snapshot.docs.map((item) =>
    toLoan(item.id, item.data()),
  );

  return loans.sort((a, b) => {
    const getTime = (value: Loan["createdAt"]) => {
      if (!value) return 0;
      return value instanceof Date
        ? value.getTime()
        : value.toMillis();
    };

    return getTime(b.createdAt) - getTime(a.createdAt);
  });
}

export async function getLoanById(
  loanId: string,
): Promise<Loan | null> {
  const userId = getUserId();

  if (!loanId.trim()) {
    return null;
  }

  const snapshot = await getDoc(
    doc(db, LOANS_COLLECTION, loanId),
  );

  if (!snapshot.exists()) {
    return null;
  }

  const loan = toLoan(snapshot.id, snapshot.data());

  return loan.userId === userId ? loan : null;
}
