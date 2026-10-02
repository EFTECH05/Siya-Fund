// ==========================================
// IMPORTS
// ==========================================

import React from "react";

import { Pressable, ScrollView, Text, View } from "react-native";

import { router } from "expo-router";

import { styles } from "./DashboardScreen.styles";

// ==========================================
// DASHBOARD SCREEN
// ==========================================

export default function DashboardScreen() {
  // ==========================================
  // NAVIGATION
  // ==========================================

  const goToContributions = () => {
    router.push("/contributions");
  };

  const goToLoans = () => {
    router.push("/loans");
  };

  const goToGroups = () => {
    router.push("/groups");
  };

  const goToTransactions = () => {
    router.push("/transactions");
  };

  // ==========================================
  // SCREEN
  // ==========================================

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ======================================
            HEADER
        ====================================== */}

        <View style={styles.header}>
          <View>
            <Text style={styles.smallGreeting}>Welcome back,</Text>

            <Text style={styles.userName}>Franklin 👋</Text>
          </View>

          {/* Notification */}

          <Pressable
            style={({ pressed }) => [
              styles.notificationButton,
              pressed && styles.buttonPressed,
            ]}
          >
            <Text style={styles.notificationIcon}>🔔</Text>

            <View style={styles.notificationDot} />
          </Pressable>
        </View>

        {/* ======================================
            TOTAL SAVINGS
        ====================================== */}

        <View style={styles.savingsCard}>
          <View style={styles.savingsHeader}>
            <Text style={styles.savingsLabel}>Total Savings</Text>

            <Text style={styles.savingsIcon}>💰</Text>
          </View>

          <Text style={styles.savingsAmount}>R12,500.00</Text>

          <View style={styles.savingsFooter}>
            <View>
              <Text style={styles.savingsFooterLabel}>This Month</Text>

              <Text style={styles.savingsFooterValue}>+ R500.00</Text>
            </View>

            <View style={styles.growthBadge}>
              <Text style={styles.growthText}>↑ 4.2%</Text>
            </View>
          </View>
        </View>

        {/* ======================================
            FINANCIAL SUMMARY
        ====================================== */}

        <Text style={styles.sectionTitle}>Financial Summary</Text>

        <View style={styles.summaryRow}>
          {/* Contributions */}

          <View style={styles.summaryCard}>
            <View style={styles.summaryIconGreen}>
              <Text style={styles.summaryIconText}>↑</Text>
            </View>

            <Text style={styles.summaryLabel}>Contributions</Text>

            <Text style={styles.summaryAmount}>R500.00</Text>

            <Text style={styles.summaryStatus}>This month</Text>
          </View>

          {/* Outstanding Loan */}

          <View style={styles.summaryCard}>
            <View style={styles.summaryIconOrange}>
              <Text style={[styles.summaryIconText, styles.orangeIconText]}>
                ↓
              </Text>
            </View>

            <Text style={styles.summaryLabel}>Outstanding Loan</Text>

            <Text style={styles.summaryAmount}>R2,000.00</Text>

            <Text style={styles.summaryStatus}>Active loan</Text>
          </View>
        </View>

        {/* ======================================
            AVAILABLE LOAN
        ====================================== */}

        <View style={styles.loanCard}>
          <View style={styles.loanIconContainer}>
            <Text style={styles.loanIcon}>💳</Text>
          </View>

          <View style={styles.loanContent}>
            <Text style={styles.loanTitle}>Available Loan</Text>

            <Text style={styles.loanAmount}>R5,000.00</Text>

            <Text style={styles.loanDescription}>
              Based on your current savings
            </Text>
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.loanButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={goToLoans}
          >
            <Text style={styles.loanButtonText}>VIEW</Text>
          </Pressable>
        </View>

        {/* ======================================
            QUICK ACTIONS
        ====================================== */}

        <Text style={styles.sectionTitle}>Quick Actions</Text>

        <View style={styles.actionsGrid}>
          {/* Add Contribution */}

          <Pressable
            style={({ pressed }) => [
              styles.actionCard,
              pressed && styles.buttonPressed,
            ]}
            onPress={goToContributions}
          >
            <View style={styles.actionIconGreen}>
              <Text style={styles.actionIconText}>+</Text>
            </View>

            <Text style={styles.actionTitle}>Add Contribution</Text>

            <Text style={styles.actionDescription}>Make a contribution</Text>
          </Pressable>

          {/* Request Loan */}

          <Pressable
            style={({ pressed }) => [
              styles.actionCard,
              pressed && styles.buttonPressed,
            ]}
            onPress={() => router.push("/loans/request")}
          >
            <View style={styles.actionIconBlue}>
              <Text style={[styles.actionIconText, styles.blueIconText]}>
                R
              </Text>
            </View>

            <Text style={styles.actionTitle}>Request Loan</Text>

            <Text style={styles.actionDescription}>Apply for a loan</Text>
          </Pressable>

          {/* My Groups */}

          <Pressable
            style={({ pressed }) => [
              styles.actionCard,
              pressed && styles.buttonPressed,
            ]}
            onPress={goToGroups}
          >
            <View style={styles.actionIconPurple}>
              <Text style={[styles.actionIconText, styles.purpleIconText]}>
                G
              </Text>
            </View>

            <Text style={styles.actionTitle}>My Groups</Text>

            <Text style={styles.actionDescription}>View your groups</Text>
          </Pressable>

          {/* Transactions */}

          <Pressable
            style={({ pressed }) => [
              styles.actionCard,
              pressed && styles.buttonPressed,
            ]}
            onPress={goToTransactions}
          >
            <View style={styles.actionIconOrange}>
              <Text style={[styles.actionIconText, styles.orangeIconText]}>
                $
              </Text>
            </View>

            <Text style={styles.actionTitle}>Transactions</Text>

            <Text style={styles.actionDescription}>
              View transaction history
            </Text>
          </Pressable>
        </View>

        {/* ======================================
            RECENT TRANSACTIONS HEADER
        ====================================== */}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>

          <Pressable onPress={goToTransactions}>
            <Text style={styles.viewAllText}>View All</Text>
          </Pressable>
        </View>

        {/* ======================================
            TRANSACTION 1
        ====================================== */}

        <View style={styles.transactionCard}>
          <View style={styles.transactionIconGreen}>
            <Text style={styles.transactionIconText}>↑</Text>
          </View>

          <View style={styles.transactionContent}>
            <Text style={styles.transactionTitle}>Monthly Contribution</Text>

            <Text style={styles.transactionDate}>01 October 2026</Text>
          </View>

          <View style={styles.transactionAmountContainer}>
            <Text style={styles.transactionPositive}>+R500.00</Text>

            <Text style={styles.completedText}>Completed</Text>
          </View>
        </View>

        {/* ======================================
            TRANSACTION 2
        ====================================== */}

        <View style={styles.transactionCard}>
          <View style={styles.transactionIconOrange}>
            <Text style={styles.transactionIconText}>↓</Text>
          </View>

          <View style={styles.transactionContent}>
            <Text style={styles.transactionTitle}>Loan Repayment</Text>

            <Text style={styles.transactionDate}>28 September 2026</Text>
          </View>

          <View style={styles.transactionAmountContainer}>
            <Text style={styles.transactionNegative}>-R300.00</Text>

            <Text style={styles.completedText}>Completed</Text>
          </View>
        </View>

        {/* ======================================
            MY GROUP
        ====================================== */}

        <Text style={styles.sectionTitle}>My Group</Text>

        <View style={styles.groupCard}>
          <View style={styles.groupAvatar}>
            <Text style={styles.groupAvatarText}>SF</Text>
          </View>

          <View style={styles.groupContent}>
            <Text style={styles.groupName}>Siyaphambili Stokfela</Text>

            <Text style={styles.groupMembers}>12 members</Text>
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.groupButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={goToGroups}
          >
            <Text style={styles.groupButtonText}>VIEW</Text>
          </Pressable>
        </View>

        {/* ======================================
            BOTTOM NAVIGATION
        ====================================== */}

        <View style={styles.bottomNavigation}>
          {/* Dashboard */}

          <Pressable style={styles.navItem}>
            <Text style={styles.navIconActive}>◉</Text>

            <Text style={styles.navTextActive}>Dashboard</Text>
          </Pressable>

          {/* Contributions */}

          <Pressable style={styles.navItem} onPress={goToContributions}>
            <Text style={styles.navIcon}>+</Text>

            <Text style={styles.navText}>Contributions</Text>
          </Pressable>

          {/* Loans */}

          <Pressable style={styles.navItem} onPress={goToLoans}>
            <Text style={styles.navIcon}>$</Text>

            <Text style={styles.navText}>Loans</Text>
          </Pressable>

          {/* Groups */}

          <Pressable style={styles.navItem} onPress={goToGroups}>
            <Text style={styles.navIcon}>G</Text>

            <Text style={styles.navText}>Groups</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}
