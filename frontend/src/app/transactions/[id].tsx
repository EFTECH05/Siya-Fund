import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";

import type {
  Transaction,
  TransactionStatus,
  TransactionType,
} from "../../models/Transaction";
import { getTransactionById } from "../../services/TransactionService";

const COLORS = {
  background: "#080D17",
  surface: "#0D1422",
  surfaceLight: "#172234",
  border: "#202B3D",
  text: "#F4F7FC",
  muted: "#8290A6",
  green: "#39D98A",
  greenBackground: "#142B27",
  red: "#F28B82",
  yellow: "#F4C76B",
};

const currencyFormatter = new Intl.NumberFormat("en-ZA", {
  style: "currency",
  currency: "ZAR",
});

function formatAmount(amount: number): string {
  return currencyFormatter.format(amount);
}

function formatDate(transaction: Transaction): string {
  if (!transaction.createdAt) {
    return "Date unavailable";
  }

  const date =
    transaction.createdAt instanceof Date
      ? transaction.createdAt
      : transaction.createdAt.toDate();

  if (Number.isNaN(date.getTime())) {
    return "Date unavailable";
  }

  return new Intl.DateTimeFormat("en-ZA", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function getTypeLabel(type: TransactionType): string {
  const labels: Record<TransactionType, string> = {
    contribution: "Contribution",
    loan: "Loan",
    repayment: "Loan repayment",
    withdrawal: "Withdrawal",
    deposit: "Deposit",
  };

  return labels[type] ?? "Transaction";
}

function getStatusColor(status: TransactionStatus): string {
  switch (status) {
    case "completed":
      return COLORS.green;
    case "pending":
      return COLORS.yellow;
    case "failed":
    case "cancelled":
      return COLORS.red;
    default:
      return COLORS.muted;
  }
}

function getTypeIcon(
  type: TransactionType,
): React.ComponentProps<typeof Ionicons>["name"] {
  switch (type) {
    case "contribution":
      return "wallet-outline";
    case "loan":
      return "cash-outline";
    case "repayment":
      return "arrow-undo-outline";
    case "withdrawal":
      return "arrow-up-circle-outline";
    case "deposit":
      return "arrow-down-circle-outline";
    default:
      return "receipt-outline";
  }
}

function formatStatus(status: TransactionStatus): string {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

export default function TransactionDetailsRoute() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string | string[] }>();

  const transactionId = Array.isArray(params.id)
    ? params.id[0]
    : params.id;

  const [transaction, setTransaction] =
    useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTransaction = useCallback(async () => {
    if (!transactionId) {
      setError("No transaction ID was provided.");
      setTransaction(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await getTransactionById(transactionId);

      if (!result) {
        setTransaction(null);
        setError(
          "This transaction could not be found or you don't have permission to view it.",
        );
        return;
      }

      setTransaction(result);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load transaction details.",
      );
    } finally {
      setLoading(false);
    }
  }, [transactionId]);

  useEffect(() => {
    void loadTransaction();
  }, [loadTransaction]);

  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/transactions");
    }
  };

  return (
    <View style={styles.screen}>
      <View style={styles.topBar}>
        <Pressable
          onPress={goBack}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          style={({ pressed }) => [
            styles.backButton,
            pressed && styles.pressed,
          ]}
        >
          <Ionicons
            name="arrow-back"
            size={20}
            color={COLORS.text}
          />
        </Pressable>

        <View style={styles.headerTextContainer}>
          <Text style={styles.pageTitle}>
            Transaction details
          </Text>
          <Text style={styles.pageSubtitle}>
            View your transaction information
          </Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        {loading ? (
          <View style={styles.stateContainer}>
            <ActivityIndicator
              size="large"
              color={COLORS.green}
            />
            <Text style={styles.stateTitle}>
              Loading transaction
            </Text>
            <Text style={styles.stateDescription}>
              Retrieving the transaction details.
            </Text>
          </View>
        ) : error ? (
          <View style={styles.stateContainer}>
            <View style={styles.stateIconError}>
              <Ionicons
                name="alert-circle-outline"
                size={30}
                color={COLORS.red}
              />
            </View>

            <Text style={styles.stateTitle}>
              Transaction unavailable
            </Text>

            <Text style={styles.stateDescription}>
              {error}
            </Text>

            <Pressable
              onPress={() => void loadTransaction()}
              style={({ pressed }) => [
                styles.primaryButton,
                pressed && styles.pressed,
              ]}
            >
              <Ionicons
                name="refresh-outline"
                size={18}
                color="#08120E"
              />
              <Text style={styles.primaryButtonText}>
                Try again
              </Text>
            </Pressable>

            <Pressable
              onPress={() => router.replace("/transactions")}
              style={styles.secondaryButton}
            >
              <Text style={styles.secondaryButtonText}>
                Back to transactions
              </Text>
            </Pressable>
          </View>
        ) : transaction ? (
          <>
            <View style={styles.amountCard}>
              <View style={styles.transactionIcon}>
                <Ionicons
                  name={getTypeIcon(transaction.type)}
                  size={30}
                  color={COLORS.green}
                />
              </View>

              <Text style={styles.typeLabel}>
                {getTypeLabel(transaction.type)}
              </Text>

              <Text style={styles.amount}>
                {formatAmount(transaction.amount)}
              </Text>

              <View
                style={[
                  styles.statusBadge,
                  {
                    borderColor: `${getStatusColor(
                      transaction.status,
                    )}66`,
                  },
                ]}
              >
                <View
                  style={[
                    styles.statusDot,
                    {
                      backgroundColor: getStatusColor(
                        transaction.status,
                      ),
                    },
                  ]}
                />
                <Text
                  style={[
                    styles.statusText,
                    {
                      color: getStatusColor(
                        transaction.status,
                      ),
                    },
                  ]}
                >
                  {formatStatus(transaction.status)}
                </Text>
              </View>

              <Text style={styles.dateText}>
                {formatDate(transaction)}
              </Text>
            </View>

            <View style={styles.detailsCard}>
              <Text style={styles.sectionTitle}>
                Transaction information
              </Text>

              <DetailRow
                label="Description"
                value={transaction.description || "Not provided"}
              />

              <DetailRow
                label="Transaction type"
                value={getTypeLabel(transaction.type)}
              />

              <DetailRow
                label="Amount"
                value={formatAmount(transaction.amount)}
                valueColor={COLORS.green}
              />

              <DetailRow
                label="Currency"
                value={transaction.currency}
              />

              <DetailRow
                label="Status"
                value={formatStatus(transaction.status)}
                valueColor={getStatusColor(transaction.status)}
              />

              <DetailRow
                label="Transaction ID"
                value={transaction.id}
                selectable
              />

              <DetailRow
                label="Date and time"
                value={formatDate(transaction)}
              />

              {transaction.referenceType && (
                <DetailRow
                  label="Related record type"
                  value={
                    transaction.referenceType === "contribution"
                      ? "Contribution"
                      : "Loan"
                  }
                />
              )}

              {transaction.referenceId && (
                <DetailRow
                  label="Related record ID"
                  value={transaction.referenceId}
                  selectable
                />
              )}
            </View>

            <View style={styles.securityNote}>
              <Ionicons
                name="shield-checkmark-outline"
                size={19}
                color={COLORS.green}
              />
              <Text style={styles.securityText}>
                This screen displays the transaction record stored
                in Siya-Fund. Its status reflects the saved record;
                it does not independently verify a bank payment.
              </Text>
            </View>

            <Pressable
              onPress={() => router.replace("/transactions")}
              style={({ pressed }) => [
                styles.primaryButton,
                styles.fullWidthButton,
                pressed && styles.pressed,
              ]}
            >
              <Ionicons
                name="list-outline"
                size={19}
                color="#08120E"
              />
              <Text style={styles.primaryButtonText}>
                Back to transaction history
              </Text>
            </Pressable>
          </>
        ) : null}
      </ScrollView>
    </View>
  );
}

