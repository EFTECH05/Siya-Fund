
import React, { useCallback, useEffect, useMemo, useState } from "react";

import {
  ActivityIndicator,
  FlatList,
  Modal,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { router } from "expo-router";

import {
  getCurrentUser,
  getUserRole,
} from "../../services/AuthService";

import {
  getAllTransactions,
  type AdminTransaction,
} from "../../services/AdminTransactionService";

// ============================================================
// TYPES
// ============================================================

type TransactionTypeFilter =
  | "all"
  | "contribution"
  | "loan"
  | "repayment"
  | "withdrawal"
  | "deposit";

type StatusFilter =
  | "all"
  | "pending"
  | "completed"
  | "failed"
  | "cancelled";

// ============================================================
// CONSTANTS
// ============================================================

const COLORS = {
  primary: "#16845B",
  primaryLight: "#E8F5EF",
  background: "#F5F7F6",
  card: "#FFFFFF",
  text: "#172B24",
  muted: "#78857F",
  border: "#E5EBE7",
  danger: "#DC4444",
  warning: "#D99022",
  blue: "#3478C8",
};

const TYPE_FILTERS: {
  label: string;
  value: TransactionTypeFilter;
}[] = [
  { label: "All", value: "all" },
  { label: "Contributions", value: "contribution" },
  { label: "Loans", value: "loan" },
  { label: "Repayments", value: "repayment" },
  { label: "Withdrawals", value: "withdrawal" },
  { label: "Deposits", value: "deposit" },
];

const STATUS_FILTERS: {
  label: string;
  value: StatusFilter;
}[] = [
  { label: "All statuses", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Completed", value: "completed" },
  { label: "Failed", value: "failed" },
  { label: "Cancelled", value: "cancelled" },
];

// ============================================================
// HELPERS
// ============================================================

const currencyFormatter = new Intl.NumberFormat("en-ZA", {
  style: "currency",
  currency: "ZAR",
});

function formatDate(
  date: AdminTransaction["createdAt"],
): string {
  if (!date) return "Date unavailable";

  const value =
    date instanceof Date
      ? date
      : date.toDate();

  return value.toLocaleString("en-ZA", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    contribution: "Contribution",
    loan: "Loan",
    repayment: "Loan repayment",
    withdrawal: "Withdrawal",
    deposit: "Deposit",
  };

  return labels[type] ?? type;
}

function getStatusColor(status: string): string {
  switch (status) {
    case "completed":
      return COLORS.primary;

    case "pending":
      return COLORS.warning;

    case "failed":
      return COLORS.danger;

    case "cancelled":
      return COLORS.muted;

    default:
      return COLORS.blue;
  }
}

// ============================================================
// MAIN SCREEN
// ============================================================

export default function SuperAdminTransactionsScreen() {
  const [transactions, setTransactions] = useState<
    AdminTransaction[]
  >([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState("");

  const [isAuthorized, setIsAuthorized] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");

  const [typeFilter, setTypeFilter] =
    useState<TransactionTypeFilter>("all");

  const [statusFilter, setStatusFilter] =
    useState<StatusFilter>("all");

  const [selectedTransaction, setSelectedTransaction] =
    useState<AdminTransaction | null>(null);

  // ==========================================================
  // LOAD TRANSACTIONS
  // ==========================================================

  const loadTransactions = useCallback(async () => {
    setError("");

    const data = await getAllTransactions();

    setTransactions(data);
  }, []);

  // ==========================================================
  // AUTHORIZATION AND INITIAL LOAD
  // ==========================================================

  useEffect(() => {
    let mounted = true;

    const initialize = async () => {
      try {
        const user = getCurrentUser();

        if (!user) {
          router.replace("/login");
          return;
        }

        const role = await getUserRole();

        if (!mounted) return;

        if (role !== "super_admin") {
          router.replace("/dashboard");
          return;
        }

        setIsAuthorized(true);

        const data = await getAllTransactions();

        if (!mounted) return;

        setTransactions(data);
      } catch (err) {
        console.error(
          "Failed to load admin transactions:",
          err,
        );

        if (mounted) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load transactions.",
          );
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    initialize();

    return () => {
      mounted = false;
    };
  }, []);

  // ==========================================================
  // REFRESH
  // ==========================================================

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      setError("");

      await loadTransactions();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to refresh transactions.",
      );
    } finally {
      setIsRefreshing(false);
    }
  };

  // ==========================================================
  // FILTER TRANSACTIONS
  // ==========================================================

  const filteredTransactions = useMemo(() => {
    const search = searchQuery.trim().toLowerCase();

    return transactions.filter((transaction) => {
      const matchesType =
        typeFilter === "all" ||
        transaction.type === typeFilter;

      const matchesStatus =
        statusFilter === "all" ||
        transaction.status === statusFilter;

      const matchesSearch =
        !search ||
        transaction.id.toLowerCase().includes(search) ||
        transaction.userId.toLowerCase().includes(search) ||
        transaction.memberName.toLowerCase().includes(search) ||
        transaction.memberEmail.toLowerCase().includes(search) ||
        transaction.description.toLowerCase().includes(search) ||
        (transaction.referenceId ?? "")
          .toLowerCase()
          .includes(search);

      return (
        matchesType &&
        matchesStatus &&
        matchesSearch
      );
    });
  }, [
    transactions,
    searchQuery,
    typeFilter,
    statusFilter,
  ]);

  // ==========================================================
  // DASHBOARD STATISTICS
  // ==========================================================

  const stats = useMemo(() => {
    const completed = transactions.filter(
      (item) => item.status === "completed",
    );

    return {
      total: transactions.length,

      completed: completed.length,

      pending: transactions.filter(
        (item) => item.status === "pending",
      ).length,

      totalValue: completed.reduce(
        (sum, item) => sum + item.amount,
        0,
      ),
    };
  }, [transactions]);

  // ==========================================================
  // TRANSACTION CARD
  // ==========================================================

  const renderTransaction = ({
    item,
  }: {
    item: AdminTransaction;
  }) => {
    const statusColor = getStatusColor(item.status);

    return (
      <Pressable
        style={({ pressed }) => [
          styles.transactionCard,
          pressed && styles.pressed,
        ]}
        onPress={() => setSelectedTransaction(item)}
      >
        <View style={styles.transactionTop}>
          <View style={styles.transactionInfo}>
            <Text style={styles.transactionType}>
              {getTypeLabel(item.type)}
            </Text>

            <Text
              style={styles.memberName}
              numberOfLines={1}
            >
              {item.memberName}
            </Text>

            <Text
              style={styles.memberEmail}
              numberOfLines={1}
            >
              {item.memberEmail}
            </Text>
          </View>

          <View style={styles.amountContainer}>
            <Text style={styles.amount}>
              {currencyFormatter.format(item.amount)}
            </Text>

            <View
              style={[
                styles.statusBadge,
                {
                  backgroundColor: `${statusColor}15`,
                },
              ]}
            >
              <View
                style={[
                  styles.statusDot,
                  { backgroundColor: statusColor },
                ]}
              />

              <Text
                style={[
                  styles.statusText,
                  { color: statusColor },
                ]}
              >
                {item.status.toUpperCase()}
              </Text>
            </View>
          </View>
        </View>

        <Text
          style={styles.description}
          numberOfLines={2}
        >
          {item.description}
        </Text>

        <View style={styles.transactionFooter}>
          <Text style={styles.date}>
            {formatDate(item.createdAt)}
          </Text>

          <Text style={styles.viewDetails}>
            View details →
          </Text>
        </View>
      </Pressable>
    );
  };

  // ==========================================================
  // FILTER CHIP
  // ==========================================================

  const renderTypeFilters = () => (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.filterContent}
    >
      {TYPE_FILTERS.map((filter) => {
        const active = typeFilter === filter.value;

        return (
          <Pressable
            key={filter.value}
            onPress={() => setTypeFilter(filter.value)}
            style={[
              styles.filterChip,
              active && styles.activeFilterChip,
            ]}
          >
            <Text
              style={[
                styles.filterText,
                active && styles.activeFilterText,
              ]}
            >
              {filter.label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );

  // ==========================================================
  // LOADING SCREEN
  // ==========================================================

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator
          size="large"
          color={COLORS.primary}
        />

        <Text style={styles.loadingText}>
          Loading transactions...
        </Text>
      </View>
    );
  }

  if (!isAuthorized) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator
          size="large"
          color={COLORS.primary}
        />

        <Text style={styles.loadingText}>
          Verifying access...
        </Text>
      </View>
    );
  }

  // ==========================================================
  // MAIN UI
  // ==========================================================

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredTransactions}
        keyExtractor={(item) => item.id}
        renderItem={renderTransaction}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={COLORS.primary}
          />
        }
        ListHeaderComponent={
          <View>
            {/* HEADER */}

            <View style={styles.header}>
              <Pressable
                onPress={() => router.replace("/super-admin")}
                style={styles.backButton}
              >
                <Text style={styles.backText}>
                  ← Back to dashboard
                </Text>
              </Pressable>

              <Text style={styles.screenTitle}>
                Transaction Management
              </Text>

              <Text style={styles.screenSubtitle}>
                Monitor all financial transactions across Siya Fund.
              </Text>
            </View>

            {/* ERROR */}

            {error ? (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>
                  {error}
                </Text>

                <Pressable onPress={handleRefresh}>
                  <Text style={styles.retryText}>
                    Try again
                  </Text>
                </Pressable>
              </View>
            ) : null}

            {/* STATISTICS */}

            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <Text style={styles.statLabel}>
                  Total transactions
                </Text>

                <Text style={styles.statValue}>
                  {stats.total}
                </Text>
              </View>

              <View style={styles.statCard}>
                <Text style={styles.statLabel}>
                  Completed
                </Text>

                <Text
                  style={[
                    styles.statValue,
                    { color: COLORS.primary },
                  ]}
                >
                  {stats.completed}
                </Text>
              </View>

              <View style={styles.statCard}>
                <Text style={styles.statLabel}>
                  Pending
                </Text>

                <Text
                  style={[
                    styles.statValue,
                    { color: COLORS.warning },
                  ]}
                >
                  {stats.pending}
                </Text>
              </View>

              <View style={styles.statCard}>
                <Text style={styles.statLabel}>
                  Completed value
                </Text>

                <Text style={styles.statValueSmall}>
                  {currencyFormatter.format(stats.totalValue)}
                </Text>
              </View>
            </View>

            {/* SEARCH */}

            <View style={styles.searchContainer}>
              <Text style={styles.searchIcon}>
                ⌕
              </Text>

              <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search member, transaction ID..."
                placeholderTextColor={COLORS.muted}
                style={styles.searchInput}
                autoCapitalize="none"
                autoCorrect={false}
              />

              {searchQuery.length > 0 && (
                <Pressable
                  onPress={() => setSearchQuery("")}
                >
                  <Text style={styles.clearSearch}>
                    ✕
                  </Text>
                </Pressable>
              )}
            </View>

            {/* TYPE FILTERS */}

            <Text style={styles.sectionTitle}>
              Transaction type
            </Text>

            {renderTypeFilters()}

            {/* STATUS FILTER */}

            <Text style={styles.sectionTitle}>
              Transaction status
            </Text>

            <View style={styles.statusFilters}>
              {STATUS_FILTERS.map((filter) => {
                const active =
                  statusFilter === filter.value;

                return (
                  <Pressable
                    key={filter.value}
                    onPress={() =>
                      setStatusFilter(filter.value)
                    }
                    style={[
                      styles.statusFilter,
                      active && styles.activeStatusFilter,
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusFilterText,
                        active && styles.activeStatusFilterText,
                      ]}
                    >
                      {filter.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {/* RESULTS COUNT */}

            <View style={styles.resultsHeader}>
              <Text style={styles.sectionTitle}>
                Transaction records
              </Text>

              <Text style={styles.resultsCount}>
                {filteredTransactions.length} found
              </Text>
            </View>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>
              ▤
            </Text>

            <Text style={styles.emptyTitle}>
              No transactions found
            </Text>

            <Text style={styles.emptyDescription}>
              No transactions match your current search or filters.
            </Text>

            <Pressable
              onPress={() => {
                setSearchQuery("");
                setTypeFilter("all");
                setStatusFilter("all");
              }}
              style={styles.resetButton}
            >
              <Text style={styles.resetButtonText}>
                Clear filters
              </Text>
            </Pressable>
          </View>
        }
      />

      {/* ====================================================
          TRANSACTION DETAILS MODAL
      ==================================================== */}

      <Modal
        visible={selectedTransaction !== null}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedTransaction(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                Transaction details
              </Text>

              <Pressable
                onPress={() => setSelectedTransaction(null)}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>
                  ✕
                </Text>
              </Pressable>
            </View>

            {selectedTransaction && (
              <ScrollView
                showsVerticalScrollIndicator={false}
              >
                <Text style={styles.modalAmount}>
                  {currencyFormatter.format(
                    selectedTransaction.amount,
                  )}
                </Text>

                <View
                  style={[
                    styles.statusBadge,
                    {
                      alignSelf: "flex-start",
                      backgroundColor:
                        `${getStatusColor(selectedTransaction.status)}15`,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      {
                        color: getStatusColor(
                          selectedTransaction.status,
                        ),
                      },
                    ]}
                  >
                    {selectedTransaction.status.toUpperCase()}
                  </Text>
                </View>

                <Text style={styles.modalSectionTitle}>
                  Member information
                </Text>

                <DetailRow
                  label="Member name"
                  value={selectedTransaction.memberName}
                />

                <DetailRow
                  label="Email address"
                  value={selectedTransaction.memberEmail}
                />

                <DetailRow
                  label="Member ID"
                  value={selectedTransaction.userId}
                />

                <Text style={styles.modalSectionTitle}>
                  Transaction information
                </Text>

                <DetailRow
                  label="Transaction ID"
                  value={selectedTransaction.id}
                />

                <DetailRow
                  label="Transaction type"
                  value={getTypeLabel(selectedTransaction.type)}
                />

                <DetailRow
                  label="Amount"
                  value={currencyFormatter.format(
                    selectedTransaction.amount,
                  )}
                />

                <DetailRow
                  label="Currency"
                  value={selectedTransaction.currency}
                />

                <DetailRow
                  label="Description"
                  value={selectedTransaction.description}
                />

                <DetailRow
                  label="Date and time"
                  value={formatDate(selectedTransaction.createdAt)}
                />

                <DetailRow
                  label="Reference type"
                  value={selectedTransaction.referenceType ?? "N/A"}
                />

                <DetailRow
                  label="Reference ID"
                  value={selectedTransaction.referenceId ?? "N/A"}
                />

                <Text style={styles.modalNote}>
                  This screen displays the transaction record stored
                  in Siya Fund. A completed status does not independently
                  verify a bank payment.
                </Text>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

// ============================================================
// DETAIL ROW COMPONENT
// ============================================================

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>
        {label}
      </Text>

      <Text style={styles.detailValue}>
        {value}
      </Text>
    </View>
  );
}

// ============================================================
// STYLES
// ============================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.background,
    gap: 12,
  },

  loadingText: {
    color: COLORS.muted,
    fontSize: 13,
  },

  listContent: {
    padding: 18,
    paddingBottom: 40,
  },

  header: {
    marginBottom: 22,
  },

  backButton: {
    marginBottom: 20,
  },

  backText: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: "700",
  },

  screenTitle: {
    color: COLORS.text,
    fontSize: 25,
    fontWeight: "800",
    marginBottom: 7,
  },

  screenSubtitle: {
    color: COLORS.muted,
    fontSize: 13,
    lineHeight: 20,
  },

  errorBox: {
    backgroundColor: "#FDECEC",
    borderRadius: 12,
    padding: 14,
    marginBottom: 18,
    gap: 8,
  },

  errorText: {
    color: COLORS.danger,
    fontSize: 12,
  },

  retryText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: "800",
  },

  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 22,
  },

  statCard: {
    width: "48%",
    flexGrow: 1,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,
    padding: 15,
    minHeight: 90,
    justifyContent: "space-between",
  },

  statLabel: {
    color: COLORS.muted,
    fontSize: 11,
    fontWeight: "600",
  },

  statValue: {
    color: COLORS.text,
    fontSize: 24,
    fontWeight: "800",
  },

  statValueSmall: {
    color: COLORS.text,
    fontSize: 17,
    fontWeight: "800",
  },

  searchContainer: {
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    marginBottom: 22,
  },

  searchIcon: {
    color: COLORS.muted,
    fontSize: 24,
    marginRight: 10,
  },

  searchInput: {
    flex: 1,
    color: COLORS.text,
    fontSize: 13,
  },

  clearSearch: {
    color: COLORS.muted,
    fontSize: 17,
    padding: 5,
  },

  sectionTitle: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: "800",
    marginBottom: 12,
  },

  filterContent: {
    gap: 8,
    paddingBottom: 20,
  },

  filterChip: {
    paddingHorizontal: 15,
    paddingVertical: 9,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 20,
  },

  activeFilterChip: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },

  filterText: {
    color: COLORS.muted,
    fontSize: 11,
    fontWeight: "700",
  },

  activeFilterText: {
    color: "#FFFFFF",
  },

  statusFilters: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 22,
  },

  statusFilter: {
    paddingHorizontal: 11,
    paddingVertical: 8,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 9,
  },

  activeStatusFilter: {
    backgroundColor: COLORS.primaryLight,
    borderColor: COLORS.primary,
  },

  statusFilterText: {
    color: COLORS.muted,
    fontSize: 10,
    fontWeight: "700",
  },

  activeStatusFilterText: {
    color: COLORS.primary,
  },

  resultsHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  resultsCount: {
    color: COLORS.muted,
    fontSize: 11,
  },

  transactionCard: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,
    padding: 15,
    marginBottom: 11,
    gap: 12,
  },

  pressed: {
    opacity: 0.75,
  },

  transactionTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },

  transactionInfo: {
    flex: 1,
    gap: 5,
  },

  transactionType: {
    color: COLORS.primary,
    fontSize: 11,
    fontWeight: "800",
    textTransform: "uppercase",
  },

  memberName: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: "800",
  },

  memberEmail: {
    color: COLORS.muted,
    fontSize: 11,
  },

  amountContainer: {
    alignItems: "flex-end",
    gap: 9,
  },

  amount: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: "800",
  },

  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 20,
    gap: 5,
  },

  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },

  statusText: {
    fontSize: 9,
    fontWeight: "800",
  },

  description: {
    color: COLORS.muted,
    fontSize: 12,
    lineHeight: 18,
  },

  transactionFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 10,
  },

  date: {
    color: COLORS.muted,
    fontSize: 10,
    flex: 1,
  },

  viewDetails: {
    color: COLORS.primary,
    fontSize: 11,
    fontWeight: "800",
  },

  emptyContainer: {
    alignItems: "center",
    paddingVertical: 45,
    paddingHorizontal: 20,
  },

  emptyIcon: {
    fontSize: 36,
    color: COLORS.muted,
    marginBottom: 14,
  },

  emptyTitle: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 7,
  },

  emptyDescription: {
    color: COLORS.muted,
    fontSize: 12,
    textAlign: "center",
    lineHeight: 19,
  },

  resetButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 18,
    paddingVertical: 11,
    borderRadius: 9,
    marginTop: 18,
  },

  resetButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "800",
  },

  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.45)",
  },

  modalContent: {
    maxHeight: "88%",
    backgroundColor: COLORS.card,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    padding: 22,
    paddingBottom: 35,
  },

  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 22,
  },

  modalTitle: {
    color: COLORS.text,
    fontSize: 19,
    fontWeight: "800",
  },

  closeButton: {
    width: 34,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.background,
    borderRadius: 18,
  },

  closeButtonText: {
    color: COLORS.text,
    fontSize: 16,
  },

  modalAmount: {
    color: COLORS.text,
    fontSize: 27,
    fontWeight: "900",
    marginBottom: 12,
  },

  modalSectionTitle: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: "800",
    marginTop: 24,
    marginBottom: 12,
  },

  detailRow: {
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    gap: 5,
  },

  detailLabel: {
    color: COLORS.muted,
    fontSize: 10,
    fontWeight: "700",
  },

  detailValue: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: "600",
    lineHeight: 18,
  },

  modalNote: {
    color: COLORS.muted,
    fontSize: 10,
    lineHeight: 17,
    marginTop: 20,
  },
});
