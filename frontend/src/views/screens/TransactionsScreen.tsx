import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import type {
  Transaction,
  TransactionType,
} from "../../models/Transaction";
import { getTransactions } from "../../services/TransactionService";
import TransactionCard from "../components/TransactionCard";

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
};

type FilterType = "all" | TransactionType;

const FILTERS: { label: string; value: FilterType }[] = [
  { label: "All", value: "all" },
  { label: "Contributions", value: "contribution" },
  { label: "Loans", value: "loan" },
  { label: "Repayments", value: "repayment" },
  { label: "Withdrawals", value: "withdrawal" },
  { label: "Deposits", value: "deposit" },
];

const currencyFormatter = new Intl.NumberFormat("en-ZA", {
  style: "currency",
  currency: "ZAR",
});

function formatAmount(amount: number): string {
  return currencyFormatter.format(amount);
}

export default function TransactionsScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 900;

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedFilter, setSelectedFilter] =
    useState<FilterType>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadTransactions = useCallback(
    async (isRefresh = false) => {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError(null);

      try {
        const results = await getTransactions();
        setTransactions(results);
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Unable to load your transactions.";

        setError(message);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [],
  );

  useEffect(() => {
    void loadTransactions();
  }, [loadTransactions]);

  const filteredTransactions = useMemo(() => {
    const search = searchQuery.trim().toLowerCase();

    return transactions.filter((transaction) => {
      const matchesFilter =
        selectedFilter === "all" ||
        transaction.type === selectedFilter;

      const matchesSearch =
        !search ||
        transaction.description.toLowerCase().includes(search) ||
        transaction.type.toLowerCase().includes(search) ||
        transaction.status.toLowerCase().includes(search) ||
        transaction.id.toLowerCase().includes(search) ||
        transaction.referenceId?.toLowerCase().includes(search);

      return matchesFilter && matchesSearch;
    });
  }, [transactions, selectedFilter, searchQuery]);

  const completedCount = useMemo(
    () =>
      transactions.filter(
        (transaction) => transaction.status === "completed",
      ).length,
    [transactions],
  );

  const pendingCount = useMemo(
    () =>
      transactions.filter(
        (transaction) => transaction.status === "pending",
      ).length,
    [transactions],
  );

  const openTransaction = useCallback(
    (transaction: Transaction) => {
      router.push({
        pathname: "/transactions/[id]",
        params: { id: transaction.id },
      });
    },
    [router],
  );

  return (
    <View style={styles.screen}>
      <View style={styles.topBar}>
        <View style={styles.topBarTitleContainer}>
          <View style={styles.titleIcon}>
            <Ionicons
              name="receipt-outline"
              size={23}
              color={COLORS.green}
            />
          </View>

          <View style={styles.titleTextContainer}>
            <Text style={styles.pageTitle}>Transactions</Text>
            <Text style={styles.pageSubtitle}>
              Your financial activity in one place
            </Text>
          </View>
        </View>

        <Pressable
          onPress={() => router.push("/dashboard")}
          accessibilityRole="button"
          accessibilityLabel="Back to dashboard"
          style={({ pressed }) => [
            styles.backButton,
            pressed && styles.pressed,
          ]}
        >
          <Ionicons
            name="grid-outline"
            size={17}
            color={COLORS.text}
          />
          {isDesktop && (
            <Text style={styles.backButtonText}>Dashboard</Text>
          )}
        </Pressable>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.content,
          isDesktop && styles.desktopContent,
        ]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => void loadTransactions(true)}
            tintColor={COLORS.green}
            colors={[COLORS.green]}
          />
        }
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.intro}>
          <Text style={styles.sectionTitle}>
            Transaction history
          </Text>
          <Text style={styles.introText}>
            Review your contributions, loans, repayments, and other
            recorded activity.
          </Text>
        </View>

        <View style={styles.summaryGrid}>
          <View style={styles.summaryCard}>
            <View style={styles.summaryIcon}>
              <Ionicons
                name="receipt-outline"
                size={19}
                color={COLORS.green}
              />
            </View>
            <Text style={styles.summaryLabel}>
              Total records
            </Text>
            <Text style={styles.summaryValue}>
              {loading ? "—" : transactions.length}
            </Text>
          </View>

          <View style={styles.summaryCard}>
            <View
              style={[
                styles.summaryIcon,
                styles.completedIcon,
              ]}
            >
              <Ionicons
                name="checkmark-circle-outline"
                size={19}
                color={COLORS.green}
              />
            </View>
            <Text style={styles.summaryLabel}>Completed</Text>
            <Text style={styles.summaryValue}>
              {loading ? "—" : completedCount}
            </Text>
          </View>

          <View style={styles.summaryCard}>
            <View
              style={[
                styles.summaryIcon,
                styles.pendingIcon,
              ]}
            >
              <Ionicons
                name="time-outline"
                size={19}
                color="#F4C76B"
              />
            </View>
            <Text style={styles.summaryLabel}>Pending</Text>
            <Text style={styles.summaryValue}>
              {loading ? "—" : pendingCount}
            </Text>
          </View>
        </View>

        <View style={styles.listHeader}>
          <Text style={styles.sectionTitle}>
            All activity
          </Text>
          {!loading && (
            <Text style={styles.resultCount}>
              {filteredTransactions.length}{" "}
              {filteredTransactions.length === 1
                ? "record"
                : "records"}
            </Text>
          )}
        </View>

        <View style={styles.searchContainer}>
          <Ionicons
            name="search-outline"
            size={19}
            color={COLORS.muted}
          />

          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search description, status or reference..."
            placeholderTextColor={COLORS.muted}
            style={styles.searchInput}
            accessibilityLabel="Search transactions"
            returnKeyType="search"
            autoCapitalize="none"
            autoCorrect={false}
          />

          {searchQuery.length > 0 && (
            <Pressable
              onPress={() => setSearchQuery("")}
              accessibilityRole="button"
              accessibilityLabel="Clear search"
              hitSlop={8}
            >
              <Ionicons
                name="close-circle"
                size={19}
                color={COLORS.muted}
              />
            </Pressable>
          )}
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterList}
          style={styles.filterScroll}
        >
          {FILTERS.map((filter) => {
            const active = selectedFilter === filter.value;

            return (
              <Pressable
                key={filter.value}
                onPress={() => setSelectedFilter(filter.value)}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
                style={[
                  styles.filterButton,
                  active && styles.filterButtonActive,
                ]}
              >
                <Text
                  style={[
                    styles.filterText,
                    active && styles.filterTextActive,
                  ]}
                >
                  {filter.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {loading ? (
          <View style={styles.stateContainer}>
            <ActivityIndicator
              size="large"
              color={COLORS.green}
            />
            <Text style={styles.stateTitle}>
              Loading transactions
            </Text>
            <Text style={styles.stateDescription}>
              Retrieving your financial activity from Firebase.
            </Text>
          </View>
        ) : error ? (
          <View style={styles.stateContainer}>
            <View style={styles.stateIcon}>
              <Ionicons
                name="cloud-offline-outline"
                size={28}
                color={COLORS.red}
              />
            </View>
            <Text style={styles.stateTitle}>
              Couldn't load transactions
            </Text>
            <Text style={styles.stateDescription}>
              {error}
            </Text>
            <Pressable
              onPress={() => void loadTransactions()}
              style={({ pressed }) => [
                styles.retryButton,
                pressed && styles.pressed,
              ]}
            >
              <Ionicons
                name="refresh-outline"
                size={17}
                color="#08120E"
              />
              <Text style={styles.retryButtonText}>
                Try again
              </Text>
            </Pressable>
          </View>
        ) : filteredTransactions.length === 0 ? (
          <View style={styles.stateContainer}>
            <View style={styles.stateIcon}>
              <Ionicons
                name={
                  transactions.length === 0
                    ? "receipt-outline"
                    : "search-outline"
                }
                size={28}
                color={COLORS.green}
              />
            </View>

            <Text style={styles.stateTitle}>
              {transactions.length === 0
                ? "No transactions yet"
                : "No matching transactions"}
            </Text>

            <Text style={styles.stateDescription}>
              {transactions.length === 0
                ? "Your financial activity will appear here when transactions are recorded."
                : "Try another category or change your search."}
            </Text>

            {(selectedFilter !== "all" ||
              searchQuery.length > 0) && (
              <Pressable
                onPress={() => {
                  setSelectedFilter("all");
                  setSearchQuery("");
                }}
                style={styles.clearFiltersButton}
              >
                <Text style={styles.clearFiltersText}>
                  Clear filters
                </Text>
              </Pressable>
            )}
          </View>
        ) : (
          <View style={styles.transactionsList}>
            {filteredTransactions.map((transaction) => (
              <TransactionCard
                key={transaction.id}
                transaction={transaction}
                onPress={openTransaction}
              />
            ))}
          </View>
        )}

        <Text style={styles.footerText}>
          Siya-Fund • Your financial activity
        </Text>
      </ScrollView>
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
    paddingHorizontal: 24,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: "#0B111D",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  topBarTitleContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    minWidth: 0,
  },
  titleIcon: {
    width: 45,
    height: 45,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.greenBackground,
  },
  titleTextContainer: {
    flex: 1,
    minWidth: 0,
  },
  pageTitle: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: "800",
  },
  pageSubtitle: {
    color: COLORS.muted,
    fontSize: 11,
    marginTop: 4,
  },
  backButton: {
    minHeight: 40,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surfaceLight,
  },
  backButtonText: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: "700",
  },
  scrollView: {
    flex: 1,
  },
  content: {
    width: "100%",
    maxWidth: 1100,
    alignSelf: "center",
    paddingHorizontal: 18,
    paddingTop: 25,
    paddingBottom: 35,
  },
  desktopContent: {
    paddingHorizontal: 30,
    paddingTop: 32,
  },
  intro: {
    marginBottom: 22,
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: "800",
  },
  introText: {
    color: COLORS.muted,
    fontSize: 12,
    lineHeight: 19,
    marginTop: 7,
  },
  summaryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 30,
  },
  summaryCard: {
    flex: 1,
    minWidth: 95,
    minHeight: 125,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  summaryIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.greenBackground,
    marginBottom: 12,
  },
  completedIcon: {
    backgroundColor: "#142B27",
  },
  pendingIcon: {
    backgroundColor: "#30291A",
  },
  summaryLabel: {
    color: COLORS.muted,
    fontSize: 11,
    fontWeight: "600",
  },
  summaryValue: {
    color: COLORS.text,
    fontSize: 24,
    fontWeight: "800",
    marginTop: 5,
    fontVariant: ["tabular-nums"],
  },
  listHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 14,
  },
  resultCount: {
    color: COLORS.muted,
    fontSize: 11,
  },
  searchContainer: {
    minHeight: 49,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    backgroundColor: COLORS.surface,
  },
  searchInput: {
    flex: 1,
    minWidth: 0,
    color: COLORS.text,
    fontSize: 12,
    paddingVertical: 12,
    outlineStyle: "none",
  } as object,
  filterScroll: {
    flexGrow: 0,
    marginBottom: 18,
  },
  filterList: {
    gap: 8,
    paddingBottom: 2,
  },
  filterButton: {
    minHeight: 36,
    justifyContent: "center",
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  filterButtonActive: {
    backgroundColor: COLORS.greenBackground,
    borderColor: COLORS.green,
  },
  filterText: {
    color: COLORS.muted,
    fontSize: 11,
    fontWeight: "700",
  },
  filterTextActive: {
    color: COLORS.green,
  },
  transactionsList: {
    gap: 0,
  },
  stateContainer: {
    minHeight: 250,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 22,
    paddingVertical: 35,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  stateIcon: {
    width: 62,
    height: 62,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.greenBackground,
    marginBottom: 16,
  },
  stateTitle: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: "800",
    textAlign: "center",
  },
  stateDescription: {
    maxWidth: 340,
    color: COLORS.muted,
    fontSize: 12,
    lineHeight: 19,
    textAlign: "center",
    marginTop: 9,
  },
  retryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    minHeight: 42,
    paddingHorizontal: 18,
    borderRadius: 10,
    backgroundColor: COLORS.green,
    marginTop: 18,
  },
  retryButtonText: {
    color: "#08120E",
    fontSize: 12,
    fontWeight: "800",
  },
  clearFiltersButton: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginTop: 14,
  },
  clearFiltersText: {
    color: COLORS.green,
    fontSize: 12,
    fontWeight: "700",
  },
  footerText: {
    color: COLORS.muted,
    fontSize: 10,
    textAlign: "center",
    marginTop: 28,
  },
  pressed: {
    opacity: 0.75,
  },
});
