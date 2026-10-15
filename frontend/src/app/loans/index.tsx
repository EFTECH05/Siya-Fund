
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

import { getLoanRequests } from "../../services/LoanService";
import type { Loan, LoanStatus } from "../../models/Loan";

const C = {
  bg: "#080D17",
  card: "#0D1422",
  border: "#202B3D",
  green: "#39D98A",
  text: "#F4F7FC",
  muted: "#8290A6",
  yellow: "#F4C76B",
  red: "#F28B82",
  blue: "#83B7FF",
};

const money = (amount: number) =>
  new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
  }).format(amount);

function dateLabel(value: Loan["createdAt"]): string {
  if (!value) return "Date unavailable";
  const date = value instanceof Date ? value : value.toDate();
  if (Number.isNaN(date.getTime())) return "Date unavailable";

  return new Intl.DateTimeFormat("en-ZA", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function statusColor(status: LoanStatus): string {
  switch (status) {
    case "approved":
    case "disbursed":
    case "repaid":
      return C.green;
    case "rejected":
    case "cancelled":
      return C.red;
    case "pending":
      return C.yellow;
    default:
      return C.muted;
  }
}

function statusLabel(status: LoanStatus): string {
  const labels: Record<LoanStatus, string> = {
    pending: "Pending review",
    approved: "Approved",
    rejected: "Rejected",
    disbursed: "Disbursed",
    repaid: "Repaid",
    cancelled: "Cancelled",
  };

  return labels[status];
}

export default function LoansRoute() {
  const router = useRouter();
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadLoans = useCallback(async (refresh = false) => {
    if (refresh) setRefreshing(true);
    else setLoading(true);

    setError("");

    try {
      setLoans(await getLoanRequests());
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load your loan requests.",
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void loadLoans();
  }, [loadLoans]);

  const pendingCount = loans.filter(
    (loan) => loan.status === "pending",
  ).length;

  const approvedCount = loans.filter(
    (loan) => loan.status === "approved",
  ).length;

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => void loadLoans(true)}
            tintColor={C.green}
            colors={[C.green]}
          />
        }
      >
        <Pressable
          onPress={() => router.push("/dashboard")}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={18} color={C.text} />
          <Text style={styles.backText}>Dashboard</Text>
        </Pressable>

        <View style={styles.headingRow}>
          <View style={styles.headingCopy}>
            <Text style={styles.eyebrow}>FINANCIAL SUPPORT</Text>
            <Text style={styles.title}>My loans</Text>
            <Text style={styles.subtitle}>
              Review your loan applications and their progress.
            </Text>
          </View>

          <Pressable
            accessibilityRole="button"
            onPress={() => router.push("/loans/request")}
            style={styles.primaryButton}
          >
            <Ionicons name="add" size={20} color="#07130D" />
            <Text style={styles.primaryButtonText}>Request</Text>
          </Pressable>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Total requests</Text>
            <Text style={styles.statValue}>{loans.length}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Pending review</Text>
            <Text style={[styles.statValue, { color: C.yellow }]}>
              {pendingCount}
            </Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Approved</Text>
            <Text style={[styles.statValue, { color: C.green }]}>
              {approvedCount}
            </Text>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Application history</Text>
          <Pressable onPress={() => void loadLoans(true)}>
            <Ionicons name="refresh" size={20} color={C.green} />
          </Pressable>
        </View>

        {loading ? (
          <ActivityIndicator
            size="large"
            color={C.green}
            style={styles.loader}
          />
        ) : error ? (
          <View style={styles.emptyCard}>
            <Ionicons
              name="alert-circle-outline"
              size={30}
              color={C.red}
            />
            <Text style={styles.emptyTitle}>Could not load loans</Text>
            <Text style={styles.emptyText}>{error}</Text>
            <Pressable
              onPress={() => void loadLoans()}
              style={styles.secondaryButton}
            >
              <Text style={styles.secondaryButtonText}>Try again</Text>
            </Pressable>
          </View>
        ) : loans.length === 0 ? (
          <View style={styles.emptyCard}>
            <Ionicons name="cash-outline" size={36} color={C.green} />
            <Text style={styles.emptyTitle}>No loan requests yet</Text>
            <Text style={styles.emptyText}>
              When you submit a loan application, you can track its progress
              here.
            </Text>
            <Pressable
              onPress={() => router.push("/loans/request")}
              style={styles.primaryButton}
            >
              <Ionicons name="add" size={19} color="#07130D" />
              <Text style={styles.primaryButtonText}>Request a loan</Text>
            </Pressable>
          </View>
        ) : (
          loans.map((loan) => {
            const color = statusColor(loan.status);

            return (
              <View key={loan.id} style={styles.loanCard}>
                <View style={styles.loanTop}>
                  <View style={styles.loanIcon}>
                    <Ionicons
                      name="cash-outline"
                      size={23}
                      color={C.green}
                    />
                  </View>
                  <View style={styles.loanHeading}>
                    <Text style={styles.loanPurpose} numberOfLines={2}>
                      {loan.purpose}
                    </Text>
                    <Text style={styles.loanDate}>
                      Submitted {dateLabel(loan.createdAt)}
                    </Text>
                  </View>
                  <Text style={styles.loanAmount}>{money(loan.amount)}</Text>
                </View>

                <View style={styles.loanFooter}>
                  <View
                    style={[
                      styles.statusBadge,
                      { borderColor: `${color}66` },
                    ]}
                  >
                    <View
                      style={[styles.statusDot, { backgroundColor: color }]}
                    />
                    <Text style={[styles.statusText, { color }]}>
                      {statusLabel(loan.status)}
                    </Text>
                  </View>

                  <Text style={styles.termText}>
                    {loan.termMonths}{" "}
                    {loan.termMonths === 1 ? "month" : "months"}
                  </Text>
                </View>
              </View>
            );
          })
        )}

        <View style={styles.notice}>
          <Ionicons
            name="information-circle-outline"
            size={18}
            color={C.blue}
          />
          <Text style={styles.noticeText}>
            Loan requests are subject to review. An approved application does
            not necessarily mean funds have been disbursed.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: C.bg },
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
    marginBottom: 20,
  },
  backText: { color: C.muted, fontSize: 13, fontWeight: "600" },
  headingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 22,
  },
  headingCopy: { flex: 1, minWidth: 0 },
  eyebrow: {
    color: C.green,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  title: { color: C.text, fontSize: 27, fontWeight: "800" },
  subtitle: { color: C.muted, fontSize: 13, lineHeight: 19, marginTop: 6 },
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
  primaryButtonText: { color: "#07130D", fontSize: 12, fontWeight: "800" },
  statsRow: { flexDirection: "row", gap: 10, marginBottom: 28 },
  statCard: {
    flex: 1,
    minWidth: 0,
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 13,
    padding: 13,
  },
  statLabel: { color: C.muted, fontSize: 10, lineHeight: 15 },
  statValue: { color: C.text, fontSize: 22, fontWeight: "800", marginTop: 8 },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  sectionTitle: { color: C.text, fontSize: 16, fontWeight: "800" },
  loader: { marginTop: 36 },
  emptyCard: {
    alignItems: "center",
    gap: 12,
    padding: 28,
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 16,
  },
  emptyTitle: { color: C.text, fontSize: 16, fontWeight: "800", textAlign: "center" },
  emptyText: { color: C.muted, fontSize: 12, lineHeight: 19, textAlign: "center" },
  secondaryButton: {
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: C.border,
  },
  secondaryButtonText: { color: C.text, fontSize: 12, fontWeight: "700" },
  loanCard: {
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 14,
    padding: 15,
    marginBottom: 11,
    gap: 16,
  },
  loanTop: { flexDirection: "row", alignItems: "center", gap: 11 },
  loanIcon: {
    width: 43,
    height: 43,
    borderRadius: 12,
    backgroundColor: "#142B27",
    alignItems: "center",
    justifyContent: "center",
  },
  loanHeading: { flex: 1, minWidth: 0, gap: 5 },
  loanPurpose: { color: C.text, fontSize: 13, fontWeight: "800" },
  loanDate: { color: C.muted, fontSize: 10 },
  loanAmount: {
    color: C.text,
    fontSize: 13,
    fontWeight: "800",
    fontVariant: ["tabular-nums"],
  },
  loanFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 9,
    paddingVertical: 5,
  },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusText: { fontSize: 10, fontWeight: "700" },
  termText: { color: C.muted, fontSize: 11 },
  notice: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 9,
    backgroundColor: "#111E30",
    borderRadius: 11,
    padding: 13,
    marginTop: 14,
  },
  noticeText: { flex: 1, color: "#B4C6DF", fontSize: 11, lineHeight: 17 },
});
