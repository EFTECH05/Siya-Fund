
import {
  collection,
  doc,
  getDocs,
  query,
  where,
  writeBatch,
} from "firebase/firestore";

import { auth, db } from "./firebase";
import type { Contribution } from "../models/Contribution";

const CONTRIBUTIONS_COLLECTION = "contributions";
const TRANSACTIONS_COLLECTION = "transactions";

export async function getPendingContributions(): Promise<Contribution[]> {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("Please sign in first.");
  }

  const contributionsQuery = query(
    collection(db, CONTRIBUTIONS_COLLECTION),
    where("status", "==", "pending"),
  );

  const snapshot = await getDocs(contributionsQuery);

  return snapshot.docs.map((item) => {
    const data = item.data();

    return {
      id: item.id,
      userId: String(data.userId ?? ""),
      amount: Number(data.amount ?? 0),
      currency: "ZAR" as const,
      title: String(data.title ?? "Contribution"),
      description: String(data.description ?? ""),
      status: "pending" as const,
      createdAt: data.createdAt ?? null,
    };
  });
}

export async function confirmContributionPayment(
  contributionId: string,
): Promise<void> {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("Please sign in first.");
  }

  if (!contributionId.trim()) {
    throw new Error("A contribution ID is required.");
  }

  const contributionRef = doc(
    db,
    CONTRIBUTIONS_COLLECTION,
    contributionId,
  );

  const contributionSnapshot = await import("firebase/firestore").then(
    ({ getDoc }) => getDoc(contributionRef),
  );

  if (!contributionSnapshot.exists()) {
    throw new Error("Contribution not found.");
  }

  const contribution = contributionSnapshot.data();

  if (contribution.status !== "pending") {
    throw new Error("This contribution is no longer pending.");
  }

  const transactionsQuery = query(
    collection(db, TRANSACTIONS_COLLECTION),
    where("referenceId", "==", contributionId),
    where("referenceType", "==", "contribution"),
  );

  const transactionsSnapshot = await getDocs(transactionsQuery);

  if (transactionsSnapshot.size !== 1) {
    throw new Error(
      "Could not identify exactly one transaction for this contribution.",
    );
  }

  const transactionDoc = transactionsSnapshot.docs[0];
  const transaction = transactionDoc.data();

  if (
    transaction.userId !== contribution.userId ||
    transaction.amount !== contribution.amount ||
    transaction.status !== "pending" ||
    transaction.type !== "contribution"
  ) {
    throw new Error(
      "The linked transaction does not match this pending contribution.",
    );
  }

  const batch = writeBatch(db);

  batch.update(contributionRef, {
    status: "completed",
  });

  batch.update(transactionDoc.ref, {
    status: "completed",
  });

  await batch.commit();
}
