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
import { styles } from "./DashboardScreen.styles";

const siyaLogo = require("../../../assets/images/siya-logo.png");

const navigationItems = [
  { label: "Dashboard", icon: "grid-outline", route: "/dashboard" },
  { label: "My Savings", icon: "wallet-outline", route: "/savings" },
  { label: "Transactions", icon: "receipt-outline", route: "/transactions" },
  { label: "Profile", icon: "person-outline", route: "/profile" },
] as const;

const summaryItems = [
  { title: "Savings goals", value: "0", icon: "flag-outline" },
  { title: "Transactions", value: "0", icon: "swap-horizontal-outline" },
  { title: "Active plans", value: "0", icon: "calendar-outline" },
] as const;

export default function DashboardScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 900;

  const [menuVisible, setMenuVisible] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const performLogout = async () => {
    if (loggingOut) return;

    setLoggingOut(true);

    try {
      await logoutUser();
      setMenuVisible(false);
      router.replace("/login" as never);
    } catch (error) {
      console.error("Logout failed:", error);

      const message =
        error instanceof Error
          ? error.message
          : "Unable to log out. Please try again.";

      if (Platform.OS === "web") {
        window.alert(message);
      } else {
        Alert.alert("Logout failed", message);
      }
    } finally {
      setLoggingOut(false);
    }
  };

  const confirmLogout = () => {
    if (loggingOut) return;

    if (Platform.OS === "web") {
      if (window.confirm("Are you sure you want to log out?")) {
        void performLogout();
      }
      return;
    }

    Alert.alert("Log out", "Are you sure you want to log out of Siya-Fund?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log out",
        style: "destructive",
        onPress: () => void performLogout(),
      },
    ]);
  };

  const navigateTo = (route: string) => {
    setMenuVisible(false);
    router.push(route as never);
  };

  const renderNavigation = () => (
    <View>
      {navigationItems.map((item) => {
        const active = item.label === "Dashboard";

        return (
          <Pressable
            key={item.label}
            onPress={() => navigateTo(item.route)}
            style={({ pressed }) => [
              styles.sidebarNavItem,
              active && styles.sidebarNavItemActive,
              pressed && styles.pressed,
            ]}
          >
            <Ionicons
              name={item.icon as never}
              size={19}
              color={active ? "#49E39A" : "#A0AAB8"}
            />
            <Text
              style={[
                styles.sidebarNavText,
                active && styles.sidebarNavTextActive,
              ]}
            >
              {item.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );

  const renderLogoutButton = (mobile = false) => (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Log out of Siya-Fund"
      disabled={loggingOut}
      onPress={confirmLogout}
      style={({ pressed }) => [
        styles.logoutButton,
        mobile && styles.mobileLogoutButton,
        loggingOut && styles.disabledButton,
        pressed && styles.pressed,
      ]}
    >
      <Ionicons name="log-out-outline" size={19} color="#FF7777" />
      <Text style={styles.logoutButtonText}>
        {loggingOut ? "Logging out..." : "Logout"}
      </Text>
    </Pressable>
  );

  return (
    <View
      style={[styles.screen, { flexDirection: isDesktop ? "row" : "column" }]}
    >
      {isDesktop && (
        <View style={styles.sidebar}>
          <View style={styles.sidebarTop}>
            <Image
              source={siyaLogo}
              resizeMode="contain"
              style={styles.sidebarLogo}
            />

            <Text style={styles.sidebarCaption}>
              SMART SAVING. STRONGER FUTURES.
            </Text>

            <View style={styles.sidebarDivider} />

            <Text style={styles.sidebarSectionLabel}>MENU</Text>

            {renderNavigation()}
          </View>

          <View style={styles.sidebarBottom}>
            <View style={styles.helpCard}>
              <Text style={styles.helpTitle}>Need help?</Text>
              <Text style={styles.helpDescription}>
                Manage your savings and keep track of your financial goals.
              </Text>
            </View>

            {renderLogoutButton()}

            <Text style={styles.sidebarFooter}>
              Siya-Fund · Your future matters
            </Text>
          </View>
        </View>
      )}

      <View style={styles.main}>
        <View style={styles.topBar}>
          {isDesktop ? (
            <View>
              <Text style={styles.topBarEyebrow}>YOUR FINANCIAL OVERVIEW</Text>
              <Text style={styles.topBarTitle}>My Dashboard</Text>
            </View>
          ) : (
            <Image
              source={siyaLogo}
              resizeMode="contain"
              style={styles.mobileLogo}
            />
          )}

          <View style={styles.topBarRight}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Notifications"
              style={styles.iconButton}
            >
              <Ionicons
                name="notifications-outline"
                size={20}
                color="#D9E2EC"
              />
              <View style={styles.notificationDot} />
            </Pressable>

            <View style={styles.avatar}>
              <Text style={styles.avatarText}>S</Text>
            </View>

            {!isDesktop && (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={menuVisible ? "Close menu" : "Open menu"}
                onPress={() => setMenuVisible((visible) => !visible)}
                style={styles.iconButton}
              >
                <Ionicons
                  name={menuVisible ? "close" : "menu"}
                  size={23}
                  color="#FFFFFF"
                />
              </Pressable>
            )}
          </View>
        </View>

        {!isDesktop && menuVisible && (
          <View style={styles.mobileMenu}>
            {renderNavigation()}
            {renderLogoutButton(true)}
          </View>
        )}

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[
            styles.content,
            !isDesktop && styles.mobileContent,
          ]}
        >
          <View style={styles.welcomeRow}>
            <View style={styles.welcomeTextContainer}>
              <Text style={styles.welcomeEyebrow}>WELCOME BACK</Text>
              <Text style={styles.welcomeTitle}>Your money, your future.</Text>
              <Text style={styles.welcomeSubtitle}>
                Keep building healthy saving habits, one step at a time.
              </Text>
            </View>

            <View style={styles.statusPill}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>ACCOUNT OVERVIEW</Text>
            </View>
          </View>

          <View style={styles.balanceCard}>
            <View style={styles.balanceCardTop}>
              <View>
                <Text style={styles.balanceLabel}>TOTAL SAVINGS</Text>
                <View style={styles.balanceAmountRow}>
                  <Text style={styles.balanceAmount}>R 0.00</Text>
                </View>
                <View style={styles.growthPill}>
                  <Ionicons name="trending-up" size={14} color="#A9EBC7" />
                  <Text style={styles.growthText}>
                    Your savings journey starts here
                  </Text>
                </View>
              </View>

              <View style={styles.balanceIcon}>
                <Ionicons name="wallet-outline" size={26} color="#49E39A" />
              </View>
            </View>

            <View style={styles.chartArea}>
              <View style={styles.chartLine} />
              <View style={styles.chartBars}>
                {[20, 34, 28, 46, 38, 58, 48, 68, 54, 75, 63, 85].map(
                  (height, index) => (
                    <View
                      key={index}
                      style={[styles.chartBar, { height: `${height}%` }]}
                    />
                  ),
                )}
              </View>
            </View>

            <View style={styles.chartFooter}>
              <Text style={styles.chartFooterText}>Savings overview</Text>
              <Text style={styles.chartFooterText}>Illustrative chart</Text>
            </View>
          </View>

          <View style={styles.summaryGrid}>
            {summaryItems.map((item, index) => (
              <View key={item.title} style={styles.summaryCard}>
                <View style={styles.summaryCardTop}>
                  <View
                    style={
                      index === 1
                        ? styles.summaryIconBlue
                        : styles.summaryIconGreen
                    }
                  >
                    <Ionicons
                      name={item.icon as never}
                      size={20}
                      color={index === 1 ? "#75B8FF" : "#49E39A"}
                    />
                  </View>
                  <Text style={styles.summaryLabel}>{item.title}</Text>
                </View>

                <Text style={styles.summaryAmount}>{item.value}</Text>
                <Text style={styles.summaryFootnote}>Overview information</Text>
              </View>
            ))}
          </View>

          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Quick actions</Text>
              <Text style={styles.sectionSubtitle}>
                Access your main saving tools.
              </Text>
            </View>
          </View>

          <View style={styles.quickActionsGrid}>
            {[
              {
                title: "My Savings",
                description: "Review your savings progress",
                icon: "wallet-outline",
                route: "/savings",
              },
              {
                title: "Transactions",
                description: "Review your financial activity",
                icon: "receipt-outline",
                route: "/transactions",
              },
              {
                title: "My Profile",
                description: "Manage your account details",
                icon: "person-outline",
                route: "/profile",
              },
            ].map((item) => (
              <Pressable
                key={item.title}
                onPress={() => navigateTo(item.route)}
                style={({ pressed }) => [
                  styles.quickActionCard,
                  pressed && styles.pressed,
                ]}
              >
                <View style={styles.quickActionIcon}>
                  <Ionicons
                    name={item.icon as never}
                    size={21}
                    color="#49E39A"
                  />
                </View>

                <View style={styles.quickActionCopy}>
                  <Text style={styles.quickActionTitle}>{item.title}</Text>
                  <Text style={styles.quickActionDescription}>
                    {item.description}
                  </Text>
                </View>

                <Ionicons name="chevron-forward" size={17} color="#8190A3" />
              </Pressable>
            ))}
          </View>

          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Recent activity</Text>
              <Text style={styles.sectionSubtitle}>
                Your latest account activity.
              </Text>
            </View>
          </View>

          <View style={styles.transactionsCard}>
            <View style={[styles.transactionRow, styles.transactionRowLast]}>
              <View style={styles.transactionIcon}>
                <Ionicons name="time-outline" size={21} color="#49E39A" />
              </View>
              <View style={styles.transactionDetails}>
                <Text style={styles.transactionTitle}>No recent activity</Text>
                <Text style={styles.transactionDate}>
                  Transactions will appear here when available.
                </Text>
              </View>
            </View>
          </View>

          {!isDesktop && (
            <View style={styles.mobileLogoutSection}>
              {renderLogoutButton(true)}
              <Text style={styles.mobileLogoutCaption}>
                Securely sign out of your Siya-Fund account.
              </Text>
            </View>
          )}

          <Text style={styles.pageFooter}>
            Siya-Fund · Your financial future matters.
          </Text>
        </ScrollView>
      </View>
    </View>
  );
}
