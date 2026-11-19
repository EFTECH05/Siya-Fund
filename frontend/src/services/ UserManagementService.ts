
import {
  collection,
  doc,
  getDoc,
  getDocs,
} from "firebase/firestore";

import { db } from "./firebase";
import type { User } from "../models/User";

export const UserManagementService = {

  // Retrieve all registered users.
  // Firestore rules restrict this operation to Super Admin.

  async getAllUsers(): Promise<User[]> {
    const usersCollection = collection(db, "users");

    const usersSnapshot = await getDocs(usersCollection);

    const users: User[] = usersSnapshot.docs.map((userDoc) => ({
      ...userDoc.data(),
      uid: userDoc.id,
    })) as User[];

    return users;
  },

  // Retrieve one user using their Firebase UID.

  async getUserById(uid: string): Promise<User | null> {
    const userRef = doc(db, "users", uid);

    const userSnapshot = await getDoc(userRef);

    if (!userSnapshot.exists()) {
      return null;
    }

    return {
      ...userSnapshot.data(),
      uid: userSnapshot.id,
    } as User;
  },

};
