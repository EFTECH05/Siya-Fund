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

type IconName = React.ComponentProps<typeof Ionicons>["name"];

type NavigationItem = {
  label: string;
  icon: IconName;
  route: string;
};

const navigationItems: NavigationItem[] = [
  { label: "Dashboard", icon: "grid-outline", route: "/dashboard" },
  { label: "Contributions", icon: "wallet-outline", route: "/contributions" },
  { label: "Loans", icon: "cash-outline", route: "/loans" },
  { label: "Savings Groups", icon: "people-outline", route: "/groups" },
  { label: "Transactions", icon: "receipt-outline", route: "/transactions" },
];

const quickActions: NavigationItem[] = [
  { label: "Contribute", icon: "add-circle-outline", route: "/contributions" },
  { label: "Apply for a Loan", icon: "cash-outline", route: "/loans" },
  { label: "Savings Groups", icon: "people-outline", route: "/groups" },
  { label: "Transactions", icon: "receipt-outline", route: "/transactions" },
];

const financialSummaries = [
  {
    title: "Total Contributions",
    value: "R 0.00",
    caption: "Your contributions",
    icon: "wallet-outline" as IconName,
  },
  {
    title: "Active Loans",
    value: "0",
    caption: "Current loan accounts",
    icon: "cash-outline" as IconName,
  },
  {
    title: "Savings Groups",
    value: "0",
    caption: "Groups you're part of",
    icon: "people-outline" as IconName,
  },
];

