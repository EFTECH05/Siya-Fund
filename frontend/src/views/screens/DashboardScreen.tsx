import React, { useState } from "react";
import {
  Alert,
  Image,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { logoutUser } from "../../services/AuthService";
import styles from "./DashboardScreen.styles";

const logo = require("../../../assets/images/siya-logo.png");

type MenuItem = {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  route: string;
};

const menuItems: MenuItem[] = [
  { label: "Dashboard", icon: "grid-outline", route: "/dashboard" },
  {
    label: "Contributions",
    icon: "wallet-outline",
    route: "/contributions",
  },
  { label: "Loans", icon: "cash-outline", route: "/loans" },
  { label: "Groups", icon: "people-outline", route: "/groups" },
  {
    label: "Transactions",
    icon: "swap-horizontal-outline",
    route: "/transactions",
  },
  { label: "Profile", icon: "person-circle-outline", route: "/profile" },
];

const quickActions = [
  {
    title: "Groups",
    subtitle: "Manage your groups",
    icon: "people-outline" as const,
    route: "/groups",
  },
  {
    title: "Contributions",
    subtitle: "View contributions",
    icon: "wallet-outline" as const,
    route: "/contributions",
  },
  {
    title: "Transactions",
    subtitle: "View transactions",
    icon: "swap-horizontal-outline" as const,
    route: "/transactions",
  },
  {
    title: "Loans",
    subtitle: "Manage your loans",
    icon: "cash-outline" as const,
    route: "/loans",
  },
];

export default function DashboardScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();

  const isDesktop = width >= 900;
  const isMobile = width < 600;

  const [menuOpen, setMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const navigateTo = (route: string) => {
    setMenuOpen(false);
    router.push(route as never);
  };

  const performLogout = async () => {
    if (loggingOut) return;

    setLoggingOut(true);
    setMenuOpen(false);

    try {
      await logoutUser();
      router.replace("/login" as never);
    } catch (error) {
      console.error("Sign out failed:", error);

      const message =
        error instanceof Error ? error.message : "Please try again.";

      if (Platform.OS === "web") {
        window.alert(`Unable to sign out. ${message}`);
      } else {
        Alert.alert("Sign out failed", message);
      }
    } finally {
      setLoggingOut(false);
    }
  };

  const confirmLogout = () => {
    if (loggingOut) return;

    if (Platform.OS === "web") {
      const confirmed = window.confirm(
        "Are you sure you want to sign out of Siya-Fund?",
      );

      if (confirmed) {
        void performLogout();
      }

      return;
    }

    Alert.alert(
      "Confirm sign out",
      "Are you sure you want to sign out of Siya-Fund?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Sign out",
          style: "destructive",
          onPress: () => {
            void performLogout();
          },
        },
      ],
      { cancelable: true },
    );
  };

  const renderMenuItem = (item: MenuItem) => (
    <Pressable
      key={item.label}
      onPress={() => navigateTo(item.route)}
      style={({ pressed }) => [
        styles.sidebarItem,
        item.label === "Dashboard" && styles.sidebarItemActive,
        pressed && styles.pressed,
      ]}
      accessibilityRole="button"
      accessibilityLabel={item.label}
    >
      <Ionicons
        name={item.icon}
        size={20}
        color={item.label === "Dashboard" ? "#39D98A" : "#A9B5C8"}
      />
      <Text
        style={[
          styles.sidebarItemText,
          item.label === "Dashboard" && styles.sidebarItemTextActive,
        ]}
      >
        {item.label}
      </Text>
      {item.label === "Dashboard" && <View style={styles.activeIndicator} />}
    </Pressable>
  );

  const renderSignOutButton = (compact = false) => (
    <Pressable
      onPress={confirmLogout}
      disabled={loggingOut}
      accessibilityRole="button"
      accessibilityLabel="Sign out"
      style={({ pressed }) => [
        styles.signOutButton,
        compact && styles.mobileSignOutButton,
        pressed && styles.pressed,
        loggingOut && styles.disabled,
      ]}
    >
      <Ionicons name="log-out-outline" size={20} color="#F28B82" />
      <Text style={styles.signOutText}>
        {loggingOut ? "Signing out..." : "Sign Out"}
      </Text>
    </Pressable>
  );

  const renderSidebar = () => (
    <View style={styles.sidebar}>
      <Pressable
        style={styles.brand}
        onPress={() => navigateTo("/dashboard")}
        accessibilityRole="button"
        accessibilityLabel="Siya-Fund dashboard"
      >
        <Image source={logo} style={styles.logo} resizeMode="contain" />
        <View style={styles.brandTextContainer}>
          <Text style={styles.brandName}>
            Siya<Text style={styles.brandNameAccent}>Fund</Text>
          </Text>
          <Text style={styles.brandSubtitle}>SMART STOKVEL MANAGEMENT</Text>
        </View>
      </Pressable>

      <Text style={styles.menuHeading}>MAIN MENU</Text>

      <View style={styles.sidebarNavigation}>
        {menuItems.map(renderMenuItem)}
      </View>

      <View style={styles.sidebarFooter}>
        <View style={styles.sidebarFooterDivider} />
        {renderSignOutButton()}
        <Text style={styles.versionText}>Siya-Fund • Secure savings</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.screen}>
      {isDesktop && renderSidebar()}

      <View style={styles.mainArea}>
        {/* Top bar: deliberately no Sign Out button here */}
        <View style={styles.topBar}>
          <View style={styles.topBarLeft}>
            {!isDesktop && (
              <Pressable
                onPress={() => setMenuOpen((open) => !open)}
                style={({ pressed }) => [
                  styles.menuButton,
                  pressed && styles.pressed,
                ]}
                accessibilityRole="button"
                accessibilityLabel="Open navigation menu"
              >
                <Ionicons
                  name={menuOpen ? "close" : "menu"}
                  size={25}
                  color="#F4F7FC"
                />
              </Pressable>
            )}

            <View>
              <Text style={styles.topBarTitle}>Dashboard</Text>
              <Text style={styles.topBarSubtitle}>
                Your savings at a glance
              </Text>
            </View>
          </View>

          <View style={styles.topBarRight}>
            <View style={styles.secureBadge}>
              <Ionicons
                name="shield-checkmark-outline"
                size={15}
                color="#39D98A"
              />
              {!isMobile && (
                <Text style={styles.secureBadgeText}>Secure account</Text>
              )}
            </View>

            <Pressable
              onPress={() => navigateTo("/profile")}
              style={({ pressed }) => [
                styles.profileButton,
                pressed && styles.pressed,
              ]}
              accessibilityRole="button"
              accessibilityLabel="Open profile"
            >
              <Ionicons name="person-outline" size={20} color="#E8EDF6" />
            </Pressable>
          </View>
        </View>

        {/* Mobile navigation menu */}
        {!isDesktop && menuOpen && (
          <View style={styles.mobileMenu}>
            <ScrollView
              style={styles.mobileMenuScroll}
              showsVerticalScrollIndicator={false}
            >
              <Text style={styles.menuHeading}>NAVIGATION</Text>

              {menuItems.map(renderMenuItem)}
            </ScrollView>

            {/* Sign Out is at the bottom of the menu, not the top bar */}
            <View style={styles.mobileMenuFooter}>
              <View style={styles.sidebarFooterDivider} />
              {renderSignOutButton(true)}
            </View>
          </View>
        )}

        <ScrollView
          style={styles.contentScroll}
          contentContainerStyle={[
            styles.contentContainer,
            !isDesktop && styles.mobileContentContainer,
          ]}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.welcomeSection}>
            <View style={styles.welcomeTextContainer}>
              <Text style={styles.welcomeEyebrow}>YOUR FINANCIAL SPACE</Text>
              <Text style={styles.welcomeTitle}>Welcome back 👋</Text>
              <Text style={styles.welcomeSubtitle}>
                Keep building your savings, one step at a time.
              </Text>
            </View>

            <View style={styles.growthBadge}>
              <Ionicons name="trending-up-outline" size={23} color="#39D98A" />
              <View>
                <Text style={styles.growthBadgeTitle}>Grow Together</Text>
                <Text style={styles.growthBadgeSubtitle}>Prosper Together</Text>
              </View>
            </View>
          </View>

          {/* Balance card */}
          <View style={styles.balanceCard}>
            <View style={styles.balanceCardContent}>
              <View style={styles.balanceLabelRow}>
                <Text style={styles.balanceLabel}>TOTAL SAVINGS</Text>
                <Ionicons name="wallet-outline" size={22} color="#39D98A" />
              </View>

              <Text style={styles.balanceAmount}>R 0.00</Text>
              <Text style={styles.balanceNote}>
                Your combined savings balance
              </Text>

              <View style={styles.balanceDivider} />

              <View style={styles.balanceFooter}>
                <View style={styles.balanceStatusDot} />
                <Text style={styles.balanceStatusText}>
                  Your savings overview
                </Text>
              </View>
            </View>

            <View style={styles.chartArea}>
              <View style={styles.chartHeader}>
                <Ionicons
                  name="stats-chart-outline"
                  size={16}
                  color="#39D98A"
                />
                <Text style={styles.chartLabel}>SAVINGS OVERVIEW</Text>
              </View>

              <View style={styles.chartBars}>
                {[25, 39, 31, 48, 43, 62, 53, 75, 65, 88].map(
                  (height, index) => (
                    <View
                      key={`${height}-${index}`}
                      style={styles.chartBarTrack}
                    >
                      <View
                        style={[
                          styles.chartBar,
                          { height: `${height}%` },
                          index === 9 && styles.chartBarHighlighted,
                        ]}
                      />
                    </View>
                  ),
                )}
              </View>

              <Text style={styles.chartCaption}>Keep saving consistently</Text>
            </View>
          </View>

          {/* Summary cards */}
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Financial Summary</Text>
              <Text style={styles.sectionSubtitle}>
                A quick look at your account
              </Text>
            </View>
          </View>

          <View style={styles.summaryGrid}>
            <View style={styles.summaryCard}>
              <View
                style={[styles.summaryIcon, { backgroundColor: "#153C31" }]}
              >
                <Ionicons name="wallet-outline" size={21} color="#39D98A" />
              </View>
              <Text style={styles.summaryLabel}>Contributions</Text>
              <Text style={styles.summaryValue}>R 0.00</Text>
              <Text style={styles.summaryFootnote}>Total recorded</Text>
            </View>

            <View style={styles.summaryCard}>
              <View
                style={[styles.summaryIcon, { backgroundColor: "#26324F" }]}
              >
                <Ionicons name="cash-outline" size={21} color="#8EAEFF" />
              </View>
              <Text style={styles.summaryLabel}>Active Loans</Text>
              <Text style={styles.summaryValue}>0</Text>
              <Text style={styles.summaryFootnote}>Current loans</Text>
            </View>

            <View style={styles.summaryCard}>
              <View
                style={[styles.summaryIcon, { backgroundColor: "#3B2E4E" }]}
              >
                <Ionicons name="people-outline" size={21} color="#C6A2FF" />
              </View>
              <Text style={styles.summaryLabel}>Savings Groups</Text>
              <Text style={styles.summaryValue}>0</Text>
              <Text style={styles.summaryFootnote}>Groups joined</Text>
            </View>
          </View>

          {/* Quick actions */}
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Quick Actions</Text>
              <Text style={styles.sectionSubtitle}>Get to what you need</Text>
            </View>
          </View>

          <View style={styles.quickActionsGrid}>
            {quickActions.map((action) => (
              <Pressable
                key={action.title}
                onPress={() => navigateTo(action.route)}
                style={({ pressed }) => [
                  styles.quickActionCard,
                  pressed && styles.pressed,
                ]}
                accessibilityRole="button"
                accessibilityLabel={action.title}
              >
                <View style={styles.quickActionIcon}>
                  <Ionicons name={action.icon} size={23} color="#39D98A" />
                </View>

                <Text style={styles.quickActionTitle}>{action.title}</Text>
                <Text style={styles.quickActionSubtitle}>
                  {action.subtitle}
                </Text>

                <Ionicons
                  name="arrow-forward-outline"
                  size={17}
                  color="#39D98A"
                  style={styles.quickActionArrow}
                />
              </Pressable>
            ))}
          </View>

          {/* Recent activity */}
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Recent Activity</Text>
              <Text style={styles.sectionSubtitle}>
                Your latest account updates
              </Text>
            </View>
          </View>

          <View style={styles.activityCard}>
            <View style={styles.emptyActivityIcon}>
              <Ionicons name="receipt-outline" size={26} color="#71819A" />
            </View>
            <Text style={styles.emptyActivityTitle}>No recent activity</Text>
            <Text style={styles.emptyActivitySubtitle}>
              Your contributions and transactions will appear here when
              available.
            </Text>
          </View>

          <Text style={styles.footerNote}>
            Siya-Fund • Together, save, grow.
          </Text>
        </ScrollView>

        {/* Fixed mobile bottom navigation */}
        {!isDesktop && (
          <View style={styles.bottomNavigation}>
            {[
              {
                label: "Home",
                icon: "grid-outline" as const,
                route: "/dashboard",
              },
              {
                label: "Groups",
                icon: "people-outline" as const,
                route: "/groups",
              },
              {
                label: "Contribute",
                icon: "wallet-outline" as const,
                route: "/contributions",
              },
              {
                label: "Profile",
                icon: "person-outline" as const,
                route: "/profile",
              },
            ].map((item) => {
              const active = item.label === "Home";

              return (
                <Pressable
                  key={item.label}
                  onPress={() => navigateTo(item.route)}
                  style={({ pressed }) => [
                    styles.bottomNavItem,
                    pressed && styles.pressed,
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel={item.label}
                >
                  <Ionicons
                    name={item.icon}
                    size={21}
                    color={active ? "#39D98A" : "#8290A6"}
                  />
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
    </View>
  );
}
