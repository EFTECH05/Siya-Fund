import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import { Group, GroupMember } from "../models/Group";

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Generates a random 6-character alphanumeric join code. */
export const generateJoinCode = (): string => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

// ── Create ────────────────────────────────────────────────────────────────────

export const createGroup = async (
  groupData: Omit<Group, "id" | "createdAt" | "updatedAt" | "joinCode">
): Promise<string> => {
  const joinCode = generateJoinCode();
  const docRef = await addDoc(collection(db, "groups"), {
    ...groupData,
    joinCode,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
};

// ── Read ──────────────────────────────────────────────────────────────────────

export const getUserGroups = async (userId: string): Promise<Group[]> => {
  const q = query(
    collection(db, "groups"),
    where("members", "array-contains", userId)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Group));
};

export const getGroupById = async (groupId: string): Promise<Group | null> => {
  const docRef = doc(db, "groups", groupId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Group;
  }
  return null;
};

/**
 * Looks up a group by its joinCode.
 * Returns the group document or null if no match.
 */
export const getGroupByJoinCode = async (
  joinCode: string
): Promise<Group | null> => {
  const q = query(
    collection(db, "groups"),
    where("joinCode", "==", joinCode.toUpperCase())
  );
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  const d = snapshot.docs[0];
  return { id: d.id, ...d.data() } as Group;
};

/**
 * Fetches display info for every UID in the members array.
 * Reads from the "users" collection (uid → { displayName, email }).
 */
export const getMemberProfiles = async (
  memberIds: string[]
): Promise<GroupMember[]> => {
  if (memberIds.length === 0) return [];
  const profiles: GroupMember[] = [];
  // Firestore "in" queries are limited to 30 items; batch if needed.
  const batchSize = 30;
  for (let i = 0; i < memberIds.length; i += batchSize) {
    const batch = memberIds.slice(i, i + batchSize);
    const q = query(collection(db, "users"), where("uid", "in", batch));
    const snapshot = await getDocs(q);
    snapshot.docs.forEach((d) => {
      const data = d.data();
      profiles.push({
        uid: data.uid,
        email: data.email ?? "",
        displayName: data.displayName ?? data.email ?? "Unknown",
      });
    });
  }
  return profiles;
};

// ── Membership mutations ──────────────────────────────────────────────────────

/**
 * Adds a single userId to the group's members array.
 * Firestore's arrayUnion is idempotent — no duplicates will be created.
 */
export const addMemberToGroup = async (
  groupId: string,
  userId: string
): Promise<void> => {
  const groupRef = doc(db, "groups", groupId);
  await updateDoc(groupRef, {
    members: arrayUnion(userId),
    updatedAt: serverTimestamp(),
  });
};

/**
 * Removes a userId from the group's members array.
 * The group creator cannot be removed.
 */
export const removeMemberFromGroup = async (
  groupId: string,
  userId: string,
  creatorId: string
): Promise<void> => {
  if (userId === creatorId) {
    throw new Error("The group creator cannot be removed from the group.");
  }
  const groupRef = doc(db, "groups", groupId);
  await updateDoc(groupRef, {
    members: arrayRemove(userId),
    updatedAt: serverTimestamp(),
  });
};

/**
 * Lets a user join a group using its join code.
 * Returns the group's id on success.
 */
export const joinGroupByCode = async (
  joinCode: string,
  userId: string
): Promise<string> => {
  const group = await getGroupByJoinCode(joinCode);
  if (!group) {
    throw new Error("No group found with that join code.");
  }
  if (group.members.includes(userId)) {
    throw new Error("You are already a member of this group.");
  }
  await addMemberToGroup(group.id, userId);
  return group.id;
};
