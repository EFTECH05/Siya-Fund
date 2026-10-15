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
  CreateTransactionInput,
  Transaction,
} from "../models/Transaction";

const TRANSACTIONS_COLLECTION = "transactions";

/**
 * Returns the UID of the currently authenticated user.
 * Throws an error if nobody is signed in.
 */
function getAuthenticatedUserId(): string {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("Please sign in to access your transactions.");
  }

  return user.uid;
}

/**
 * Converts a Firestore document into a Transaction object.
 */
function toTransaction(
  id: string,
  data: Record<string, unknown>,
): Transaction {
  const createdAt = data.createdAt;

  let transactionDate: Transaction["createdAt"] = null;

  if (createdAt instanceof Date) {
    transactionDate = createdAt;
  } else if (
    createdAt &&
    typeof createdAt === "object" &&
    "toMillis" in createdAt &&
    typeof createdAt.toMillis === "function"
  ) {
    transactionDate = createdAt as Timestamp;
  }

  return {
    id,
    userId: String(data.userId ?? ""),
    amount: Number(data.amount ?? 0),
    currency: "ZAR",
    type: data.type as Transaction["type"],
    status: data.status as Transaction["status"],
    description: String(data.description ?? ""),
    ...(typeof data.referenceId === "string"
      ? { referenceId: data.referenceId }
      : {}),
    ...(data.referenceType === "contribution" ||
    data.referenceType === "loan"
      ? { referenceType: data.referenceType }
      : {}),
    createdAt: transactionDate,
  };
}

/**
 * Retrieves the signed-in user's transactions,
 * newest first.
 */
export async function getTransactions(): Promise<Transaction[]> {
  const userId = getAuthenticatedUserId();

  const transactionsQuery = query(
    collection(db, TRANSACTIONS_COLLECTION),
    where("userId", "==", userId),
  );

  const snapshot = await getDocs(transactionsQuery);

  const transactions = snapshot.docs.map((item) =>
    toTransaction(item.id, item.data()),
  );

  return transactions.sort((a, b) => {
    const dateA = a.createdAt
      ? a.createdAt instanceof Date
        ? a.createdAt.getTime()
        : a.createdAt.toMillis()
      : 0;

    const dateB = b.createdAt
      ? b.createdAt instanceof Date
        ? b.createdAt.getTime()
        : b.createdAt.toMillis()
      : 0;

    return dateB - dateA;
  });
}

/**
 * Retrieves one transaction.
 * Returns null if it doesn't exist or doesn't belong
 * to the currently authenticated user.
 */
export async function getTransactionById(
  transactionId: string,
): Promise<Transaction | null> {
  const userId = getAuthenticatedUserId();

  if (!transactionId.trim()) {
    return null;
  }

  const transactionRef = doc(
    db,
    TRANSACTIONS_COLLECTION,
    transactionId,
  );

  const snapshot = await getDoc(transactionRef);

  if (!snapshot.exists()) {
    return null;
  }

  const transaction = toTransaction(
    snapshot.id,
    snapshot.data(),
  );

  if (transaction.userId !== userId) {
    return null;
  }

  return transaction;
}

/**
 * Creates a transaction for the authenticated user.
 * The calling workflow must supply the correct status.
 */
export async function createTransaction(
  input: CreateTransactionInput,
): Promise<string> {
  const userId = getAuthenticatedUserId();

  if (!Number.isFinite(input.amount) || input.amount <= 0) {
    throw new Error(
      "Transaction amount must be greater than zero.",
    );
  }

  if (!input.description.trim()) {
    throw new Error(
      "A transaction description is required.",
    );
  }

  const transactionRef = await addDoc(
    collection(db, TRANSACTIONS_COLLECTION),
    {
      userId,
      amount: input.amount,
      currency: "ZAR",
      type: input.type,
      status: input.status,
      description: input.description.trim(),
      ...(input.referenceId
        ? { referenceId: input.referenceId }
        : {}),
      ...(input.referenceType
        ? { referenceType: input.referenceType }
        : {}),
      createdAt: serverTimestamp(),
    },
  );

  return transactionRef.id;
}