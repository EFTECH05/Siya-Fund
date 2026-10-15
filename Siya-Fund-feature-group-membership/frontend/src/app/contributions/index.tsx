
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { getContributions } from "../../services/ContributionService";
import type { Contribution } from "../../models/Contribution";

const C = {
  bg: "#080D17",
  card: "#0D1422",
  border: "#202B3D",
  green: "#39D98A",
  text: "#F4F7FC",
  muted: "#8290A6",
  yellow: "#F4C76B",
  red: "#F28B82",
};

const money = (amount: number) =>
  new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
  }).format(amount);

function dateLabel(value: Contribution["createdAt"]): string {
  if (!value) return "Date unavailable";

  const date = value instanceof Date ? value : value.toDate();

  if (Number.isNaN(date.getTime())) return "Date unavailable";

  return new Intl.DateTimeFormat("en-ZA", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export default function ContributionsRoute() {
  const router = useRouter();

  const [items, setItems] = useState<Contribution[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  // Return to the previous screen, or dashboard if no history exists.
  const handleBack = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/dashboard");
    }
  }, [router]);

  const loadContributions = useCallback(async (refresh = false) => {
    if (refresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setError("");

    try {
      const contributions = await getContributions();
      setItems(contributions);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load your contributions.",
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void loadContributions();
  }, [loadContributions]);

  const total = items.reduce(
    (sum, item) =>
      item.status === "completed" ? sum + item.amount : sum,
    0,
  );

  const statusColor = (status: Contribution["status"]) => {
    if (status === "completed") return C.green;
    if (status === "cancelled") return C.red;
    return C.yellow;
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
        showsVerticalScrollIndicator={false}
      >
        {/* Back navigation */}
        <Pressable
          onPress={handleBack}
          style={({ pressed }) => [
            styles.backButton,
            pressed && styles.pressed,
          ]}
          accessibilityRole="button"
          accessibilityLabel="Go back to the previous screen"
        >
          <Ionicons name="arrow-back" size={18} color={C.text} />
          <Text style={styles.backText}>Back</Text>
        </Pressable>

        {/* Heading */}
        <View style={styles.headingRow}>
          <View style={styles.headingCopy}>
            <Text style={styles.eyebrow}>YOUR SAVINGS</Text>
            <Text style={styles.title}>Contributions</Text>
            <Text style={styles.subtitle}>
              Track your contributions and their status.
            </Text>
          </View>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Create a new contribution"
            onPress={() => router.push("/contributions/create")}
            style={({ pressed }) => [
              styles.primaryButton,
              pressed && styles.pressed,
            ]}
          >
            <Ionicons name="add" size={20} color="#07130D" />
            <Text style={styles.primaryButtonText}>New</Text>
          </Pressable>
        </View>

        {/* Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.muted}>Confirmed contributions</Text>
          <Text style={styles.total}>{money(total)}</Text>
          <Text style={styles.summaryFoot}>
            {items.filter((item) => item.status === "completed").length}
            {" completed · "}
            {items.length} total records
          </Text>
        </View>

        {/* History heading */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Contribution history</Text>

          <Pressable
            onPress={() => void loadContributions(true)}
            accessibilityRole="button"
            accessibilityLabel="Refresh contributions"
            hitSlop={8}
          >
            <Ionicons name="refresh" size={20} color={C.green} />
          </Pressable>
        </View>

        {/* Loading, error, empty state, or contribution list */}
        {loading ? (
          <ActivityIndicator
            color={C.green}
            size="large"
            style={styles.loader}
          />
        ) : error ? (
          <View style={styles.emptyCard}>
            <Ionicons
              name="alert-circle-outline"
              size={30}
              color={C.red}
            />

            <Text style={styles.emptyTitle}>
              Could not load contributions
            </Text>

            <Text style={styles.emptyText}>{error}</Text>

            <Pressable
              onPress={() => void loadContributions()}
              style={({ pressed }) => [
                styles.secondaryButton,
                pressed && styles.pressed,
              ]}
              accessibilityRole="button"
            >
              <Text style={styles.secondaryButtonText}>Try again</Text>
            </Pressable>
          </View>
        ) : items.length === 0 ? (
          <View style={styles.emptyCard}>
            <Ionicons name="wallet-outline" size={34} color={C.green} />

            <Text style={styles.emptyTitle}>No contributions yet</Text>

            <Text style={styles.emptyText}>
              Your contribution records will appear here after you submit one.
            </Text>

            <Pressable
              onPress={() => router.push("/contributions/create")}
              style={({ pressed }) => [
                styles.primaryButton,
                pressed && styles.pressed,
              ]}
              accessibilityRole="button"
              accessibilityLabel="Create your first contribution"
            >
              <Ionicons name="add" size={19} color="#07130D" />
              <Text style={styles.primaryButtonText}>
                Create contribution
              </Text>
            </Pressable>
          </View>
        ) : (
          items.map((item) => {
            const color = statusColor(item.status);

            return (
              <View key={item.id} style={styles.itemCard}>
                <View style={styles.itemIcon}>
                  <Ionicons
                    name="wallet-outline"
                    size={22}
                    color={C.green}
                  />
                </View>

                <View style={styles.itemContent}>
                  <Text style={styles.itemTitle} numberOfLines={2}>
                    {item.title}
                  </Text>

                  {!!item.description && (
                    <Text
                      style={styles.itemDescription}
                      numberOfLines={2}
                    >
                      {item.description}
                    </Text>
                  )}

                  <Text style={styles.itemDate}>
                    {dateLabel(item.createdAt)}
                  </Text>

                  <View
                    style={[
                      styles.statusBadge,
                      { borderColor: `${color}66` },
                    ]}
                  >
                    <View
                      style={[
                        styles.statusDot,
                        { backgroundColor: color },
                      ]}
                    />

                    <Text
                      style={[styles.statusText, { color }]}
                    >
                      {item.status.charAt(0).toUpperCase() +
                        item.status.slice(1)}
                    </Text>
                  </View>
                </View>

                <Text style={styles.itemAmount}>
                  {money(item.amount)}
                </Text>
              </View>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: C.bg,
  },

  content: {
    width: "100%",
    maxWidth: 960,
    alignSelf: "center",
    padding: 20,
    paddingBottom: 48,
  },

  backButton: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 4,
    marginBottom: 20,
    borderRadius: 8,
  },

  backText: {
    color: C.muted,
    fontSize: 13,
    fontWeight: "600",
  },

  headingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 22,
  },

  headingCopy: {
    flex: 1,
    minWidth: 0,
  },

  eyebrow: {
    color: C.green,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.5,
    marginBottom: 8,
  },

  title: {
    color: C.text,
    fontSize: 27,
    fontWeight: "800",
  },

  subtitle: {
    color: C.muted,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 6,
  },

  primaryButton: {
    minHeight: 43,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingHorizontal: 13,
    borderRadius: 11,
    backgroundColor: C.green,
  },

  primaryButtonText: {
    color: "#07130D",
    fontSize: 12,
    fontWeight: "800",
  },

  summaryCard: {
    backgroundColor: C.card,
    borderColor: C.border,
    borderWidth: 1,
    borderRadius: 16,
    padding: 20,
    marginBottom: 28,
  },

  muted: {
    color: C.muted,
    fontSize: 12,
  },

  total: {
    color: C.text,
    fontSize: 30,
    fontWeight: "800",
    marginTop: 8,
    fontVariant: ["tabular-nums"],
  },

  summaryFoot: {
    color: C.muted,
    fontSize: 11,
    marginTop: 8,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },

  sectionTitle: {
    color: C.text,
    fontSize: 16,
    fontWeight: "800",
  },

  loader: {
    marginTop: 36,
  },

  emptyCard: {
    alignItems: "center",
    gap: 12,
    padding: 28,
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 16,
  },

  emptyTitle: {
    color: C.text,
    fontSize: 16,
    fontWeight: "800",
    textAlign: "center",
  },

  emptyText: {
    color: C.muted,
    fontSize: 12,
    lineHeight: 19,
    textAlign: "center",
  },

  secondaryButton: {
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: C.border,
  },

  secondaryButtonText: {
    color: C.text,
    fontSize: 12,
    fontWeight: "700",
  },

  itemCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 14,
    padding: 15,
    marginBottom: 10,
  },

  itemIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#142B27",
  },

  itemContent: {
    flex: 1,
    minWidth: 0,
    gap: 7,
  },

  itemTitle: {
    color: C.text,
    fontSize: 13,
    fontWeight: "800",
  },

  itemDescription: {
    color: C.muted,
    fontSize: 11,
    lineHeight: 16,
  },

  itemDate: {
    color: C.muted,
    fontSize: 10,
  },

  statusBadge: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },

  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },

  statusText: {
    fontSize: 10,
    fontWeight: "700",
  },

  itemAmount: {
    color: C.text,
    fontSize: 13,
    fontWeight: "800",
    fontVariant: ["tabular-nums"],
  },

  pressed: {
    opacity: 0.75,
  },
});
