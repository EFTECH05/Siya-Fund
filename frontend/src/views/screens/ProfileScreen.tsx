
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { doc, getDoc } from "firebase/firestore";

import {
  getCurrentUser,
  getUserRole,
  logoutUser,
} from "../../services/AuthService";
import { db } from "../../services/firebase";
import styles from "./ProfileScreen.styles";

type ProfileData = {
  firstName: string;
  lastName: string;
  displayName: string;
  email: string;
  phone: string;
  role: string;
  emailVerified: boolean;
  createdAt: string;
};

const emptyProfile: ProfileData = {
  firstName: "",
  lastName: "",
  displayName: "",
  email: "",
  phone: "",
  role: "",
  emailVerified: false,
  createdAt: "",
};

function getText(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function formatDate(value: unknown): string {
  if (!value) return "";

  try {
    let date: Date;

    if (value instanceof Date) {
      date = value;
    } else if (
      typeof value === "object" &&
      value !== null &&
      "toDate" in value &&
      typeof value.toDate === "function"
    ) {
      date = value.toDate();
    } else if (
      typeof value === "string" ||
      typeof value === "number"
    ) {
      date = new Date(value);
    } else {
      return "";
    }

    if (Number.isNaN(date.getTime())) return "";

    return date.toLocaleDateString(undefined, {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

function formatRole(role: string): string {
  if (!role) return "Member";

  return role
    .split(/[_\s-]+/)
    .map(
      (part) =>
        part.charAt(0).toUpperCase() + part.slice(1)
    )
    .join(" ");
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) return "SF";

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export default function ProfileScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isCompact = width < 600;

  const [profile, setProfile] =
    useState<ProfileData>(emptyProfile);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadProfile = useCallback(async () => {
    setError("");

    try {
      const authUser = await Promise.resolve(getCurrentUser());

      if (!authUser) {
        router.replace("/login" as never);
        return;
      }

      const authName = authUser.displayName?.trim() ?? "";
      const authNameParts = authName
        .split(/\s+/)
        .filter(Boolean);

      let nextProfile: ProfileData = {
        ...emptyProfile,
        firstName: authNameParts[0] ?? "",
        lastName: authNameParts.slice(1).join(" "),
        displayName: authName,
        email: authUser.email ?? "",
        phone: authUser.phoneNumber ?? "",
        emailVerified: authUser.emailVerified,
        createdAt: formatDate(authUser.metadata.creationTime),
      };

      // Load the user's saved profile details from Firestore.
      try {
        const userRef = doc(db, "users", authUser.uid);
        const userSnapshot = await getDoc(userRef);

        if (userSnapshot.exists()) {
          const userData = userSnapshot.data();

          const firstName = getText(userData.firstName);
          const lastName = getText(userData.lastName);
          const displayName =
            getText(userData.displayName) ||
            [firstName, lastName].filter(Boolean).join(" ");

          nextProfile = {
            ...nextProfile,
            firstName: firstName || nextProfile.firstName,
            lastName: lastName || nextProfile.lastName,
            displayName: displayName || nextProfile.displayName,
            email: getText(userData.email) || nextProfile.email,
            phone:
              getText(userData.phone) ||
              getText(userData.phoneNumber) ||
              nextProfile.phone,
            emailVerified:
              typeof userData.emailVerified === "boolean"
                ? userData.emailVerified
                : authUser.emailVerified,
            createdAt:
              formatDate(userData.createdAt) ||
              nextProfile.createdAt,
          };
        }
      } catch (firestoreError) {
        console.error(
          "Could not load Firestore profile:",
          firestoreError
        );

        setError(
          "Some saved profile details could not be loaded. Showing available account information."
        );
      }

      // Keep using the existing account-role system.
      try {
        const role = await getUserRole();
        nextProfile.role = role || "user";
      } catch (roleError) {
        console.error("Could not load account role:", roleError);

        nextProfile.role = "user";

        setError(
          "Your account role could not be verified. Please refresh or sign in again."
        );
      }

      setProfile(nextProfile);
    } catch (loadError) {
      console.error("Profile loading failed:", loadError);
      setError("We couldn't load your account. Please try again.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [router]);

  useEffect(() => {
    void loadProfile();
  }, [loadProfile]);

  const handleRefresh = () => {
    setRefreshing(true);
    void loadProfile();
  };

  const goToDashboard = () => {
    router.replace("/dashboard" as never);
  };

  const performLogout = async () => {
    try {
      await logoutUser();
      router.replace("/login" as never);
    } catch (logoutError) {
      console.error("Sign-out failed:", logoutError);

      if (Platform.OS === "web") {
        window.alert(
          "We couldn't sign you out. Please try again."
        );
      } else {
        Alert.alert(
          "Sign-out failed",
          "We couldn't sign you out. Please try again."
        );
      }
    }
  };

  const confirmLogout = () => {
    if (Platform.OS === "web") {
      const confirmed = window.confirm(
        "Are you sure you want to sign out of Siya-Fund?"
      );

      if (confirmed) {
        void performLogout();
      }

      return;
    }

    Alert.alert(
      "Sign out",
      "Are you sure you want to sign out of Siya-Fund?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Sign out",
          style: "destructive",
          onPress: () => void performLogout(),
        },
      ]
    );
  };

  const fullName =
    profile.displayName ||
    [profile.firstName, profile.lastName]
      .filter(Boolean)
      .join(" ") ||
    "Siya-Fund Member";

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.loadingMark}>
          <Ionicons
            name="person-circle-outline"
            size={38}
            color="#46D39A"
          />
        </View>

        <ActivityIndicator
          size="large"
          color="#46D39A"
        />

        <Text style={styles.loadingText}>
          Preparing your profile...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[
        styles.content,
        isCompact && styles.contentCompact,
      ]}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          tintColor="#46D39A"
          colors={["#46D39A"]}
        />
      }
    >
      {/* Page heading and navigation */}
      <View
        style={[
          styles.header,
          isCompact && styles.headerCompact,
        ]}
      >
        <Pressable
          style={({ pressed }) => [
            styles.backButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={goToDashboard}
          accessibilityRole="button"
          accessibilityLabel="Back to dashboard"
          hitSlop={8}
        >
          <Ionicons
            name="arrow-back"
            size={22}
            color="#46D39A"
          />
        </Pressable>

        <View style={styles.headerCopy}>
          <Text style={styles.eyebrow}>YOUR ACCOUNT</Text>

          <Text style={styles.pageTitle}>My Profile</Text>

          <Text style={styles.subtitle}>
            Your personal details, account status and security.
          </Text>
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.refreshButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={handleRefresh}
          accessibilityRole="button"
          accessibilityLabel="Refresh profile"
          hitSlop={8}
        >
          <Ionicons
            name="refresh-outline"
            size={21}
            color="#46D39A"
          />
        </Pressable>
      </View>

      {/* Error or account notice */}
      {error ? (
        <View style={styles.notice}>
          <Ionicons
            name="information-circle-outline"
            size={21}
            color="#F2C879"
          />

          <Text style={styles.noticeText}>{error}</Text>
        </View>
      ) : null}

      {/* Profile identity */}
      <View
        style={[
          styles.profileCard,
          isCompact && styles.profileCardCompact,
        ]}
      >
        <View style={styles.avatarWrap}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {getInitials(fullName)}
            </Text>
          </View>

          <View style={styles.avatarOnlineDot} />
        </View>

        <View
          style={[
            styles.identity,
            isCompact && styles.identityCompact,
          ]}
        >
          <Text style={styles.profileEyebrow}>
            WELCOME TO SIYA-FUND
          </Text>

          <Text style={styles.fullName}>{fullName}</Text>

          <Text style={styles.email} selectable>
            {profile.email || "No email address available"}
          </Text>

          <View style={styles.profileBadges}>
            <View style={styles.roleBadge}>
              <Ionicons
                name="shield-checkmark-outline"
                size={14}
                color="#62DDA8"
              />

              <Text style={styles.roleText}>
                {formatRole(profile.role)}
              </Text>
            </View>

            <View
              style={[
                styles.verificationBadge,
                !profile.emailVerified &&
                  styles.verificationPending,
              ]}
            >
              <Ionicons
                name={
                  profile.emailVerified
                    ? "checkmark-circle-outline"
                    : "alert-circle-outline"
                }
                size={14}
                color={
                  profile.emailVerified
                    ? "#62DDA8"
                    : "#F2C879"
                }
              />

              <Text
                style={[
                  styles.verificationText,
                  !profile.emailVerified &&
                    styles.verificationPendingText,
                ]}
              >
                {profile.emailVerified
                  ? "Email verified"
                  : "Email pending"}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.profileDecoration}>
          <Ionicons
            name="person-outline"
            size={82}
            color="rgba(70, 211, 154, 0.08)"
          />
        </View>
      </View>

      {/* Personal information */}
      <View style={styles.section}>
        <View style={styles.sectionHeading}>
          <View style={styles.sectionIcon}>
            <Ionicons
              name="person-outline"
              size={20}
              color="#46D39A"
            />
          </View>

          <View style={styles.sectionHeadingText}>
            <Text style={styles.sectionTitle}>
              Personal information
            </Text>

            <Text style={styles.sectionSubtitle}>
              The details connected to your account.
            </Text>
          </View>
        </View>

        <View style={styles.detailsList}>
          <ProfileRow
            icon="person-outline"
            label="First name"
            value={profile.firstName}
            compact={isCompact}
          />

          <ProfileRow
            icon="people-outline"
            label="Last name"
            value={profile.lastName}
            compact={isCompact}
          />

          <ProfileRow
            icon="mail-outline"
            label="Email address"
            value={profile.email}
            compact={isCompact}
          />

          <ProfileRow
            icon="call-outline"
            label="Phone number"
            value={profile.phone}
            compact={isCompact}
            last
          />
        </View>
      </View>

      {/* Account and security */}
      <View style={styles.section}>
        <View style={styles.sectionHeading}>
          <View style={styles.sectionIcon}>
            <Ionicons
              name="lock-closed-outline"
              size={20}
              color="#46D39A"
            />
          </View>

          <View style={styles.sectionHeadingText}>
            <Text style={styles.sectionTitle}>
              Account & security
            </Text>

            <Text style={styles.sectionSubtitle}>
              Your account status and access information.
            </Text>
          </View>
        </View>

        <View style={styles.detailsList}>
          <View
            style={[
              styles.detailRow,
              isCompact && styles.detailRowCompact,
            ]}
          >
            <View style={styles.rowLabelGroup}>
              <Ionicons
                name="shield-checkmark-outline"
                size={17}
                color="#8FA1B8"
              />

              <Text style={styles.rowLabel}>
                Account role
              </Text>
            </View>

            <Text style={styles.rowValue}>
              {formatRole(profile.role)}
            </Text>
          </View>

          <ProfileRow
            icon="calendar-outline"
            label="Member since"
            value={profile.createdAt || "Not available"}
            compact={isCompact}
            last
          />
        </View>

        <View style={styles.securityNote}>
          <Ionicons
            name="information-circle-outline"
            size={17}
            color="#8FA1B8"
          />

          <Text style={styles.securityNoteText}>
            Your account role is managed by Siya-Fund and cannot
            be changed from this page.
          </Text>
        </View>
      </View>

      {/* Support */}
      <View style={styles.supportCard}>
        <View style={styles.supportIcon}>
          <Ionicons
            name="chatbubbles-outline"
            size={22}
            color="#46D39A"
          />
        </View>

        <View style={styles.supportCopy}>
          <Text style={styles.supportTitle}>
            Need a hand?
          </Text>

          <Text style={styles.supportText}>
            If your account details are incorrect, contact the
            Siya-Fund support team.
          </Text>
        </View>
      </View>

      {/* Sign out */}
      <Pressable
        style={({ pressed }) => [
          styles.signOutButton,
          pressed && styles.buttonPressed,
        ]}
        onPress={confirmLogout}
        accessibilityRole="button"
        accessibilityLabel="Sign out of Siya-Fund"
      >
        <Ionicons
          name="log-out-outline"
          size={20}
          color="#FF9298"
        />

        <Text style={styles.signOutText}>Sign out</Text>

        <View style={styles.signOutArrow}>
          <Ionicons
            name="arrow-forward-outline"
            size={16}
            color="#FF9298"
          />
        </View>
      </Pressable>

      <Text style={styles.footer}>
        Siya-Fund · Your account, your future.
      </Text>
    </ScrollView>
  );
}

type ProfileRowProps = {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  label: string;
  value: string;
  compact?: boolean;
  last?: boolean;
};

function ProfileRow({
  icon,
  label,
  value,
  compact = false,
  last = false,
}: ProfileRowProps) {
  return (
    <View
      style={[
        styles.detailRow,
        compact && styles.detailRowCompact,
        last && styles.lastDetailRow,
      ]}
    >
      <View style={styles.rowLabelGroup}>
        <Ionicons
          name={icon}
          size={17}
          color="#8FA1B8"
        />

        <Text style={styles.rowLabel}>{label}</Text>
      </View>

      <Text
        style={[
          styles.rowValue,
          compact && styles.rowValueCompact,
        ]}
        selectable
      >
        {value || "Not provided"}
      </Text>
    </View>
  );
}
