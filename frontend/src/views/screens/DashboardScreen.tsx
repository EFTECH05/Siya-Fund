
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { router } from "expo-router";
import { styles } from "./DashboardScreen.styles";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../services/firebase";
import { loadProfile, logout } from "../../controllers/AuthController";

// ==========================================
// DASHBOARD SCREEN
// ==========================================
export default function DashboardScreen() {
  const [userName, setUserName] = useState("Welcome");
  const [ready, setReady] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState("");
  useEffect(() => {
    let active = true;
    const unsubscribe = onAuthStateChanged(auth, async user => {
      if (!user) { setReady(false); router.replace("/login"); return; }
      try {
        const profile = await loadProfile();
        if (active && auth.currentUser?.uid === user.uid) setUserName(profile.firstName || profile.displayName || "Welcome");
      } catch {
        if (active) setUserName(user.displayName || "Welcome");
      } finally {
        if (active && auth.currentUser?.uid === user.uid) setReady(true);
      }
    });
    return () => { active = false; unsubscribe(); };
  }, []);
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
  // LOG OUT
  // ==========================================
  const handleLogout = async () => {
    if (loggingOut) return;
    setLoggingOut(true); setLogoutError("");
    try { await logout(); router.replace("/login"); }
    catch { setLogoutError("We could not log you out. Please try again."); }
    finally { setLoggingOut(false); }
  };

  // ==========================================
  // SCREEN
  // ==========================================
  if (!ready) return <View style={styles.container}><ActivityIndicator accessibilityLabel="Loading dashboard" color="#15803d" /></View>;
  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <View>
            <Text style={styles.smallGreeting}>
              Welcome back,
            </Text>

            <Text style={styles.userName}>
              {userName} 👋
            </Text>
          </View>

          {/* NOTIFICATION */}
          <Pressable
            style={({ pressed }) => [
              styles.notificationButton,
              pressed && styles.buttonPressed,
            ]}
          >
            <Text style={styles.notificationIcon}>
              🔔
            </Text>

            <View style={styles.notificationDot} />
          </Pressable>
        </View>

        {/* TOTAL SAVINGS */}
        <View style={styles.savingsCard}>
          <View style={styles.savingsHeader}>
            <Text style={styles.savingsLabel}>
              Total Savings
            </Text>

            <Text style={styles.savingsIcon}>
              💰
            </Text>
          </View>

          <Text style={styles.savingsAmount}>
            R12,500.00
          </Text>

          <View style={styles.savingsFooter}>
            <View>
              <Text style={styles.savingsFooterLabel}>
                This Month
              </Text>

              <Text style={styles.savingsFooterValue}>
                + R500.00
              </Text>
            </View>

            <View style={styles.growthBadge}>
              <Text style={styles.growthText}>
                ↑ 4.2%
              </Text>
            </View>
          </View>
        </View>

        {/* FINANCIAL SUMMARY */}
        <Text style={styles.sectionTitle}>
          Financial Summary
        </Text>

        <View style={styles.summaryRow}>
          {/* CONTRIBUTIONS */}
          <View style={styles.summaryCard}>
            <View style={styles.summaryIconGreen}>
              <Text style={styles.summaryIconText}>
                ↑
              </Text>
            </View>

            <Text style={styles.summaryLabel}>
              Contributions
            </Text>

            <Text style={styles.summaryAmount}>
              R500.00
            </Text>

            <Text style={styles.summaryStatus}>
              This month
            </Text>
          </View>

          {/* OUTSTANDING LOAN */}
          <View style={styles.summaryCard}>
            <View style={styles.summaryIconOrange}>
              <Text
                style={[
                  styles.summaryIconText,
                  styles.orangeIconText,
                ]}
              >
                ↓
              </Text>
            </View>

            <Text style={styles.summaryLabel}>
              Outstanding Loan
            </Text>

            <Text style={styles.summaryAmount}>
              R2,000.00
            </Text>

            <Text style={styles.summaryStatus}>
              Active loan
            </Text>
          </View>
        </View>

        {/* AVAILABLE LOAN */}
        <View style={styles.loanCard}>
          <View style={styles.loanIconContainer}>
            <Text style={styles.loanIcon}>
              💳
            </Text>
          </View>

          <View style={styles.loanContent}>
            <Text style={styles.loanTitle}>
              Available Loan
            </Text>

            <Text style={styles.loanAmount}>
              R5,000.00
            </Text>

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
            <Text style={styles.loanButtonText}>
              VIEW
            </Text>
          </Pressable>
        </View>

        {/* QUICK ACTIONS */}
        <Text style={styles.sectionTitle}>
          Quick Actions
        </Text>

        <View style={styles.actionsGrid}>
          {/* ADD CONTRIBUTION */}
          <Pressable
            style={({ pressed }) => [
              styles.actionCard,
              pressed && styles.buttonPressed,
            ]}
            onPress={goToContributions}
          >
            <View style={styles.actionIconGreen}>
              <Text style={styles.actionIconText}>
                +
              </Text>
            </View>

            <Text style={styles.actionTitle}>
              Add Contribution
            </Text>

            <Text style={styles.actionDescription}>
              Make a contribution
            </Text>
          </Pressable>

          {/* REQUEST LOAN */}
          <Pressable
            style={({ pressed }) => [
              styles.actionCard,
              pressed && styles.buttonPressed,
            ]}
            onPress={() => router.push("/loans/request")}
          >
            <View style={styles.actionIconBlue}>
              <Text
                style={[
                  styles.actionIconText,
                  styles.blueIconText,
                ]}
              >
                R
              </Text>
            </View>

            <Text style={styles.actionTitle}>
              Request Loan
            </Text>

            <Text style={styles.actionDescription}>
              Apply for a loan
            </Text>
          </Pressable>

          {/* MY GROUPS */}
          <Pressable
            style={({ pressed }) => [
              styles.actionCard,
              pressed && styles.buttonPressed,
            ]}
            onPress={goToGroups}
          >
            <View style={styles.actionIconPurple}>
              <Text
                style={[
                  styles.actionIconText,
                  styles.purpleIconText,
                ]}
              >
                G
              </Text>
            </View>

            <Text style={styles.actionTitle}>
              My Groups
            </Text>

            <Text style={styles.actionDescription}>
              View your groups
            </Text>
          </Pressable>

          {/* TRANSACTIONS */}
          <Pressable
            style={({ pressed }) => [
              styles.actionCard,
              pressed && styles.buttonPressed,
            ]}
            onPress={goToTransactions}
          >
            <View style={styles.actionIconOrange}>
              <Text
                style={[
                  styles.actionIconText,
                  styles.orangeIconText,
                ]}
              >
                $
              </Text>
            </View>

            <Text style={styles.actionTitle}>
              Transactions
            </Text>

            <Text style={styles.actionDescription}>
              View transaction history
            </Text>
          </Pressable>
        </View>

        {/* RECENT TRANSACTIONS HEADER */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            Recent Transactions
          </Text>

          <Pressable onPress={goToTransactions}>
            <Text style={styles.viewAllText}>
              View All
            </Text>
          </Pressable>
        </View>

        {/* TRANSACTION 1 */}
        <View style={styles.transactionCard}>
          <View style={styles.transactionIconGreen}>
            <Text style={styles.transactionIconText}>
              ↑
            </Text>
          </View>

          <View style={styles.transactionContent}>
            <Text style={styles.transactionTitle}>
              Monthly Contribution
            </Text>

            <Text style={styles.transactionDate}>
              01 October 2026
            </Text>
          </View>

          <View style={styles.transactionAmountContainer}>
            <Text style={styles.transactionPositive}>
              +R500.00
            </Text>

            <Text style={styles.completedText}>
              Completed
            </Text>
          </View>
        </View>

        {/* TRANSACTION 2 */}
        <View style={styles.transactionCard}>
          <View style={styles.transactionIconOrange}>
            <Text style={styles.transactionIconText}>
              ↓
            </Text>
          </View>

          <View style={styles.transactionContent}>
            <Text style={styles.transactionTitle}>
              Loan Repayment
            </Text>

            <Text style={styles.transactionDate}>
              28 September 2026
            </Text>
          </View>

          <View style={styles.transactionAmountContainer}>
            <Text style={styles.transactionNegative}>
              -R300.00
            </Text>

            <Text style={styles.completedText}>
              Completed
            </Text>
          </View>
        </View>

        {/* MY GROUP */}
        <Text style={styles.sectionTitle}>
          My Group
        </Text>

        <View style={styles.groupCard}>
          <View style={styles.groupAvatar}>
            <Text style={styles.groupAvatarText}>
              SF
            </Text>
          </View>

          <View style={styles.groupContent}>
            <Text style={styles.groupName}>
              Siyaphambili Stokfela
            </Text>

            <Text style={styles.groupMembers}>
              12 members
            </Text>
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.groupButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={goToGroups}
          >
            <Text style={styles.groupButtonText}>
              VIEW
            </Text>
          </Pressable>
        </View>

        {/* LOG OUT BUTTON */}
        <Pressable style={styles.logoutButton} onPress={() => router.push("/profile")} accessibilityRole="button">
          <Text style={styles.logoutButtonText}>My Profile</Text>
        </Pressable>
        {!!logoutError && <Text accessibilityRole="alert">{logoutError}</Text>}
        <Pressable
          style={({ pressed }) => [
            styles.logoutButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={handleLogout}
          disabled={loggingOut}
        >
          <Text style={styles.logoutIcon}>
            ↪
          </Text>

          <Text style={styles.logoutButtonText}>
            {loggingOut ? "Logging out…" : "Log Out"}
          </Text>
        </Pressable>

        {/* BOTTOM NAVIGATION */}
        <View style={styles.bottomNavigation}>
          {/* DASHBOARD */}
          <Pressable style={styles.navItem}>
            <Text style={styles.navIconActive}>
              ◉
            </Text>

            <Text style={styles.navTextActive}>
              Dashboard
            </Text>
          </Pressable>

          {/* CONTRIBUTIONS */}
          <Pressable
            style={styles.navItem}
            onPress={goToContributions}
          >
            <Text style={styles.navIcon}>
              +
            </Text>

            <Text style={styles.navText}>
              Contributions
            </Text>
          </Pressable>

          {/* LOANS */}
          <Pressable
            style={styles.navItem}
            onPress={goToLoans}
          >
            <Text style={styles.navIcon}>
              $
            </Text>

            <Text style={styles.navText}>
              Loans
            </Text>
          </Pressable>

          {/* GROUPS */}
          <Pressable
            style={styles.navItem}
            onPress={goToGroups}
          >
            <Text style={styles.navIcon}>
              G
            </Text>

            <Text style={styles.navText}>
              Groups
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

