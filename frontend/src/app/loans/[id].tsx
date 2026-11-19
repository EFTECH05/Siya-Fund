

import React, { useEffect, useState } from "react";

import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  router,
  useLocalSearchParams,
} from "expo-router";

import { getLoanById } from "../../services/LoanService";

import type { Loan } from "../../models/Loan";

// ==========================================
// FORMAT DATE
// ==========================================

function formatDate(value: Loan["createdAt"]): string {
  if (!value) {
    return "Not available";
  }

  const date =
    value instanceof Date
      ? value
      : value.toDate();

  return date.toLocaleDateString("en-ZA", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

// ==========================================
// LOAN DETAILS SCREEN
// ==========================================

export default function LoanDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [loan, setLoan] = useState<Loan | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  // ========================================
  // LOAD LOAN DETAILS
  // ========================================

  useEffect(() => {
    async function loadLoan() {
      try {
        setLoading(true);
        setError("");

        const result = await getLoanById(id);

        if (!result) {
          setError("Loan application not found.");
          return;
        }

        setLoan(result);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load loan details.",
        );
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadLoan();
    } else {
      setError("Invalid loan ID.");
      setLoading(false);
    }
  }, [id]);

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
          Loading loan details...
        </Text>
      </View>
    );
  }

  // ========================================
  // ERROR STATE
  // ========================================

  if (error || !loan) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>
          {error || "Loan not found."}
        </Text>

        <Pressable
          style={styles.button}
          onPress={() => router.back()}
        >
          <Text style={styles.buttonText}>
            Go Back
          </Text>
        </Pressable>
      </View>
    );
  }

  // ========================================
  // LOAN DETAILS
  // ========================================

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      <Pressable
        onPress={() => router.back()}
        style={styles.backButton}
      >
        <Text style={styles.backText}>
          ← Back to Loans
        </Text>
      </Pressable>

      <Text style={styles.heading}>
        Loan Details
      </Text>

      <View style={styles.card}>
        <Text style={styles.label}>
          Loan Amount
        </Text>

        <Text style={styles.amount}>
          R{" "}
          {loan.amount.toLocaleString("en-ZA", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </Text>

        <Text style={styles.label}>
          Application Status
        </Text>

        <Text style={styles.status}>
          {loan.status.toUpperCase()}
        </Text>

        <View style={styles.divider} />

        <Text style={styles.label}>
          Purpose
        </Text>

        <Text style={styles.value}>
          {loan.purpose}
        </Text>

        <Text style={styles.label}>
          Repayment Term
        </Text>

        <Text style={styles.value}>
          {loan.termMonths} months
        </Text>

        <Text style={styles.label}>
          Interest Rate
        </Text>

        <Text style={styles.value}>
          0% (Interest-free)
        </Text>

        <Text style={styles.label}>
          Application Date
        </Text>

        <Text style={styles.value}>
          {formatDate(loan.createdAt)}
        </Text>

        <Text style={styles.label}>
          Last Updated
        </Text>

        <Text style={styles.value}>
          {formatDate(loan.updatedAt)}
        </Text>
      </View>
    </ScrollView>
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

  content: {
    padding: 20,
    paddingBottom: 40,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F7FA",
    padding: 24,
  },

  loadingText: {
    marginTop: 12,
    color: "#64748B",
  },

  errorText: {
    color: "#DC2626",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },

  backButton: {
    marginBottom: 24,
    marginTop: 16,
  },

  backText: {
    color: "#16A34A",
    fontSize: 15,
    fontWeight: "600",
  },

  heading: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#172033",
    marginBottom: 20,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },

  label: {
    color: "#64748B",
    fontSize: 13,
    marginTop: 16,
    marginBottom: 6,
  },

  amount: {
    color: "#16A34A",
    fontSize: 30,
    fontWeight: "bold",
  },

  status: {
    color: "#16A34A",
    fontSize: 15,
    fontWeight: "bold",
  },

  value: {
    color: "#172033",
    fontSize: 16,
    fontWeight: "500",
  },

  divider: {
    height: 1,
    backgroundColor: "#E2E8F0",
    marginTop: 20,
  },

  button: {
    backgroundColor: "#16A34A",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
  },

  buttonText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
});
