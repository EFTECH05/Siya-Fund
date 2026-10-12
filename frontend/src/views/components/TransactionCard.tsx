import React from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import type {
  Transaction,
  TransactionStatus,
  TransactionType,
} from "../../models/Transaction";

interface TransactionCardProps {
  transaction: Transaction;
  onPress: (transaction: Transaction) => void;
}

const COLORS = {
  card: "#0D1422",
  border: "#202B3D",
  text: "#F4F7FC",
  muted: "#8290A6",
  green: "#39D98A",
  red: "#F28B82",
  yellow: "#F4C76B",
  blue: "#8AB4F8",
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
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function getTransactionLabel(type: TransactionType): string {
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

function getStatusLabel(status: TransactionStatus): string {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

function getTransactionIcon(
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

export default function TransactionCard({
  transaction,
  onPress,
}: TransactionCardProps) {
  const statusColor = getStatusColor(transaction.status);

  return (
    <Pressable
      onPress={() => onPress(transaction)}
      accessibilityRole="button"
      accessibilityLabel={`${getTransactionLabel(
        transaction.type,
      )}, ${formatAmount(transaction.amount)}, ${getStatusLabel(
        transaction.status,
      )}`}
      style={({ pressed }) => [
        styles.card,
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.iconContainer}>
        <Ionicons
          name={getTransactionIcon(transaction.type)}
          size={23}
          color={COLORS.green}
        />
      </View>

      <View style={styles.content}>
        <View style={styles.topRow}>
          <Text style={styles.title} numberOfLines={1}>
            {getTransactionLabel(transaction.type)}
          </Text>

          <Text style={styles.amount}>
            {formatAmount(transaction.amount)}
          </Text>
        </View>

        <Text style={styles.description} numberOfLines={2}>
          {transaction.description}
        </Text>

        <View style={styles.bottomRow}>
          <Text style={styles.date}>{formatDate(transaction)}</Text>

          <View
            style={[
              styles.statusBadge,
              { borderColor: `${statusColor}55` },
            ]}
          >
            <View
              style={[
                styles.statusDot,
                { backgroundColor: statusColor },
              ]}
            />
            <Text
              style={[styles.statusText, { color: statusColor }]}
            >
              {getStatusLabel(transaction.status)}
            </Text>
          </View>
        </View>
      </View>

      <Ionicons
        name="chevron-forward"
        size={18}
        color={COLORS.muted}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 16,
    marginBottom: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.card,
  },
  pressed: {
    opacity: 0.75,
  },
  iconContainer: {
    width: 46,
    height: 46,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#142B27",
  },
  content: {
    flex: 1,
    minWidth: 0,
    gap: 7,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 8,
  },
  title: {
    flex: 1,
    color: COLORS.text,
    fontSize: 14,
    fontWeight: "700",
  },
  amount: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: "800",
    fontVariant: ["tabular-nums"],
  },
  description: {
    color: COLORS.muted,
    fontSize: 12,
    lineHeight: 17,
  },
  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 8,
  },
  date: {
    flex: 1,
    color: COLORS.muted,
    fontSize: 10,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderRadius: 20,
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
});