export default function DashboardScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();

  const isDesktop = width >= 900;
  const [menuVisible, setMenuVisible] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const navigateTo = (route: string) => {
    setMenuVisible(false);
    router.push(route as never);
  };

  const performLogout = async () => {
    if (loggingOut) return;

    setLoggingOut(true);

    try {
      await logoutUser();
      setMenuVisible(false);
      router.replace("/login" as never);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Please try again.";

      if (Platform.OS === "web") {
        window.alert(`Unable to sign out: ${message}`);
      } else {
        Alert.alert("Sign out failed", message);
      }
    } finally {
      setLoggingOut(false);
    }
  };

  const confirmLogout = () => {
    if (Platform.OS === "web") {
      const confirmed = window.confirm(
        "Are you sure you want to sign out of Siya-Fund?",
      );

      if (confirmed) {
        void performLogout();
      }

      return;
    }

    Alert.alert("Sign out", "Are you sure you want to sign out of Siya-Fund?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign out",
        style: "destructive",
        onPress: () => void performLogout(),
      },
    ]);
  };

  const renderNavigation = (mobile = false) => (
    <>
      {navigationItems.map((item) => {
        const active = item.label === "Dashboard";

        return (
          <Pressable
            key={item.label}
            onPress={() => navigateTo(item.route)}
            accessibilityRole="button"
            accessibilityLabel={item.label}
            style={({ pressed }) => [
              mobile ? styles.mobileMenuItem : styles.sidebarItem,
              active &&
                (mobile
                  ? styles.mobileMenuItemActive
                  : styles.sidebarItemActive),
              pressed && styles.pressed,
            ]}
          >
            <Ionicons
              name={item.icon}
              size={20}
              color={active ? "#76E0A0" : "#98A8A4"}
            />
            <Text
              style={[
                mobile ? styles.mobileMenuText : styles.sidebarItemText,
                active && styles.navigationTextActive,
              ]}
            >
              {item.label}
            </Text>

            {active && <View style={styles.activeIndicator} />}
          </Pressable>
        );
      })}
    </>
  );

  return (
    <View style={styles.screen}>
      {isDesktop && (
        <View style={styles.sidebar}>
          <View style={styles.brand}>
            <Image source={siyaLogo} style={styles.logo} resizeMode="contain" />
            <View>
              <Text style={styles.brandName}>Siya-Fund</Text>
              <Text style={styles.brandCaption}>Community Finance</Text>
            </View>
          </View>

          <Text style={styles.sidebarSectionTitle}>WORKSPACE</Text>

          <View style={styles.sidebarNavigation}>{renderNavigation()}</View>

          <View style={styles.sidebarBottom}>
            <View style={styles.helpCard}>
              <Ionicons
                name="shield-checkmark-outline"
                size={22}
                color="#76E0A0"
              />
              <Text style={styles.helpTitle}>Your money, your future.</Text>
              <Text style={styles.helpText}>
                Build better financial habits with Siya-Fund.
              </Text>
            </View>

            <Pressable
              onPress={confirmLogout}
              disabled={loggingOut}
              style={({ pressed }) => [
                styles.logoutButton,
                pressed && styles.pressed,
                loggingOut && styles.disabled,
              ]}
            >
              <Ionicons name="log-out-outline" size={20} color="#F28B82" />
              <Text style={styles.logoutText}>
                {loggingOut ? "Signing out..." : "Sign out"}
              </Text>
            </Pressable>
          </View>
        </View>
      )}

      <View style={styles.main}>
        <View style={styles.topBar}>
          <View style={styles.topBarLeft}>
            {!isDesktop && (
              <Pressable
                onPress={() => setMenuVisible((visible) => !visible)}
                accessibilityRole="button"
                accessibilityLabel={
                  menuVisible ? "Close navigation menu" : "Open navigation menu"
                }
                style={styles.menuButton}
              >
                <Ionicons
                  name={menuVisible ? "close-outline" : "menu-outline"}
                  size={25}
                  color="#F3F7F5"
                />
              </Pressable>
            )}

            <View>
              <Text style={styles.topBarTitle}>Dashboard</Text>
              <Text style={styles.topBarSubtitle}>Your financial overview</Text>
            </View>
          </View>

          <View style={styles.profileBadge}>
            <Ionicons name="person-outline" size={19} color="#76E0A0" />
          </View>
        </View>

        {!isDesktop && menuVisible && (
          <View style={styles.mobileMenu}>
            <View style={styles.mobileMenuBrand}>
              <Image
                source={siyaLogo}
                style={styles.mobileLogo}
                resizeMode="contain"
              />
              <View>
                <Text style={styles.brandName}>Siya-Fund</Text>
                <Text style={styles.brandCaption}>Community Finance</Text>
              </View>
            </View>

            {renderNavigation(true)}

            <Pressable
              onPress={confirmLogout}
              disabled={loggingOut}
              style={({ pressed }) => [
                styles.mobileLogoutButton,
                pressed && styles.pressed,
                loggingOut && styles.disabled,
              ]}
            >
              <Ionicons name="log-out-outline" size={20} color="#F28B82" />
              <Text style={styles.logoutText}>
                {loggingOut ? "Signing out..." : "Sign out"}
              </Text>
            </Pressable>
          </View>
        )}

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[
            styles.content,
            !isDesktop && styles.mobileContent,
          ]}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.welcomeSection}>
            <View style={styles.welcomeTextContainer}>
              <Text style={styles.welcomeTitle}>Welcome back!</Text>
              <Text style={styles.welcomeSubtitle}>
                Here's what's happening with your finances.
              </Text>
            </View>

            <View style={styles.secureBadge}>
              <Ionicons
                name="shield-checkmark-outline"
                size={15}
                color="#76E0A0"
              />
              <Text style={styles.secureBadgeText}>Secure account</Text>
            </View>
          </View>

          <View style={styles.balanceCard}>
            <View style={styles.balanceCardTop}>
              <View>
                <Text style={styles.balanceLabel}>TOTAL SAVINGS</Text>
                <View style={styles.balanceValueRow}>
                  <Text style={styles.balanceAmount}>R 0.00</Text>
                  <View style={styles.currencyBadge}>
                    <Text style={styles.currencyBadgeText}>ZAR</Text>
                  </View>
                </View>
                <Text style={styles.balanceCaption}>Your savings overview</Text>
              </View>

              <View style={styles.balanceIcon}>
                <Ionicons name="wallet-outline" size={25} color="#76E0A0" />
              </View>
            </View>

            <View style={styles.chartArea}>
              <View style={styles.chartHeader}>
                <Text style={styles.chartTitle}>Savings trend</Text>
                <View style={styles.chartLegend}>
                  <View style={styles.legendDot} />
                  <Text style={styles.chartLegendText}>Savings</Text>
                </View>
              </View>

              <View
                style={styles.chart}
                accessibilityLabel="Decorative savings trend chart"
              >
                {[24, 36, 30, 48, 42, 61, 53, 74, 64, 86, 75, 100].map(
                  (height, index) => (
                    <View key={index} style={styles.chartColumn}>
                      <View
                        style={[
                          styles.chartBar,
                          { height: `${height}%` },
                          index === 11 && styles.chartBarHighlight,
                        ]}
                      />
                    </View>
                  ),
                )}
              </View>

              <View style={styles.chartFooter}>
                <Text style={styles.chartFooterText}>Start saving today</Text>
                <Ionicons
                  name="trending-up-outline"
                  size={17}
                  color="#76E0A0"
                />
              </View>
            </View>
          </View>

          <View style={styles.sectionHeading}>
            <View>
              <Text style={styles.sectionTitle}>Financial overview</Text>
              <Text style={styles.sectionSubtitle}>
                A quick look at your account
              </Text>
            </View>
          </View>

          <View style={styles.summaryGrid}>
            {financialSummaries.map((item) => (
              <View key={item.title} style={styles.summaryCard}>
                <View style={styles.summaryCardTop}>
                  <View style={styles.summaryIcon}>
                    <Ionicons name={item.icon} size={20} color="#76E0A0" />
                  </View>
                  <Ionicons
                    name="ellipsis-horizontal"
                    size={19}
                    color="#647873"
                  />
                </View>

                <Text style={styles.summaryValue}>{item.value}</Text>
                <Text style={styles.summaryTitle}>{item.title}</Text>
                <Text style={styles.summaryCaption}>{item.caption}</Text>
              </View>
            ))}
          </View>

          <View style={styles.sectionHeading}>
            <View>
              <Text style={styles.sectionTitle}>Quick actions</Text>
              <Text style={styles.sectionSubtitle}>
                What would you like to do today?
              </Text>
            </View>
          </View>

          <View style={styles.actionsGrid}>
            {quickActions.map((item) => (
              <Pressable
                key={item.label}
                onPress={() => navigateTo(item.route)}
                accessibilityRole="button"
                style={({ pressed }) => [
                  styles.actionCard,
                  pressed && styles.actionCardPressed,
                ]}
              >
                <View style={styles.actionIcon}>
                  <Ionicons name={item.icon} size={22} color="#76E0A0" />
                </View>

                <Text style={styles.actionTitle}>{item.label}</Text>

                <View style={styles.actionArrow}>
                  <Ionicons
                    name="arrow-forward-outline"
                    size={17}
                    color="#98A8A4"
                  />
                </View>
              </Pressable>
            ))}
          </View>

          <View style={styles.sectionHeading}>
            <View>
              <Text style={styles.sectionTitle}>Recent activity</Text>
              <Text style={styles.sectionSubtitle}>
                Your latest account activity
              </Text>
            </View>

            <Pressable
              onPress={() => navigateTo("/transactions")}
              style={styles.viewAllButton}
            >
              <Text style={styles.viewAllText}>View all</Text>
              <Ionicons
                name="arrow-forward-outline"
                size={15}
                color="#76E0A0"
              />
            </Pressable>
          </View>

          <View style={styles.activityCard}>
            <View style={styles.activityIcon}>
              <Ionicons name="receipt-outline" size={24} color="#76E0A0" />
            </View>
            <Text style={styles.activityTitle}>No recent activity</Text>
            <Text style={styles.activityDescription}>
              Your contributions and transactions will appear here when
              available.
            </Text>
          </View>

          <Text style={styles.footerText}>
            Siya-Fund · Your community, your future.
          </Text>
        </ScrollView>

        {!isDesktop && (
          <View style={styles.bottomNav}>
            {[
              {
                label: "Home",
                icon: "home-outline" as IconName,
                route: "/dashboard",
              },
              {
                label: "Savings",
                icon: "wallet-outline" as IconName,
                route: "/contributions",
              },
              {
                label: "Loans",
                icon: "cash-outline" as IconName,
                route: "/loans",
              },
              {
                label: "Groups",
                icon: "people-outline" as IconName,
                route: "/groups",
              },
              {
                label: "Profile",
                icon: "person-outline" as IconName,
                route: "/profile",
              },
            ].map((item) => {
              const active = item.label === "Home";

              return (
                <Pressable
                  key={item.label}
                  onPress={() => navigateTo(item.route)}
                  accessibilityRole="button"
                  accessibilityLabel={item.label}
                  style={styles.mobileNavItem}
                >
                  <Ionicons
                    name={item.icon}
                    size={21}
                    color={active ? "#76E0A0" : "#82938E"}
                  />
                  <Text
                    style={[
                      styles.mobileNavText,
                      active && styles.mobileNavTextActive,
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