interface DetailRowProps {
  label: string;
  value: string;
  valueColor?: string;
  selectable?: boolean;
}

function DetailRow({
  label,
  value,
  valueColor = COLORS.text,
  selectable = false,
}: DetailRowProps) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text
        selectable={selectable}
        style={[
          styles.detailValue,
          { color: valueColor },
          selectable && styles.selectableValue,
        ]}
      >
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  topBar: {
    minHeight: 82,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingHorizontal: 22,
    paddingVertical: 15,
    backgroundColor: "#0B111D",
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.surfaceLight,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  headerTextContainer: {
    flex: 1,
    minWidth: 0,
  },
  pageTitle: {
    color: COLORS.text,
    fontSize: 19,
    fontWeight: "800",
  },
  pageSubtitle: {
    color: COLORS.muted,
    fontSize: 11,
    marginTop: 4,
  },
  content: {
    width: "100%",
    maxWidth: 760,
    alignSelf: "center",
    paddingHorizontal: 18,
    paddingVertical: 25,
    paddingBottom: 40,
  },
  amountCard: {
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 30,
    marginBottom: 18,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  transactionIcon: {
    width: 68,
    height: 68,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 22,
    backgroundColor: COLORS.greenBackground,
    marginBottom: 17,
  },
  typeLabel: {
    color: COLORS.muted,
    fontSize: 13,
    fontWeight: "600",
  },
  amount: {
    color: COLORS.text,
    fontSize: 32,
    fontWeight: "800",
    marginTop: 10,
    textAlign: "center",
    fontVariant: ["tabular-nums"],
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    paddingHorizontal: 12,
    paddingVertical: 7,
    marginTop: 17,
    borderWidth: 1,
    borderRadius: 20,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "700",
  },
  dateText: {
    color: COLORS.muted,
    fontSize: 11,
    textAlign: "center",
    marginTop: 13,
  },
  detailsCard: {
    padding: 20,
    marginBottom: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: "800",
    marginBottom: 8,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 18,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  detailLabel: {
    flex: 0.8,
    color: COLORS.muted,
    fontSize: 12,
    lineHeight: 18,
  },
  detailValue: {
    flex: 1.2,
    fontSize: 12,
    fontWeight: "600",
    lineHeight: 18,
    textAlign: "right",
  },
  selectableValue: {
    userSelect: "text",
  } as object,
  securityNote: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    padding: 15,
    marginBottom: 18,
    borderRadius: 12,
    backgroundColor: COLORS.greenBackground,
  },
  securityText: {
    flex: 1,
    color: COLORS.muted,
    fontSize: 11,
    lineHeight: 18,
  },
  primaryButton: {
    minHeight: 46,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
    paddingHorizontal: 18,
    borderRadius: 11,
    backgroundColor: COLORS.green,
  },
  fullWidthButton: {
    width: "100%",
  },
  primaryButtonText: {
    color: "#08120E",
    fontSize: 12,
    fontWeight: "800",
  },
  secondaryButton: {
    paddingHorizontal: 18,
    paddingVertical: 14,
    marginTop: 5,
  },
  secondaryButtonText: {
    color: COLORS.green,
    fontSize: 12,
    fontWeight: "700",
  },
  stateContainer: {
    minHeight: 300,
    alignItems: "center",
    justifyContent: "center",
    padding: 25,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    backgroundColor: COLORS.surface,
  },
  stateIconError: {
    width: 62,
    height: 62,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    backgroundColor: "#241B25",
    marginBottom: 16,
  },
  stateTitle: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: "800",
    textAlign: "center",
  },
  stateDescription: {
    maxWidth: 350,
    color: COLORS.muted,
    fontSize: 12,
    lineHeight: 19,
    textAlign: "center",
    marginTop: 9,
  },
  pressed: {
    opacity: 0.75,
  },
});
