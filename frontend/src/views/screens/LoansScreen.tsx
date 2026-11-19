
import React, { useCallback, useEffect, useState } from "react";

import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import { getLoanRequests } from "../../services/LoanService";

import type { Loan } from "../../models/Loan";

// ==========================================
// LOAN LIST SCREEN
// ==========================================

export default function LoansScreen() {
  const [loans, setLoans] = useState<Loan[]>([]);

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState("");

  // ========================================
  // LOAD MEMBER LOANS
  // ========================================

  const loadLoans = useCallback(async () => {
    try {
      setError("");

      const result = await getLoanRequests();

      setLoans(result);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load your loan applications.",
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadLoans();
  }, [loadLoans]);

  // ========================================
  // REFRESH
  // ========================================

  const handleRefresh = () => {
    setRefreshing(true);
    loadLoans();
  };

  // ========================================
  // STATUS COLOURS
  // ========================================

  const getStatusColor = (status: Loan["status"]) => {
    switch (status) {
      case "approved":
        return "#2563EB";

      case "disbursed":
        return "#16A34A";

      case "repaid":
        return "#15803D";

      case "rejected":
        return "#DC2626";

      case "cancelled":
        return "#64748B";

      default:
        return "#D97706";
    }
  };

  // ========================================
  // FORMAT DATE
  // ========================================

  const formatDate = (value: Loan["createdAt"]) => {
    if (!value) return "Date unavailable";

    const date =
      value instanceof Date ? value : value.toDate();

    return date.toLocaleDateString("en-ZA", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // ========================================
  // LOAN CARD
  // ========================================

  const renderLoan = ({ item }: { item: Loan }) => (
    <Pressable
      style={styles.loanCard}
      onPress={() =>
        router.push({
          pathname: "/loans/[id]",
          params: { id: item.id },
        })
      }
    >
      <View style={styles.cardHeader}>
        <View style={styles.iconContainer}>
          <Ionicons
            name="wallet-outline"
            size={23}
            color="#16A34A"
          />
        </View>

        <View style={styles.cardHeaderText}>
          <Text style={styles.cardTitle}>
            Loan Application
          </Text>

          <Text style={styles.date}>
            Applied {formatDate(item.createdAt)}
          </Text>
        </View>

        <View
          style={[
            styles.statusBadge,
            {
              backgroundColor: getStatusColor(item.status),
            },
          ]}
        >
          <Text style={styles.statusText}>
            {item.status.toUpperCase()}
          </Text>
        </View>
      </View>

      <Text style={styles.amountLabel}>
        Requested Amount
      </Text>

      <Text style={styles.amount}>
        R{" "}
        {item.amount.toLocaleString("en-ZA", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </Text>

      <Text style={styles.purpose} numberOfLines={2}>
        {item.purpose}
      </Text>

      <View style={styles.cardFooter}>
        <Text style={styles.term}>
          {item.termMonths} months
        </Text>

        <Text style={styles.detailsLink}>
          View Details
          <Ionicons
            name="chevron-forward"
            size={14}
            color="#16A34A"
          />
        </Text>
      </View>
    </Pressable>
  );

  // ========================================
  // LOADING STATE
  // ========================================

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator
          size="large"
          color="#16A34A"
        />

        <Text style={styles.loadingText}>
          Loading your loans...
        </Text>
      </View>
    );
  }

  // ========================================
  // MAIN SCREEN
  // ========================================

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.heading}>
          My Loans
        </Text>

        <Text style={styles.subtitle}>
          Track your loan applications and progress.
        </Text>
      </View>

      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>

          <Pressable
            onPress={() => {
              setLoading(true);
              loadLoans();
            }}
          >
            <Text style={styles.retryText}>
              Try Again
            </Text>
          </Pressable>
        </View>
      ) : null}

      <FlatList
        data={loans}
        keyExtractor={(item) => item.id}
        renderItem={renderLoan}
        contentContainerStyle={
          loans.length === 0
            ? styles.emptyList
            : styles.listContent
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#16A34A"
          />
        }
        ListEmptyComponent={
          !error ? (
            <View style={styles.emptyContainer}>
              <Ionicons
                name="wallet-outline"
                size={55}
                color="#94A3B8"
              />

              <Text style={styles.emptyTitle}>
                No Loan Applications
              </Text>

              <Text style={styles.emptyText}>
                You haven't submitted any loan applications yet.
              </Text>

              <Pressable
                style={styles.applyButton}
                onPress={() => router.push("/loans/request")}
              >
                <Text style={styles.applyButtonText}>
                  Apply for a Loan
                </Text>
              </Pressable>
            </View>
          ) : null
        }
      />

      {loans.length > 0 && (
        <Pressable
          style={styles.floatingButton}
          onPress={() => router.push("/loans/request")}
        >
          <Ionicons
            name="add"
            size={22}
            color="#FFFFFF"
          />

          <Text style={styles.floatingButtonText}>
            Apply for Loan
          </Text>
        </Pressable>
      )}
    </View>
  );
}

// ==========================================
// STYLES
// ==========================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },

  header: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 18,
  },

  heading: {
    fontSize: 27,
    fontWeight: "bold",
    color: "#172033",
  },

  subtitle: {
    color: "#64748B",
    fontSize: 14,
    marginTop: 6,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F7FA",
  },

  loadingText: {
    marginTop: 12,
    color: "#64748B",
  },

  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },

  emptyList: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },

  loanCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 17,
    marginBottom: 15,
    elevation: 2,
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
  },

  iconContainer: {
    width: 43,
    height: 43,
    borderRadius: 12,
    backgroundColor: "#DCFCE7",
    justifyContent: "center",
    alignItems: "center",
  },

  cardHeaderText: {
    flex: 1,
    marginLeft: 11,
  },

  cardTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#172033",
  },

  date: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 4,
  },

  statusBadge: {
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 20,
  },

  statusText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "bold",
  },

  amountLabel: {
    color: "#64748B",
    fontSize: 12,
    marginTop: 19,
  },

  amount: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#172033",
    marginTop: 4,
  },

  purpose: {
    fontSize: 13,
    color: "#64748B",
    marginTop: 9,
    lineHeight: 19,
  },

  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    marginTop: 16,
    paddingTop: 13,
  },

  term: {
    fontSize: 12,
    color: "#64748B",
  },

  detailsLink: {
    color: "#16A34A",
    fontSize: 13,
    fontWeight: "600",
  },

  emptyContainer: {
    alignItems: "center",
    paddingHorizontal: 20,
  },

  emptyTitle: {
    fontSize: 19,
    fontWeight: "bold",
    color: "#172033",
    marginTop: 15,
  },

  emptyText: {
    color: "#64748B",
    textAlign: "center",
    marginTop: 8,
    lineHeight: 21,
  },

  applyButton: {
    backgroundColor: "#16A34A",
    paddingHorizontal: 24,
    paddingVertical: 13,
    borderRadius: 10,
    marginTop: 22,
  },

  applyButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },

  floatingButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#16A34A",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 30,
    elevation: 4,
  },

  floatingButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    marginLeft: 7,
  },

  errorContainer: {
    backgroundColor: "#FEE2E2",
    marginHorizontal: 20,
    padding: 13,
    borderRadius: 10,
    marginBottom: 12,
  },

  errorText: {
    color: "#B91C1C",
    fontSize: 13,
  },

  retryText: {
    color: "#B91C1C",
    fontWeight: "bold",
    marginTop: 8,
  },
});
