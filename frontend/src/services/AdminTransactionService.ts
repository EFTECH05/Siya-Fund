
import {
  collection,
  getDocs,
  type Timestamp,
} from "firebase/firestore";

import { auth, db } from "./firebase";
import { getUserRole } from "./AuthService";

import type { Transaction } from "../models/Transaction";

export interface AdminTransaction extends Transaction {
  memberName: string;
  memberEmail: string;
}

const TRANSACTIONS_COLLECTION = "transactions";
const USERS_COLLECTION = "users";

function toTransaction(
  id: string,
  data: Record<string, unknown>,
  memberName: string,
  memberEmail: string,
): AdminTransaction {
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
    memberName,
    memberEmail,
  };
}

function getTransactionTime(
  transaction: Transaction,
): number {
  if (!transaction.createdAt) {
    return 0;
  }

  return transaction.createdAt instanceof Date
    ? transaction.createdAt.getTime()
    : transaction.createdAt.toMillis();
}

/**
 * Retrieves all transactions across all members.
 * Only Super Admin users are authorised.
 */
export async function getAllTransactions(): Promise<
  AdminTransaction[]
> {
  const currentUser = auth.currentUser;

  if (!currentUser) {
    throw new Error("Please sign in to continue.");
  }

  const role = await getUserRole();

  if (role !== "super_admin") {
    throw new Error(
      "Access denied. Super Admin permission is required.",
    );
  }

  // Firestore security rules provide the actual
  // database-level access protection.
  const [transactionsSnapshot, usersSnapshot] =
    await Promise.all([
      getDocs(collection(db, TRANSACTIONS_COLLECTION)),
      getDocs(collection(db, USERS_COLLECTION)),
    ]);

  // Build a lookup table for member information.
  const members = new Map<
    string,
    { name: string; email: string }
  >();

  usersSnapshot.docs.forEach((userDocument) => {
    const data = userDocument.data();

    const firstName = String(data.firstName ?? "");
    const lastName = String(data.lastName ?? "");

    const displayName = String(
      data.displayName ??
        `${firstName} ${lastName}`.trim() ??
        "Unknown member",
    );

    members.set(userDocument.id, {
      name: displayName || "Unknown member",
      email: String(data.email ?? "No email available"),
    });
  });

  const transactions = transactionsSnapshot.docs.map(
    (transactionDocument) => {
      const data = transactionDocument.data();

      const userId = String(data.userId ?? "");

      const member = members.get(userId);

      return toTransaction(
        transactionDocument.id,
        data,
        member?.name ?? "Unknown member",
        member?.email ?? "No email available",
      );
    },
  );

  return transactions.sort(
    (a, b) =>
      getTransactionTime(b) - getTransactionTime(a),
  );
}
