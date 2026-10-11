import React, { useState } from "react";
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { router } from "expo-router";
import styles from "./DashboardScreen.styles";

const transactions = [
  {
    id: "1",
    title: "Monthly contribution",
    subtitle: "Savings Group A",
    amount: "-R500.00",
    date: "Today",
    type: "out",
    symbol: "↗",
  },
  {
    id: "2",
    title: "Contribution received",
    subtitle: "Community Savings",
    amount: "+R1,200.00",
    date: "Yesterday",
    type: "in",
    symbol: "↙",
  },
  {
    id: "3",
    title: "Group savings",
    subtitle: "Family Savings",
    amount: "-R250.00",
    date: "08 Oct",
    type: "out",
    symbol: "↗",
  },
];

const quickActions = [
  { label: "Groups", symbol: "◫", route: "/groups" },
  { label: "Contribute", symbol: "+", route: "/contributions" },
  { label: "Transactions", symbol: "⇄", route: "/transactions" },
  { label: "Reports", symbol: "▤", route: "/reports" },
];

const navigationItems = [
  { label: "Dashboard", symbol: "⌂", route: "/dashboard" },
  { label: "Groups", symbol: "◫", route: "/groups" },
  { label: "Transactions", symbol: "⇄", route: "/transactions" },
  { label: "Profile", symbol: "○", route: "/profile" },
];

