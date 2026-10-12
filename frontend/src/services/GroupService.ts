import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  doc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import { Group } from "../models/Group";

// CREATE GROUP
export const createGroup = async (
  groupData: Omit<Group, "id" | "createdAt" | "updatedAt">
): Promise<string> => {
  const docRef = await addDoc(collection(db, "groups"), {
    ...groupData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
};

// GET USER GROUPS
export const getUserGroups = async (userId: string): Promise<Group[]> => {
  const q = query(
    collection(db, "groups"),
    where("members", "array-contains", userId)
  );
  const querySnapshot = await getDocs(q);
  const groups: Group[] = [];
  querySnapshot.forEach((doc) => {
    groups.push({ id: doc.id, ...doc.data() } as Group);
  });
  return groups;
};

// GET GROUP BY ID
export const getGroupById = async (groupId: string): Promise<Group | null> => {
  const docRef = doc(db, "groups", groupId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Group;
  }
  return null;
};