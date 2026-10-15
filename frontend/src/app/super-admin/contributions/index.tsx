import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import {
  confirmContributionPayment,
  getPendingContributions,
} from "../../../services/AdminContributionService";
import type { Contribution } from "../../../models/Contribution";

const C = {
  background: "#F4F8F5",
  white: "#FFFFFF",
  green: "#2E8B57",
  greenLight: "#E7F5EC",
  text: "#17231B",
  muted: "#657169",
  border: "#DDE7DF",
  orange: "#A65A08",
  orangeLight: "#FFF2DE",
  red: "#B42318",
};

function formatAmount(amount: number): string {
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
  }).format(amount);
}

function formatDate(value: Contribution["createdAt"]): string {
  if (!value) return "Date unavailable";

  const date =
    value instanceof Date
      ? value
      : "toDate" in value && typeof value.toDate === "function"
        ? value.toDate()
        : null;

  if (!date || Number.isNaN(date.getTime())) {
    return "Date unavailable";
  }

  return date.toLocaleString("en-ZA", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminContributionsRoute() {
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadContributions = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setError(null);

    try {
      const pending = await getPendingContributions();
      setContributions(pending);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Unable to load pending contributions.";

      setError(message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void loadContributions();
  }, [loadContributions]);

  const handleConfirm = (contribution: Contribution) => {
    Alert.alert(
      "Confirm payment received?",
      `Confirm that ${formatAmount(contribution.amount)} has been received for "${contribution.title}"?\n\nOnly continue after checking the actual payment.`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Confirm payment",
          onPress: () => {
            void (async () => {
              setBusyId(contribution.id);
              setError(null);

              try {
                await confirmContributionPayment(contribution.id);

                setContributions((current) =>
                  current.filter((item) => item.id !== contribution.id),
                );

                Alert.alert(
                  "Payment confirmed",
                  "The contribution and its linked transaction have been marked as completed.",
                );
              } catch (err) {
                const message =
                  err instanceof Error
                    ? err.message
                    : "Unable to confirm this payment.";

                setError(message);
                Alert.alert("Confirmation failed", message);
              } finally {
                setBusyId(null);
              }
            })();
          },
        },
      ],
    );
  };

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => void loadContributions(true)}
            tintColor={C.green}
            colors={[C.green]}
          />
        }
      >
        <Pressable
          onPress={() => router.replace("/super-admin")}
          style={({ pressed }) => [
            styles.backButton,
            pressed && styles.pressed,
          ]}
          accessibilityRole="button"
        >
          <Ionicons name="arrow-back" size={19} color={C.green} />
          <Text style={styles.backText}>Back to Dashboard</Text>
        </Pressable>

        <View style={styles.header}>
          <Text style={styles.eyebrow}>SIYA-FUND ADMINISTRATION</Text>
          <Text style={styles.title}>Contribution Management</Text>
          <Text style={styles.subtitle}>
            Review pending contributions and confirm payments you have
            independently verified.
          </Text>
        </View>

        <View style={styles.summaryCard}>
          <View style={styles.summaryIcon}>
            <Ionicons name="time-outline" size={23} color={C.green} />
          </View>
          <View style={styles.summaryText}>
            <Text style={styles.summaryLabel}>Pending contributions</Text>
            <Text style={styles.summaryValue}>
              {loading ? "—" : contributions.length}
            </Text>
          </View>
          <Pressable
            onPress={() => void loadContributions(true)}
            style={styles.refreshButton}
            accessibilityRole="button"
            accessibilityLabel="Refresh pending contributions"
          >
            <Ionicons name="refresh" size={20} color={C.green} />
          </Pressable>
        </View>

        {error && (
          <View style={styles.errorBox}>
            <Ionicons name="alert-circle-outline" size={20} color={C.red} />
            <Text style={styles.errorText}>{error}</Text>
            <Pressable onPress={() => void loadContributions()}>
              <Text style={styles.retryText}>Retry</Text>
            </Pressable>
          </View>
        )}

        {loading ? (
          <View style={styles.centerState}>
            <ActivityIndicator size="large" color={C.green} />
            <Text style={styles.stateText}>
              Loading pending contributions...
            </Text>
          </View>
        ) : contributions.length === 0 ? (
          <View style={styles.emptyCard}>
            <View style={styles.emptyIcon}>
              <Ionicons
                name="checkmark-circle-outline"
                size={34}
                color={C.green}
              />
            </View>
            <Text style={styles.emptyTitle}>You're all caught up</Text>
            <Text style={styles.emptyText}>
              There are no pending contributions to review right now.
            </Text>
            <Pressable
              style={styles.secondaryButton}
              onPress={() => void loadContributions(true)}
            >
              <Text style={styles.secondaryButtonText}>Refresh list</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.list}>
            <Text style={styles.sectionTitle}>Awaiting verification</Text>

            {contributions.map((contribution) => {
              const isBusy = busyId === contribution.id;

              return (
                <View key={contribution.id} style={styles.card}>
                  <View style={styles.cardTop}>
                    <View style={styles.contributionIcon}>
                      <Ionicons
                        name="wallet-outline"
                        size={22}
                        color={C.green}
                      />
                    </View>
                    <View style={styles.cardHeading}>
                      <Text style={styles.contributionTitle}>
                        {contribution.title}
                      </Text>
                      <Text style={styles.dateText}>
                        {formatDate(contribution.createdAt)}
                      </Text>
                    </View>
                    <View style={styles.pendingBadge}>
                      <Text style={styles.pendingBadgeText}>Pending</Text>
                    </View>
                  </View>

                  <Text style={styles.amount}>
                    {formatAmount(contribution.amount)}
                  </Text>

                  {!!contribution.description && (
                    <Text style={styles.description}>
                      {contribution.description}
                    </Text>
                  )}

                  <View style={styles.divider} />

                  <Text style={styles.detailLabel}>Contribution ID</Text>
                  <Text selectable style={styles.detailValue}>
                    {contribution.id}
                  </Text>

                  <Text style={styles.detailLabel}>Member ID</Text>
                  <Text selectable style={styles.detailValue}>
                    {contribution.userId}
                  </Text>

                  <View style={styles.warningBox}>
                    <Ionicons
                      name="shield-checkmark-outline"
                      size={18}
                      color={C.orange}
                    />
                    <Text style={styles.warningText}>
                      Verify the payment in your trusted payment records
                      before confirming. A pending contribution is not proof
                      that money was received.
                    </Text>
                  </View>

                  <Pressable
                    onPress={() => handleConfirm(contribution)}
                    disabled={busyId !== null}
                    style={({ pressed }) => [
                      styles.confirmButton,
                      (pressed || (busyId !== null && !isBusy)) &&
                        styles.disabledButton,
                    ]}
                    accessibilityRole="button"
                    accessibilityLabel={`Confirm payment for ${contribution.title}`}
                  >
                    {isBusy ? (
                      <ActivityIndicator color={C.white} />
                    ) : (
                      <>
                        <Ionicons
                          name="checkmark-circle-outline"
                          size={19}
                          color={C.white}
                        />
                        <Text style={styles.confirmButtonText}>
                          Confirm payment received
                        </Text>
                      </>
                    )}
                  </Pressable>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: C.background,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
    maxWidth: 900,
    width: "100%",
    alignSelf: "center",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingVertical: 10,
    paddingRight: 12,
    gap: 8,
  },
  backText: {
    color: C.green,
    fontSize: 14,
    fontWeight: "700",
  },
  pressed: {
    opacity: 0.75,
  },
  header: {
    marginTop: 22,
    marginBottom: 24,
  },
  eyebrow: {
    color: C.green,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.2,
    marginBottom: 9,
  },
  title: {
    color: C.text,
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 10,
  },
  subtitle: {
    color: C.muted,
    fontSize: 15,
    lineHeight: 23,
  },
  summaryCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 16,
    padding: 18,
    marginBottom: 24,
    gap: 14,
  },
  summaryIcon: {
    width: 46,
    height: 46,
    borderRadius: 13,
    backgroundColor: C.greenLight,
    alignItems: "center",
    justifyContent: "center",
  },
  summaryText: {
    flex: 1,
  },
  summaryLabel: {
    color: C.muted,
    fontSize: 13,
    marginBottom: 4,
  },
  summaryValue: {
    color: C.text,
    fontSize: 25,
    fontWeight: "800",
  },
  refreshButton: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: C.greenLight,
  },
  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    padding: 13,
    borderRadius: 12,
    backgroundColor: "#FDECEA",
    marginBottom: 18,
  },
  errorText: {
    flex: 1,
    color: C.red,
    fontSize: 13,
    lineHeight: 19,
  },
  retryText: {
    color: C.red,
    fontSize: 13,
    fontWeight: "800",
  },
  centerState: {
    padding: 40,
    alignItems: "center",
    gap: 14,
  },
  stateText: {
    color: C.muted,
    fontSize: 14,
  },
  emptyCard: {
    backgroundColor: C.white,
    borderColor: C.border,
    borderWidth: 1,
    borderRadius: 16,
    alignItems: "center",
    padding: 28,
  },
  emptyIcon: {
    backgroundColor: C.greenLight,
    borderRadius: 30,
    width: 60,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  emptyTitle: {
    color: C.text,
    fontSize: 19,
    fontWeight: "800",
    marginBottom: 8,
  },
  emptyText: {
    color: C.muted,
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
    marginBottom: 20,
  },
  secondaryButton: {
    borderColor: C.green,
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 11,
    paddingHorizontal: 17,
  },
  secondaryButtonText: {
    color: C.green,
    fontWeight: "700",
    fontSize: 14,
  },
  list: {
    gap: 14,
  },
  sectionTitle: {
    color: C.text,
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 2,
  },
  card: {
    backgroundColor: C.white,
    borderColor: C.border,
    borderWidth: 1,
    borderRadius: 16,
    padding: 18,
  },
  cardTop: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 11,
  },
  contributionIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: C.greenLight,
    alignItems: "center",
    justifyContent: "center",
  },
  cardHeading: {
    flex: 1,
    paddingTop: 2,
  },
  contributionTitle: {
    color: C.text,
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 5,
  },
  dateText: {
    color: C.muted,
    fontSize: 12,
    lineHeight: 18,
  },
  pendingBadge: {
    backgroundColor: C.orangeLight,
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 9,
  },
  pendingBadgeText: {
    color: C.orange,
    fontSize: 11,
    fontWeight: "800",
  },
  amount: {
    color: C.green,
    fontSize: 25,
    fontWeight: "800",
    marginTop: 18,
    marginBottom: 8,
  },
  description: {
    color: C.muted,
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 12,
  },
  divider: {
    height: 1,
    backgroundColor: C.border,
    marginVertical: 14,
  },
  detailLabel: {
    color: C.muted,
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
    marginTop: 7,
  },
  detailValue: {
    color: C.text,
    fontSize: 12,
    lineHeight: 18,
  },
  warningBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 9,
    padding: 12,
    backgroundColor: C.orangeLight,
    borderRadius: 10,
    marginTop: 18,
    marginBottom: 16,
  },
  warningText: {
    flex: 1,
    color: "#75420C",
    fontSize: 12,
    lineHeight: 18,
  },
  confirmButton: {
    backgroundColor: C.green,
    borderRadius: 11,
    minHeight: 48,
    paddingVertical: 13,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
  },
  confirmButtonText: {
    color: C.white,
    fontSize: 14,
    fontWeight: "800",
  },
  disabledButton: {
    opacity: 0.6,
  },
});