export default function DashboardScreen() {
  const { width } = useWindowDimensions();
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const isWeb = Platform.OS === "web";
  const isWide = width >= 900;
  const showMobileNav = !isWeb || width < 768;

  const navigateTo = (path: string) => {
    setDrawerOpen(false);
    router.push(path as never);
  };

  const confirmLogout = () => {
    setDrawerOpen(false);

    Alert.alert("Sign out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign out",
        style: "destructive",
        onPress: () => router.replace("/login" as never),
      },
    ]);
  };

  const displayBalance = (amount: string) =>
    balanceVisible ? amount : "••••••";

  return (
    <View style={styles.screen}>
      {isWeb && drawerOpen && (
        <Pressable
          style={styles.drawerOverlay}
          onPress={() => setDrawerOpen(false)}
        />
      )}

      {isWeb && (
        <View
          style={[
            styles.drawer,
            drawerOpen ? styles.drawerOpen : styles.drawerClosed,
          ]}
        >
          <View style={styles.drawerHeader}>
            <View style={styles.logoMark}>
              <Text style={styles.logoMarkText}>S</Text>
            </View>
            <View>
              <Text style={styles.brandName}>Siya-Fund</Text>
              <Text style={styles.brandSubtitle}>YOUR MONEY. YOUR FUTURE.</Text>
            </View>
          </View>

          <Text style={styles.drawerSectionLabel}>MENU</Text>

          {navigationItems.map((item) => (
            <Pressable
              key={item.label}
              style={[
                styles.drawerNavItem,
                item.label === "Dashboard" && styles.drawerNavItemActive,
              ]}
              onPress={() => navigateTo(item.route)}
            >
              <Text
                style={[
                  styles.drawerNavSymbol,
                  item.label === "Dashboard" && styles.drawerNavSymbolActive,
                ]}
              >
                {item.symbol}
              </Text>
              <Text
                style={[
                  styles.drawerNavText,
                  item.label === "Dashboard" && styles.drawerNavTextActive,
                ]}
              >
                {item.label}
              </Text>
            </Pressable>
          ))}

          <View style={styles.drawerSpacer} />

          <Pressable style={styles.logoutButton} onPress={confirmLogout}>
            <Text style={styles.logoutSymbol}>↪</Text>
            <Text style={styles.logoutText}>Sign out</Text>
          </Pressable>
        </View>
      )}

      <View style={[styles.main, isWeb && isWide && styles.mainWithWideDrawer]}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[
            styles.content,
            showMobileNav && styles.contentWithBottomNav,
          ]}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.topBar}>
            <View style={styles.topBarLeft}>
              {isWeb && (
                <Pressable
                  style={styles.menuButton}
                  onPress={() => setDrawerOpen(!drawerOpen)}
                >
                  <Text style={styles.menuButtonText}>☰</Text>
                </Pressable>
              )}

              <View>
                <Text style={styles.greeting}>Welcome back,</Text>
                <Text style={styles.pageTitle}>Your Dashboard</Text>
              </View>
            </View>

            <Pressable
              style={styles.profileButton}
              onPress={() => navigateTo("/profile")}
            >
              <Text style={styles.profileInitial}>U</Text>
            </Pressable>
          </View>

          <View style={styles.welcomeRow}>
            <View>
              <Text style={styles.welcomeTitle}>
                Take control of your money.
              </Text>
              <Text style={styles.welcomeSubtitle}>
                Here's an overview of your savings.
              </Text>
            </View>
            <View style={styles.statusBadge}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>Account active</Text>
            </View>
          </View>

          <View
            style={[styles.overviewGrid, isWide && styles.overviewGridWide]}
          >
            <View style={styles.balanceCard}>
              <View style={styles.balanceCardTop}>
                <View>
                  <Text style={styles.cardEyebrow}>TOTAL SAVINGS</Text>
                  <Text style={styles.balanceAmount}>
                    {displayBalance("R 12,450.00")}
                  </Text>
                  <View style={styles.trendRow}>
                    <Text style={styles.trendArrow}>↗</Text>
                    <Text style={styles.trendText}>8.4%</Text>
                    <Text style={styles.trendCaption}>this month</Text>
                  </View>
                </View>

                <Pressable
                  style={styles.visibilityButton}
                  onPress={() => setBalanceVisible(!balanceVisible)}
                  accessibilityLabel={
                    balanceVisible ? "Hide balance" : "Show balance"
                  }
                >
                  <Text style={styles.visibilityIcon}>
                    {balanceVisible ? "◉" : "◎"}
                  </Text>
                </Pressable>
              </View>

              <View style={styles.chartArea}>
                <View style={styles.chartLabels}>
                  <Text style={styles.chartLabel}>SAVINGS GROWTH</Text>
                  <Text style={styles.chartPeriod}>LAST 7 MONTHS</Text>
                </View>
                <View style={styles.chartBars}>
                  {[35, 48, 42, 60, 53, 75, 92].map((height, index) => (
                    <View key={index} style={styles.chartBarTrack}>
                      <View
                        style={[
                          styles.chartBar,
                          { height: `${height}%` },
                          index === 6 && styles.chartBarActive,
                        ]}
                      />
                    </View>
                  ))}
                </View>
                <View style={styles.chartMonths}>
                  {["APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT"].map(
                    (month) => (
                      <Text key={month} style={styles.chartMonth}>
                        {month}
                      </Text>
                    ),
                  )}
                </View>
              </View>
            </View>

            <View style={styles.summaryColumn}>
              <View style={styles.summaryCard}>
                <View style={styles.summaryIconGreen}>
                  <Text style={styles.summaryIconText}>↗</Text>
                </View>
                <Text style={styles.summaryLabel}>Total contributions</Text>
                <Text style={styles.summaryAmount}>
                  {displayBalance("R 8,250.00")}
                </Text>
                <Text style={styles.summaryCaption}>Across your groups</Text>
              </View>

              <View style={styles.summaryCard}>
                <View style={styles.summaryIconBlue}>
                  <Text style={styles.summaryIconText}>◫</Text>
                </View>
                <Text style={styles.summaryLabel}>Active groups</Text>
                <Text style={styles.summaryAmount}>03</Text>
                <Text style={styles.summaryCaption}>Groups you belong to</Text>
              </View>
            </View>
          </View>

          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Quick actions</Text>
              <Text style={styles.sectionSubtitle}>Manage your finances</Text>
            </View>
          </View>

          <View style={styles.actionsGrid}>
            {quickActions.map((action) => (
              <Pressable
                key={action.label}
                style={[styles.actionCard, { width: isWide ? "23.5%" : "48%" }]}
                onPress={() => navigateTo(action.route)}
              >
                <View style={styles.actionIcon}>
                  <Text style={styles.actionIconText}>{action.symbol}</Text>
                </View>
                <Text style={styles.actionLabel}>{action.label}</Text>
                <Text style={styles.actionArrow}>↗</Text>
              </Pressable>
            ))}
          </View>

          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Recent transactions</Text>
              <Text style={styles.sectionSubtitle}>
                Keep track of your money
              </Text>
            </View>
            <Pressable onPress={() => navigateTo("/transactions")}>
              <Text style={styles.viewAll}>View all ↗</Text>
            </Pressable>
          </View>

          <View style={styles.transactionsCard}>
            {transactions.map((transaction, index) => (
              <View
                key={transaction.id}
                style={[
                  styles.transactionRow,
                  index === transactions.length - 1 &&
                    styles.transactionRowLast,
                ]}
              >
                <View
                  style={[
                    styles.transactionIcon,
                    transaction.type === "in"
                      ? styles.transactionIconIn
                      : styles.transactionIconOut,
                  ]}
                >
                  <Text
                    style={[
                      styles.transactionSymbol,
                      transaction.type === "in"
                        ? styles.amountPositive
                        : styles.amountNegative,
                    ]}
                  >
                    {transaction.symbol}
                  </Text>
                </View>

                <View style={styles.transactionDetails}>
                  <Text style={styles.transactionTitle}>
                    {transaction.title}
                  </Text>
                  <Text style={styles.transactionSubtitle}>
                    {transaction.subtitle}
                  </Text>
                </View>

                <View style={styles.transactionRight}>
                  <Text
                    style={[
                      styles.transactionAmount,
                      transaction.type === "in"
                        ? styles.amountPositive
                        : styles.amountNegative,
                    ]}
                  >
                    {displayBalance(transaction.amount)}
                  </Text>
                  <Text style={styles.transactionDate}>{transaction.date}</Text>
                </View>
              </View>
            ))}
          </View>

          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Your savings groups</Text>
              <Text style={styles.sectionSubtitle}>
                Stay connected to your goals
              </Text>
            </View>
            <Pressable onPress={() => navigateTo("/groups")}>
              <Text style={styles.viewAll}>View all ↗</Text>
            </Pressable>
          </View>

          <Pressable
            style={styles.groupCard}
            onPress={() => navigateTo("/groups")}
          >
            <View style={styles.groupIcon}>
              <Text style={styles.groupIconText}>◫</Text>
            </View>
            <View style={styles.groupDetails}>
              <Text style={styles.groupTitle}>Community Savings</Text>
              <Text style={styles.groupSubtitle}>
                8 members · Monthly contributions
              </Text>
              <View style={styles.progressTrack}>
                <View style={styles.progressFill} />
              </View>
              <Text style={styles.progressCaption}>
                68% of group savings goal
              </Text>
            </View>
            <Text style={styles.groupArrow}>›</Text>
          </Pressable>

          <Text style={styles.footerText}>
            Siya-Fund · Building better financial futures
          </Text>
        </ScrollView>
      </View>

      {showMobileNav && (
        <View style={styles.bottomNav}>
          {navigationItems.map((item) => {
            const active = item.label === "Dashboard";

            return (
              <Pressable
                key={item.label}
                style={styles.bottomNavItem}
                onPress={() => navigateTo(item.route)}
              >
                <Text
                  style={[
                    styles.bottomNavSymbol,
                    active && styles.bottomNavSymbolActive,
                  ]}
                >
                  {item.symbol}
                </Text>
                <Text
                  style={[
                    styles.bottomNavLabel,
                    active && styles.bottomNavLabelActive,
                  ]}
                >
                  {item.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      )}
    </View>
  );
}
