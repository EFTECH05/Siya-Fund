
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import {
  approveLoan,
  rejectLoan,
  disburseLoan,
  getAllLoans,
  getLoanRepayments,
  recordRepayment,
} from "../../services/LoanAdminService";

import type {
  LoanAdminRecord,
  LoanRepayment,
} from "../../services/LoanAdminService";

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
  redLight: "#FDECEA",
  blue: "#245DA8",
  blueLight: "#EAF2FF",
};

type ModalAction = "reject" | "repayment";

function formatAmount(amount: number): string {
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
  }).format(amount);
}

function formatDate(value: unknown): string {
  if (!value) return "Date unavailable";

  let date: Date | null = null;

  if (value instanceof Date) {
    date = value;
  } else if (
    typeof value === "string" ||
    typeof value === "number"
  ) {
    date = new Date(value);
  } else if (typeof value === "object") {
    const timestamp = value as {
      _seconds?: number;
      seconds?: number;
    };

    const seconds = timestamp._seconds ?? timestamp.seconds;

    if (typeof seconds === "number") {
      date = new Date(seconds * 1000);
    }
  }

  if (!date || Number.isNaN(date.getTime())) {
    return "Date unavailable";
  }

  return date.toLocaleDateString("en-ZA", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getStatusColors(status: LoanAdminRecord["status"]) {
  switch (status) {
    case "pending":
      return { background: C.orangeLight, text: C.orange };
    case "approved":
      return { background: C.blueLight, text: C.blue };
    case "rejected":
    case "cancelled":
      return { background: C.redLight, text: C.red };
    case "disbursed":
      return { background: C.greenLight, text: C.green };
    case "repaid":
      return { background: "#E8F0FF", text: "#245DA8" };
    default:
      return { background: C.border, text: C.muted };
  }
}

export default function SuperAdminLoansScreen() {
  const [loans, setLoans] = useState<LoanAdminRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalAction, setModalAction] = useState<ModalAction>("reject");
  const [selectedLoan, setSelectedLoan] =
    useState<LoanAdminRecord | null>(null);
  const [modalInput, setModalInput] = useState("");
  const [modalNote, setModalNote] = useState("");

  const loadLoans = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setError(null);

    try {
      const result = await getAllLoans();
      setLoans(result);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Unable to load loan applications.";

      setError(message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void loadLoans();
  }, [loadLoans]);

  const closeModal = () => {
    setModalVisible(false);
    setSelectedLoan(null);
    setModalInput("");
    setModalNote("");
  };

  const handleApprove = (loan: LoanAdminRecord) => {
    Alert.alert(
      "Approve loan application?",
      `Approve this loan application for ${formatAmount(loan.amount)}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Approve",
          onPress: () => {
            void (async () => {
              setBusyId(loan.id);
              setError(null);

              try {
                await approveLoan(loan.id);
                Alert.alert("Loan approved", "The application was approved.");
                await loadLoans();
              } catch (err) {
                const message =
                  err instanceof Error
                    ? err.message
                    : "Unable to approve this loan.";

                setError(message);
                Alert.alert("Approval failed", message);
              } finally {
                setBusyId(null);
              }
            })();
          },
        },
      ],
    );
  };

  const openRejectModal = (loan: LoanAdminRecord) => {
    setSelectedLoan(loan);
    setModalAction("reject");
    setModalInput("");
    setModalNote("");
    setModalVisible(true);
  };

  const handleDisbursement = (loan: LoanAdminRecord) => {
    Alert.alert(
      "Record loan disbursement?",
      `Only continue after confirming that ${formatAmount(loan.amount)} has actually been transferred to the member.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Confirm disbursement",
          onPress: () => {
            void (async () => {
              setBusyId(loan.id);
              setError(null);

              try {
                await disburseLoan(loan.id);
                Alert.alert(
                  "Disbursement recorded",
                  "The repayment schedule has been generated.",
                );
                await loadLoans();
              } catch (err) {
                const message =
                  err instanceof Error
                    ? err.message
                    : "Unable to record disbursement.";

                setError(message);
                Alert.alert("Disbursement failed", message);
              } finally {
                setBusyId(null);
              }
            })();
          },
        },
      ],
    );
  };

  const openRepaymentModal = (loan: LoanAdminRecord) => {
    setSelectedLoan(loan);
    setModalAction("repayment");
    setModalInput("");
    setModalNote("");
    setModalVisible(true);
  };

  const handleModalSubmit = async () => {
    if (!selectedLoan) return;

    const loan = selectedLoan;

    if (modalAction === "reject" && !modalInput.trim()) {
      Alert.alert(
        "Reason required",
        "Please provide a reason for rejecting this application.",
      );
      return;
    }

    if (modalAction === "repayment") {
      const amount = Number(modalInput);

      if (!Number.isFinite(amount) || amount <= 0) {
        Alert.alert("Invalid amount", "Enter a valid repayment amount.");
        return;
      }

      const outstanding =
        (loan.outstandingBalanceCents ?? 0) / 100;

      if (amount > outstanding) {
        Alert.alert(
          "Amount too high",
          `The outstanding balance is ${formatAmount(outstanding)}.`,
        );
        return;
      }
    }

    setBusyId(loan.id);
    setError(null);

    try {
      if (modalAction === "reject") {
        await rejectLoan(loan.id, modalInput.trim());

        Alert.alert(
          "Application rejected",
          "The loan application has been rejected.",
        );
      } else {
        await recordRepayment(
          loan.id,
          Number(modalInput),
          modalNote,
        );

        Alert.alert(
          "Repayment recorded",
          "The repayment has been saved successfully.",
        );
      }

      closeModal();
      await loadLoans();
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Unable to complete this action.";

      setError(message);
      Alert.alert("Action failed", message);
    } finally {
      setBusyId(null);
    }
  };

  const handleRepaymentHistory = async (
    loan: LoanAdminRecord,
  ) => {
    setBusyId(loan.id);

    try {
      const repayments: LoanRepayment[] =
        await getLoanRepayments(loan.id);

      if (repayments.length === 0) {
        Alert.alert(
          "Repayment history",
          "No repayments have been recorded for this loan.",
        );
        return;
      }

      const history = repayments
        .map(
          (item, index) =>
            `${index + 1}. ${formatAmount(item.amount)}\n` +
            `Date: ${formatDate(item.paidAt)}\n` +
            `Note: ${item.note || "No note"}`,
        )
        .join("\n\n");

      Alert.alert("Repayment history", history);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Unable to retrieve repayment history.";

      Alert.alert("History unavailable", message);
    } finally {
      setBusyId(null);
    }
  };

  const pendingCount = loans.filter(
    (loan) => loan.status === "pending",
  ).length;

  const activeCount = loans.filter(
    (loan) => loan.status === "disbursed",
  ).length;

  const totalOutstanding = loans.reduce(
    (total, loan) =>
      total + (loan.outstandingBalanceCents ?? 0),
    0,
  );

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
          onPress={() => router.replace("/super-admin")}
          style={styles.backButton}
          accessibilityRole="button"
        >
          <Ionicons name="arrow-back" size={19} color={C.green} />
          <Text style={styles.backText}>Back to Dashboard</Text>
        </Pressable>

        <View style={styles.header}>
          <Text style={styles.eyebrow}>SIYA-FUND ADMINISTRATION</Text>
          <Text style={styles.title}>Loan Management</Text>
          <Text style={styles.subtitle}>
            Review applications, manage approved loans, record
            disbursements and track member repayments.
          </Text>
        </View>

        <View style={styles.summaryGrid}>
          <View style={styles.summaryCard}>
            <Ionicons name="time-outline" size={23} color={C.orange} />
            <Text style={styles.summaryLabel}>Pending applications</Text>
            <Text style={styles.summaryValue}>
              {loading ? "—" : pendingCount}
            </Text>
          </View>

          <View style={styles.summaryCard}>
            <Ionicons name="wallet-outline" size={23} color={C.green} />
            <Text style={styles.summaryLabel}>Active loans</Text>
            <Text style={styles.summaryValue}>
              {loading ? "—" : activeCount}
            </Text>
          </View>

          <View style={styles.summaryCard}>
            <Ionicons name="cash-outline" size={23} color={C.blue} />
            <Text style={styles.summaryLabel}>Outstanding balance</Text>
            <Text style={styles.summaryAmount}>
              {loading ? "—" : formatAmount(totalOutstanding / 100)}
            </Text>
          </View>
        </View>

        {error && (
          <View style={styles.errorBox}>
            <Ionicons
              name="alert-circle-outline"
              size={20}
              color={C.red}
            />
            <Text style={styles.errorText}>{error}</Text>
            <Pressable onPress={() => void loadLoans()}>
              <Text style={styles.retryText}>Retry</Text>
            </Pressable>
          </View>
        )}

        {loading ? (
          <View style={styles.centerState}>
            <ActivityIndicator size="large" color={C.green} />
            <Text style={styles.stateText}>
              Loading loan applications...
            </Text>
          </View>
        ) : loans.length === 0 ? (
          <View style={styles.emptyCard}>
            <Ionicons
              name="file-tray-outline"
              size={38}
              color={C.green}
            />
            <Text style={styles.emptyTitle}>No loan applications</Text>
            <Text style={styles.emptyText}>
              Loan applications submitted by members will appear here.
            </Text>
            <Pressable
              style={styles.secondaryButton}
              onPress={() => void loadLoans(true)}
            >
              <Text style={styles.secondaryButtonText}>Refresh list</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.list}>
            <View style={styles.listHeader}>
              <Text style={styles.sectionTitle}>All loan applications</Text>
              <Pressable
                onPress={() => void loadLoans(true)}
                style={styles.refreshButton}
              >
                <Ionicons name="refresh" size={20} color={C.green} />
              </Pressable>
            </View>

            {loans.map((loan) => {
              const isBusy = busyId === loan.id;
              const statusColors = getStatusColors(loan.status);

              return (
                <View key={loan.id} style={styles.card}>
                  <View style={styles.cardTop}>
                    <View style={styles.loanIcon}>
                      <Ionicons
                        name="wallet-outline"
                        size={22}
                        color={C.green}
                      />
                    </View>

                    <View style={styles.cardHeading}>
                      <Text style={styles.loanTitle}>
                        Loan application
                      </Text>
                      <Text style={styles.dateText}>
                        Submitted {formatDate(loan.createdAt)}
                      </Text>
                    </View>

                    <View
                      style={[
                        styles.statusBadge,
                        { backgroundColor: statusColors.background },
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusText,
                          { color: statusColors.text },
                        ]}
                      >
                        {loan.status.toUpperCase()}
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.amount}>
                    {formatAmount(loan.amount)}
                  </Text>

                  <Text style={styles.detailLabel}>Purpose</Text>
                  <Text style={styles.detailValue}>{loan.purpose}</Text>

                  <View style={styles.infoRow}>
                    <View style={styles.infoItem}>
                      <Text style={styles.detailLabel}>Loan term</Text>
                      <Text style={styles.infoValue}>
                        {loan.termMonths} months
                      </Text>
                    </View>

                    <View style={styles.infoItem}>
                      <Text style={styles.detailLabel}>Interest</Text>
                      <Text style={styles.infoValue}>0%</Text>
                    </View>
                  </View>

                  <View style={styles.divider} />

                  <Text style={styles.detailLabel}>Member ID</Text>
                  <Text selectable style={styles.detailValue}>
                    {loan.userId}
                  </Text>

                  <Text style={styles.detailLabel}>Loan ID</Text>
                  <Text selectable style={styles.detailValue}>
                    {loan.id}
                  </Text>

                  {loan.status === "disbursed" ||
                  loan.status === "repaid" ? (
                    <View style={styles.balanceBox}>
                      <Text style={styles.balanceLabel}>
                        Outstanding balance
                      </Text>
                      <Text style={styles.balanceValue}>
                        {formatAmount(
                          (loan.outstandingBalanceCents ?? 0) / 100,
                        )}
                      </Text>
                      <Text style={styles.balanceSubtext}>
                        Total repaid:{" "}
                        {formatAmount(
                          (loan.totalRepaidCents ?? 0) / 100,
                        )}
                      </Text>
                    </View>
                  ) : null}

                  {loan.status === "pending" && (
                    <View style={styles.actionGroup}>
                      <Pressable
                        onPress={() => handleApprove(loan)}
                        disabled={busyId !== null}
                        style={[
                          styles.primaryButton,
                          busyId !== null && styles.disabledButton,
                        ]}
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
                            <Text style={styles.primaryButtonText}>
                              Approve application
                            </Text>
                          </>
                        )}
                      </Pressable>

                      <Pressable
                        onPress={() => openRejectModal(loan)}
                        disabled={busyId !== null}
                        style={[
                          styles.rejectButton,
                          busyId !== null && styles.disabledButton,
                        ]}
                      >
                        <Ionicons
                          name="close-circle-outline"
                          size={19}
                          color={C.red}
                        />
                        <Text style={styles.rejectButtonText}>
                          Reject application
                        </Text>
                      </Pressable>
                    </View>
                  )}

                  {loan.status === "approved" && (
                    <View style={styles.warningBox}>
                      <Ionicons
                        name="shield-checkmark-outline"
                        size={19}
                        color={C.orange}
                      />
                      <Text style={styles.warningText}>
                        Confirm that the approved amount has actually
                        been transferred before recording disbursement.
                      </Text>
                      <Pressable
                        onPress={() => handleDisbursement(loan)}
                        disabled={busyId !== null}
                        style={[
                          styles.primaryButton,
                          busyId !== null && styles.disabledButton,
                        ]}
                      >
                        {isBusy ? (
                          <ActivityIndicator color={C.white} />
                        ) : (
                          <Text style={styles.primaryButtonText}>
                            Record disbursement
                          </Text>
                        )}
                      </Pressable>
                    </View>
                  )}

                  {loan.status === "disbursed" && (
                    <View style={styles.actionGroup}>
                      <Pressable
                        onPress={() => openRepaymentModal(loan)}
                        disabled={busyId !== null}
                        style={[
                          styles.primaryButton,
                          busyId !== null && styles.disabledButton,
                        ]}
                      >
                        <Ionicons
                          name="cash-outline"
                          size={19}
                          color={C.white}
                        />
                        <Text style={styles.primaryButtonText}>
                          Record repayment
                        </Text>
                      </Pressable>

                      <Pressable
                        onPress={() => void handleRepaymentHistory(loan)}
                        disabled={busyId !== null}
                        style={styles.secondaryButton}
                      >
                        {isBusy ? (
                          <ActivityIndicator color={C.green} />
                        ) : (
                          <Text style={styles.secondaryButtonText}>
                            View repayment history
                          </Text>
                        )}
                      </Pressable>
                    </View>
                  )}

                  {loan.status === "repaid" && (
                    <View style={styles.completedBox}>
                      <Ionicons
                        name="checkmark-circle"
                        size={20}
                        color={C.green}
                      />
                      <Text style={styles.completedText}>
                        This loan has been fully repaid.
                      </Text>
                    </View>
                  )}

                  {loan.status === "rejected" && loan.rejectionReason ? (
                    <View style={styles.errorBox}>
                      <Text style={styles.errorText}>
                        Rejection reason: {loan.rejectionReason}
                      </Text>
                    </View>
                  ) : null}
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>
              {modalAction === "reject"
                ? "Reject loan application"
                : "Record loan repayment"}
            </Text>

            {modalAction === "reject" ? (
              <>
                <Text style={styles.modalDescription}>
                  Provide a clear reason for rejecting this application.
                </Text>

                <TextInput
                  value={modalInput}
                  onChangeText={setModalInput}
                  placeholder="Enter rejection reason"
                  placeholderTextColor={C.muted}
                  multiline
                  style={[styles.modalInput, styles.multilineInput]}
                />
              </>
            ) : (
              <>
                <Text style={styles.modalDescription}>
                  Enter the amount actually received from the member.
                </Text>

                <Text style={styles.detailLabel}>
                  Outstanding balance
                </Text>
                <Text style={styles.modalBalance}>
                  {selectedLoan
                    ? formatAmount(
                        (selectedLoan.outstandingBalanceCents ?? 0) / 100,
                      )
                    : "—"}
                </Text>

                <TextInput
                  value={modalInput}
                  onChangeText={setModalInput}
                  placeholder="Repayment amount in ZAR"
                  placeholderTextColor={C.muted}
                  keyboardType="decimal-pad"
                  style={styles.modalInput}
                />

                <TextInput
                  value={modalNote}
                  onChangeText={setModalNote}
                  placeholder="Optional payment reference or note"
                  placeholderTextColor={C.muted}
                  style={styles.modalInput}
                />
              </>
            )}

            <View style={styles.modalActions}>
              <Pressable
                onPress={closeModal}
                disabled={busyId !== null}
                style={styles.modalCancel}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </Pressable>

              <Pressable
                onPress={() => void handleModalSubmit()}
                disabled={busyId !== null}
                style={styles.modalConfirm}
              >
                {busyId !== null ? (
                  <ActivityIndicator color={C.white} />
                ) : (
                  <Text style={styles.modalConfirmText}>
                    {modalAction === "reject"
                      ? "Reject application"
                      : "Save repayment"}
                  </Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
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
  summaryGrid: {
    gap: 12,
    marginBottom: 22,
  },
  summaryCard: {
    backgroundColor: C.white,
    borderColor: C.border,
    borderWidth: 1,
    borderRadius: 14,
    padding: 16,
    gap: 7,
  },
  summaryLabel: {
    color: C.muted,
    fontSize: 12,
  },
  summaryValue: {
    color: C.text,
    fontSize: 24,
    fontWeight: "800",
  },
  summaryAmount: {
    color: C.text,
    fontSize: 19,
    fontWeight: "800",
  },
  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    padding: 13,
    borderRadius: 12,
    backgroundColor: C.redLight,
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
  emptyTitle: {
    color: C.text,
    fontSize: 19,
    fontWeight: "800",
    marginTop: 14,
    marginBottom: 8,
  },
  emptyText: {
    color: C.muted,
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
    marginBottom: 20,
  },
  list: {
    gap: 14,
  },
  listHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: {
    color: C.text,
    fontSize: 18,
    fontWeight: "800",
  },
  refreshButton: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: C.greenLight,
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
  loanIcon: {
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
  loanTitle: {
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
  statusBadge: {
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 9,
  },
  statusText: {
    fontSize: 10,
    fontWeight: "800",
  },
  amount: {
    color: C.green,
    fontSize: 25,
    fontWeight: "800",
    marginTop: 18,
    marginBottom: 12,
  },
  detailLabel: {
    color: C.muted,
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
    marginTop: 9,
  },
  detailValue: {
    color: C.text,
    fontSize: 13,
    lineHeight: 19,
  },
  infoRow: {
    flexDirection: "row",
    gap: 30,
    marginTop: 8,
  },
  infoItem: {
    flex: 1,
  },
  infoValue: {
    color: C.text,
    fontSize: 14,
    fontWeight: "700",
  },
  divider: {
    height: 1,
    backgroundColor: C.border,
    marginVertical: 14,
  },
  balanceBox: {
    backgroundColor: C.greenLight,
    padding: 14,
    borderRadius: 11,
    marginTop: 16,
  },
  balanceLabel: {
    color: C.muted,
    fontSize: 12,
  },
  balanceValue: {
    color: C.green,
    fontSize: 22,
    fontWeight: "800",
    marginVertical: 5,
  },
  balanceSubtext: {
    color: C.muted,
    fontSize: 12,
  },
  actionGroup: {
    gap: 10,
    marginTop: 18,
  },
  primaryButton: {
    backgroundColor: C.green,
    borderRadius: 11,
    minHeight: 48,
    paddingVertical: 13,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
    marginTop: 14,
  },
  primaryButtonText: {
    color: C.white,
    fontSize: 14,
    fontWeight: "800",
  },
  rejectButton: {
    borderColor: C.red,
    borderWidth: 1,
    borderRadius: 11,
    minHeight: 46,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
  },
  rejectButtonText: {
    color: C.red,
    fontSize: 14,
    fontWeight: "800",
  },
  secondaryButton: {
    borderColor: C.green,
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 11,
    paddingHorizontal: 17,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryButtonText: {
    color: C.green,
    fontWeight: "700",
    fontSize: 14,
  },
  warningBox: {
    padding: 12,
    backgroundColor: C.orangeLight,
    borderRadius: 10,
    marginTop: 18,
  },
  warningText: {
    color: "#75420C",
    fontSize: 12,
    lineHeight: 18,
    marginTop: 7,
  },
  completedBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    backgroundColor: C.greenLight,
    padding: 12,
    borderRadius: 10,
    marginTop: 16,
  },
  completedText: {
    color: C.green,
    fontSize: 13,
    fontWeight: "700",
  },
  disabledButton: {
    opacity: 0.55,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    padding: 20,
  },
  modalCard: {
    backgroundColor: C.white,
    borderRadius: 18,
    padding: 20,
    width: "100%",
    maxWidth: 480,
    alignSelf: "center",
  },
  modalTitle: {
    color: C.text,
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 9,
  },
  modalDescription: {
    color: C.muted,
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 14,
  },
  modalBalance: {
    color: C.green,
    fontSize: 21,
    fontWeight: "800",
    marginBottom: 12,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 10,
    padding: 13,
    color: C.text,
    fontSize: 14,
    marginBottom: 12,
    minHeight: 48,
  },
  multilineInput: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 8,
  },
  modalCancel: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 10,
    backgroundColor: C.background,
  },
  modalCancelText: {
    color: C.muted,
    fontWeight: "700",
  },
  modalConfirm: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 10,
    backgroundColor: C.green,
    minWidth: 125,
    alignItems: "center",
  },
  modalConfirmText: {
    color: C.white,
    fontWeight: "800",
  },
});
