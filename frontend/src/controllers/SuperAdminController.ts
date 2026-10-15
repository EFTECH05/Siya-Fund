
import {
  collection,
  getCountFromServer,
} from "firebase/firestore";

import { router } from "expo-router";
import { db } from "../services/firebase";

export const SuperAdminController = {
  async getDashboardStats() {
    const usersSnapshot = await getCountFromServer(
      collection(db, "users"),
    );

    const [
      groupsSnapshot,
      contributionsSnapshot,
      loansSnapshot,
      transactionsSnapshot,
    ] = await Promise.all([
      getCountFromServer(collection(db, "groups")),
      getCountFromServer(collection(db, "contributions")),
      getCountFromServer(collection(db, "loans")),
      getCountFromServer(collection(db, "transactions")),
    ]);

    return {
      totalUsers: usersSnapshot.data().count,
      totalGroups: groupsSnapshot.data().count,
      totalContributions: contributionsSnapshot.data().count,
      totalLoans: loansSnapshot.data().count,
      totalTransactions: transactionsSnapshot.data().count,
    };
  },

  manageUsers() {
    console.log("User management is not connected yet.");
  },

  manageGroups() {
    console.log("Group management is not connected yet.");
  },

  manageContributions() {
    router.push("/super-admin/contributions");
  },

  manageLoans() {
    console.log("Loan management is not connected yet.");
  },

  manageTransactions() {
    console.log("Transaction management is not connected yet.");
  },
};
