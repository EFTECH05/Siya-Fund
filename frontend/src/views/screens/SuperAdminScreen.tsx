import React, { useEffect, useState } from "react";

import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

import { router } from "expo-router";

import {
  getCurrentUser,
  getUserRole,
  logoutUser,
} from "../../services/AuthService";

import { SuperAdminController } from "../../controllers/SuperAdminController";

import { styles } from "./SuperAdminScreen.styles";

// ==========================================
// TYPES
// ==========================================

type DashboardStats = {
  totalUsers: number;
  totalGroups: number;
  totalContributions: number;
  totalLoans: number;
  totalTransactions: number;
};

// ==========================================
// SUPER ADMIN SCREEN
// ==========================================

export default function SuperAdminScreen() {
  // ==========================================
  // STATE
  // ==========================================

  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalGroups: 0,
    totalContributions: 0,
    totalLoans: 0,
    totalTransactions: 0,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);

  // ==========================================
  // LOAD DASHBOARD
  // ==========================================

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        // --------------------------------------
        // Check current Firebase user
        // --------------------------------------

        const user = getCurrentUser();

        if (!user) {
          router.replace("/login");
          return;
        }

        // --------------------------------------
        // Check Firebase custom role
        // --------------------------------------

        const role = await getUserRole();

        if (role !== "super_admin") {
          router.replace("/dashboard");
          return;
        }

        // --------------------------------------
        // User is authorized
        // --------------------------------------

        setIsAuthorized(true);

        // --------------------------------------
        // Load dashboard statistics
        // --------------------------------------

        const dashboardStats =
          await SuperAdminController.getDashboardStats();

        setStats(dashboardStats);
      } catch (error) {
        // Keep technical error in developer console.
        // Never display the technical error to the user.

        console.error(
          "Failed to load Super Admin dashboard:",
          error,
        );

        router.replace("/dashboard");
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboard();
  }, []);

  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);

      await logoutUser();

      router.replace("/login");
    } catch (error) {
      // Keep technical error in developer console.

      console.error(
        "Logout failed:",
        error,
      );

      setIsLoggingOut(false);
    }
  };

  // ==========================================
  // MANAGEMENT ACTIONS
  // ==========================================

  const handleUsers = () => {
    SuperAdminController.manageUsers();
  };

  const handleGroups = () => {
    SuperAdminController.manageGroups();
  };

  const handleContributions = () => {
    SuperAdminController.manageContributions();
  };

  const handleLoans = () => {
    SuperAdminController.manageLoans();
  };

  const handleTransactions = () => {
    SuperAdminController.manageTransactions();
  };

  // ==========================================
  // LOADING SCREEN
  // ==========================================

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator
          size="large"
          color="#2E8B57"
        />

        <Text style={styles.loadingText}>
          Loading Super Admin Dashboard...
        </Text>
      </View>
    );
  }

  // ==========================================
  // AUTHORIZATION CHECK
  // ==========================================

  if (!isAuthorized) {
    return null;
  }

  // ==========================================
  // CURRENT USER
  // ==========================================

  const currentUser = getCurrentUser();

  const displayName =
    currentUser?.displayName || "Super Admin";

  // ==========================================
  // DASHBOARD
  // ==========================================

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ======================================
            HEADER
        ======================================= */}

        <View style={styles.header}>
          <View style={styles.headerTextContainer}>
            <Text style={styles.smallHeaderText}>
              SIYA-FUND ADMINISTRATION
            </Text>

            <Text style={styles.title}>
              Super Admin
            </Text>

            <Text style={styles.welcomeText}>
              Welcome back, {displayName}.
            </Text>
          </View>

          {/* Logout */}

          <Pressable
            style={({ pressed }) => [
              styles.logoutButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={handleLogout}
            disabled={isLoggingOut}
          >
            {isLoggingOut ? (
              <ActivityIndicator
                size="small"
                color="#FFFFFF"
              />
            ) : (
              <Text style={styles.logoutButtonText}>
                LOGOUT
              </Text>
            )}
          </Pressable>
        </View>

        {/* ======================================
            OVERVIEW
        ======================================= */}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            Platform Overview
          </Text>

          <Text style={styles.sectionDescription}>
            Monitor the main Siya-Fund platform activity.
          </Text>
        </View>

        {/* ======================================
            STATISTICS
        ======================================= */}

        <View style={styles.statsGrid}>
          {/* USERS */}

          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <Text style={styles.statIcon}>
                👤
              </Text>
            </View>

            <Text style={styles.statValue}>
              {stats.totalUsers}
            </Text>

            <Text style={styles.statLabel}>
              Total Users
            </Text>
          </View>

          {/* GROUPS */}

          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <Text style={styles.statIcon}>
                👥
              </Text>
            </View>

            <Text style={styles.statValue}>
              {stats.totalGroups}
            </Text>

            <Text style={styles.statLabel}>
              Total Groups
            </Text>
          </View>

          {/* CONTRIBUTIONS */}

          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <Text style={styles.statIcon}>
                💰
              </Text>
            </View>

            <Text style={styles.statValue}>
              {stats.totalContributions}
            </Text>

            <Text style={styles.statLabel}>
              Contributions
            </Text>
          </View>

          {/* LOANS */}

          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <Text style={styles.statIcon}>
                💳
              </Text>
            </View>

            <Text style={styles.statValue}>
              {stats.totalLoans}
            </Text>

            <Text style={styles.statLabel}>
              Loans
            </Text>
          </View>

          {/* TRANSACTIONS */}

          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <Text style={styles.statIcon}>
                🔄
              </Text>
            </View>

            <Text style={styles.statValue}>
              {stats.totalTransactions}
            </Text>

            <Text style={styles.statLabel}>
              Transactions
            </Text>
          </View>
        </View>

        {/* ======================================
            MANAGEMENT
        ======================================= */}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            Management
          </Text>

          <Text style={styles.sectionDescription}>
            Manage and monitor Siya-Fund platform data.
          </Text>
        </View>

        {/* ======================================
            MANAGEMENT CARDS
        ======================================= */}

        <View style={styles.managementContainer}>
          {/* USERS */}

          <Pressable
            style={({ pressed }) => [
              styles.managementCard,
              pressed && styles.managementCardPressed,
            ]}
            onPress={handleUsers}
          >
            <View style={styles.managementIcon}>
              <Text style={styles.managementIconText}>
                👤
              </Text>
            </View>

            <View style={styles.managementTextContainer}>
              <Text style={styles.managementTitle}>
                User Management
              </Text>

              <Text style={styles.managementDescription}>
                View and manage Siya-Fund users.
              </Text>
            </View>

            <Text style={styles.arrow}>
              ›
            </Text>
          </Pressable>

          {/* GROUPS */}

          <Pressable
            style={({ pressed }) => [
              styles.managementCard,
              pressed && styles.managementCardPressed,
            ]}
            onPress={handleGroups}
          >
            <View style={styles.managementIcon}>
              <Text style={styles.managementIconText}>
                👥
              </Text>
            </View>

            <View style={styles.managementTextContainer}>
              <Text style={styles.managementTitle}>
                Group Management
              </Text>

              <Text style={styles.managementDescription}>
                Monitor savings groups and memberships.
              </Text>
            </View>

            <Text style={styles.arrow}>
              ›
            </Text>
          </Pressable>

          {/* CONTRIBUTIONS */}

          <Pressable
            style={({ pressed }) => [
              styles.managementCard,
              pressed && styles.managementCardPressed,
            ]}
            onPress={handleContributions}
          >
            <View style={styles.managementIcon}>
              <Text style={styles.managementIconText}>
                💰
              </Text>
            </View>

            <View style={styles.managementTextContainer}>
              <Text style={styles.managementTitle}>
                Contribution Management
              </Text>

              <Text style={styles.managementDescription}>
                Monitor member contributions and savings.
              </Text>
            </View>

            <Text style={styles.arrow}>
              ›
            </Text>
          </Pressable>

          {/* LOANS */}

          <Pressable
            style={({ pressed }) => [
              styles.managementCard,
              pressed && styles.managementCardPressed,
            ]}
            onPress={handleLoans}
          >
            <View style={styles.managementIcon}>
              <Text style={styles.managementIconText}>
                💳
              </Text>
            </View>

            <View style={styles.managementTextContainer}>
              <Text style={styles.managementTitle}>
                Loan Management
              </Text>

              <Text style={styles.managementDescription}>
                Review and monitor member loans.
              </Text>
            </View>

            <Text style={styles.arrow}>
              ›
            </Text>
          </Pressable>

          {/* TRANSACTIONS */}

          <Pressable
            style={({ pressed }) => [
              styles.managementCard,
              pressed && styles.managementCardPressed,
            ]}
            onPress={handleTransactions}
          >
            <View style={styles.managementIcon}>
              <Text style={styles.managementIconText}>
                🔄
              </Text>
            </View>

            <View style={styles.managementTextContainer}>
              <Text style={styles.managementTitle}>
                Transaction Management
              </Text>

              <Text style={styles.managementDescription}>
                Monitor Siya-Fund financial transactions.
              </Text>
            </View>

            <Text style={styles.arrow}>
              ›
            </Text>
          </Pressable>
        </View>

        {/* ======================================
            ADMIN FOOTER
        ======================================= */}

        <View style={styles.footer}>
          <Text style={styles.footerTitle}>
            Siya-Fund Administration
          </Text>

          <Text style={styles.footerText}>
            Super Admin access gives you control over
            the platform and its users.
          </Text>

          <Text style={styles.footerVersion}>
            Development Administration Panel
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}