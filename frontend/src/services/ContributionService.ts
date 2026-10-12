
import {
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  where,
  writeBatch,
  type Timestamp,
} from "firebase/firestore";

import { auth, db } from "./firebase";

import type {
  Contribution,
  CreateContributionInput,
} from "../models/Contribution";

const CONTRIBUTIONS_COLLECTION = "contributions";
const TRANSACTIONS_COLLECTION = "transactions";

function getUserId(): string {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("Please sign in to create a contribution.");
  }

  return user.uid;
}

function toContribution(
  id: string,
  data: Record<string, unknown>,
): Contribution {
  const createdAt = data.createdAt;

  let date: Contribution["createdAt"] = null;

  if (createdAt instanceof Date) {
    date = createdAt;
  } else if (
    createdAt &&
    typeof createdAt === "object" &&
    "toDate" in createdAt &&
    typeof createdAt.toDate === "function"
  ) {
    date = createdAt as Timestamp;
  }

  const status =
    data.status === "completed" || data.status === "cancelled"
      ? data.status
      : "pending";

  return {
    id,
    userId: String(data.userId ?? ""),
    amount: Number(data.amount ?? 0),
    currency: "ZAR",
    title: String(data.title ?? "Contribution"),
    description: String(data.description ?? ""),
    status,
    createdAt: date,
  };
}

export async function createContribution(
  input: CreateContributionInput,
): Promise<string> {
  const userId = getUserId();
  const title = input.title.trim();
  const description = input.description?.trim() ?? "";

  if (!Number.isFinite(input.amount) || input.amount <= 0) {
    throw new Error("Enter a contribution amount greater than zero.");
  }

  if (!title) {
    throw new Error("Enter a contribution title.");
  }

  const batch = writeBatch(db);

  const contributionRef = doc(
    collection(db, CONTRIBUTIONS_COLLECTION),
  );

  const transactionRef = doc(
    collection(db, TRANSACTIONS_COLLECTION),
  );

  batch.set(contributionRef, {
    userId,
    amount: input.amount,
    currency: "ZAR",
    title,
    description,
    status: "pending",
    createdAt: serverTimestamp(),
  });

  batch.set(transactionRef, {
    userId,
    amount: input.amount,
    currency: "ZAR",
    type: "contribution",
    status: "pending",
    description: description
      ? `${title} — ${description}`
      : title,
    referenceId: contributionRef.id,
    referenceType: "contribution",
    createdAt: serverTimestamp(),
  });

  await batch.commit();

  return contributionRef.id;
}

export async function getContributions(): Promise<Contribution[]> {
  const userId = getUserId();

  const contributionsQuery = query(
    collection(db, CONTRIBUTIONS_COLLECTION),
    where("userId", "==", userId),
  );

  const snapshot = await getDocs(contributionsQuery);

  const contributions = snapshot.docs.map((item) =>
    toContribution(item.id, item.data()),
  );

  return contributions.sort((a, b) => {
    const getTime = (value: Contribution["createdAt"]) => {
      if (!value) return 0;
      return value instanceof Date
        ? value.getTime()
        : value.toMillis();
    };

    return getTime(b.createdAt) - getTime(a.createdAt);
  });
}
