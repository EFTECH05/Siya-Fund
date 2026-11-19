
import React, { useState } from "react";

import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { router } from "expo-router";

import { createLoanRequest } from "../../services/LoanService";

// ==========================================
// LOAN REQUEST SCREEN
// ==========================================

export default function LoanRequestScreen() {
  const [amount, setAmount] = useState("");
  const [purpose, setPurpose] = useState("");
  const [termMonths, setTermMonths] = useState(6);

  const [submitting, setSubmitting] = useState(false);

  // ========================================
  // VALIDATE INPUT
  // ========================================

  function validateForm(): string | null {
    const numericAmount = Number(amount);

    if (!amount.trim() || !Number.isFinite(numericAmount)) {
      return "Please enter a valid loan amount.";
    }

    if (numericAmount <= 0) {
      return "Loan amount must be greater than zero.";
    }

    if (!purpose.trim()) {
      return "Please explain why you need the loan.";
    }

    if (
      !Number.isInteger(termMonths) ||
      termMonths < 1 ||
      termMonths > 120
    ) {
      return "Please select a valid repayment period.";
    }

    return null;
  }

  // ========================================
  // SUBMIT LOAN APPLICATION
  // ========================================

  async function handleSubmit() {
    const validationError = validateForm();

    if (validationError) {
      Alert.alert("Invalid Application", validationError);
      return;
    }

    try {
      setSubmitting(true);

      await createLoanRequest({
        amount: Number(amount),
        purpose: purpose.trim(),
        termMonths,
      });

      Alert.alert(
        "Application Submitted",
        "Your loan application has been submitted successfully. It is now awaiting Super Admin review.",
        [
          {
            text: "View My Loans",
            onPress: () => router.replace("/loans"),
          },
        ],
      );
    } catch (error) {
      Alert.alert(
        "Submission Failed",
        error instanceof Error
          ? error.message
          : "Unable to submit your loan application.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  // ========================================
  // SCREEN
  // ========================================

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backText}>
            ← Back to My Loans
          </Text>
        </Pressable>

        <Text style={styles.heading}>
          Apply for a Loan
        </Text>

        <Text style={styles.subtitle}>
          Complete the information below to submit your loan application.
        </Text>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>
            Interest-free Loans
          </Text>

          <Text style={styles.infoText}>
            Siya Fund loans have a 0% interest rate. Your application
            will be reviewed by a Super Admin before approval.
          </Text>
        </View>

        {/* LOAN AMOUNT */}

        <Text style={styles.label}>
          Loan Amount (ZAR)
        </Text>

        <View style={styles.inputContainer}>
          <Text style={styles.currency}>R</Text>

          <TextInput
            style={styles.amountInput}
            value={amount}
            onChangeText={(value) =>
              setAmount(value.replace(/[^0-9.]/g, ""))
            }
            placeholder="Enter amount"
            placeholderTextColor="#94A3B8"
            keyboardType="decimal-pad"
          />
        </View>

        {/* LOAN PURPOSE */}

        <Text style={styles.label}>
          Loan Purpose
        </Text>

        <TextInput
          style={styles.textArea}
          value={purpose}
          onChangeText={setPurpose}
          placeholder="Explain why you need the loan..."
          placeholderTextColor="#94A3B8"
          multiline
          numberOfLines={5}
          textAlignVertical="top"
          maxLength={500}
        />

        <Text style={styles.characterCount}>
          {purpose.length}/500 characters
        </Text>

        {/* REPAYMENT TERM */}

        <Text style={styles.label}>
          Repayment Period
        </Text>

        <Text style={styles.termDescription}>
          Select how many months you need to repay the loan.
        </Text>

        <View style={styles.termGrid}>
          {[3, 6, 9, 12, 18, 24].map((months) => {
            const selected = termMonths === months;

            return (
              <Pressable
                key={months}
                style={[
                  styles.termOption,
                  selected && styles.selectedTerm,
                ]}
                onPress={() => setTermMonths(months)}
              >
                <Text
                  style={[
                    styles.termText,
                    selected && styles.selectedTermText,
                  ]}
                >
                  {months} months
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* SUMMARY */}

        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>
            Application Summary
          </Text>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>
              Requested Amount
            </Text>

            <Text style={styles.summaryValue}>
              R{" "}
              {Number(amount || 0).toLocaleString("en-ZA", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>
              Interest Rate
            </Text>

            <Text style={styles.summaryValue}>
              0%
            </Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>
              Repayment Period
            </Text>

            <Text style={styles.summaryValue}>
              {termMonths} months
            </Text>
          </View>
        </View>

        {/* SUBMIT */}

        <Pressable
          style={[
            styles.submitButton,
            submitting && styles.disabledButton,
          ]}
          onPress={handleSubmit}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.submitButtonText}>
              Submit Loan Application
            </Text>
          )}
        </Pressable>

        <Text style={styles.disclaimer}>
          Submitting this application does not guarantee approval.
          A Super Admin must review your request.
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
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
    paddingBottom: 45,
  },

  backButton: {
    marginTop: 15,
    marginBottom: 24,
  },

  backText: {
    color: "#16A34A",
    fontSize: 15,
    fontWeight: "600",
  },

  heading: {
    fontSize: 27,
    fontWeight: "bold",
    color: "#172033",
  },

  subtitle: {
    color: "#64748B",
    fontSize: 14,
    lineHeight: 21,
    marginTop: 7,
    marginBottom: 20,
  },

  infoCard: {
    backgroundColor: "#DCFCE7",
    borderRadius: 13,
    padding: 16,
    marginBottom: 24,
  },

  infoTitle: {
    color: "#166534",
    fontWeight: "bold",
    fontSize: 15,
  },

  infoText: {
    color: "#166534",
    fontSize: 13,
    lineHeight: 20,
    marginTop: 6,
  },

  label: {
    color: "#172033",
    fontWeight: "600",
    fontSize: 14,
    marginBottom: 9,
    marginTop: 18,
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 54,
  },

  currency: {
    color: "#64748B",
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 10,
  },

  amountInput: {
    flex: 1,
    color: "#172033",
    fontSize: 16,
  },

  textArea: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    padding: 14,
    minHeight: 120,
    color: "#172033",
    fontSize: 14,
  },

  characterCount: {
    textAlign: "right",
    color: "#94A3B8",
    fontSize: 11,
    marginTop: 5,
  },

  termDescription: {
    color: "#64748B",
    fontSize: 12,
    marginBottom: 12,
  },

  termGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },

  termOption: {
    width: "30%",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },

  selectedTerm: {
    backgroundColor: "#16A34A",
    borderColor: "#16A34A",
  },

  termText: {
    color: "#475569",
    fontWeight: "600",
    fontSize: 12,
  },

  selectedTermText: {
    color: "#FFFFFF",
  },

  summaryCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 17,
    marginTop: 25,
  },

  summaryTitle: {
    color: "#172033",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 15,
  },

  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  summaryLabel: {
    color: "#64748B",
    fontSize: 13,
  },

  summaryValue: {
    color: "#172033",
    fontSize: 13,
    fontWeight: "bold",
  },

  submitButton: {
    backgroundColor: "#16A34A",
    borderRadius: 12,
    height: 54,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 25,
  },

  disabledButton: {
    opacity: 0.6,
  },

  submitButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 15,
  },

  disclaimer: {
    textAlign: "center",
    color: "#94A3B8",
    fontSize: 11,
    lineHeight: 17,
    marginTop: 14,
  },
});
