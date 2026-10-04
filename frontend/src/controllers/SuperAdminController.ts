// ==========================================
// SUPER ADMIN CONTROLLER
// ==========================================

// Firestore functions
import {
  collection,
  getCountFromServer,
} from "firebase/firestore";

// Firebase Firestore database
import { db } from "../services/firebase";

// ==========================================
// SUPER ADMIN CONTROLLER
// ==========================================

export const SuperAdminController = {

  // ========================================
  // GET DASHBOARD STATISTICS
  // ========================================

  getDashboardStats: async () => {

    // ======================================
    // COUNT USERS
    // ======================================

    const usersCollection =
      collection(db, "users");

    const usersSnapshot =
      await getCountFromServer(
        usersCollection,
      );

    const totalUsers =
      usersSnapshot.data().count;

    // ======================================
    // RETURN DASHBOARD STATISTICS
    // ======================================

    return {

      // Real Firebase/Firestore user count
      totalUsers,

      // These will be connected later
      totalGroups: 0,

      totalContributions: 0,

      totalLoans: 0,

      totalTransactions: 0,
    };
  },

  // ==========================================
  // USERS
  // ==========================================

  manageUsers: () => {

    console.log(
      "Opening user management...",
    );
  },

  // ==========================================
  // GROUPS
  // ==========================================

  manageGroups: () => {

    console.log(
      "Opening group management...",
    );
  },

  // ==========================================
  // CONTRIBUTIONS
  // ==========================================

  manageContributions: () => {

    console.log(
      "Opening contribution management...",
    );
  },

  // ==========================================
  // LOANS
  // ==========================================

  manageLoans: () => {

    console.log(
      "Opening loan management...",
    );
  },

  // ==========================================
  // TRANSACTIONS
  // ==========================================

  manageTransactions: () => {

    console.log(
      "Opening transaction management...",
    );
  },
};