
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
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { createLoanRequest } from "../../services/LoanService";

const C = {
  bg: "#080D17",
  card: "#0D1422",
  border: "#202B3D",
  green: "#39D98A",
  text: "#F4F7FC",
  muted: "#8290A6",
  red: "#F28B82",
  blue: "#83B7FF",
};

export default function LoanRequestRoute() {
  const router = useRouter();
  const [amount, setAmount] = useState("");
  const [purpose, setPurpose] = useState("");
  const [termMonths, setTermMonths] = useState(12);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit() {
    setError("");

    const parsedAmount = Number(amount.replace(/,/g, "").trim());

    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      setError("Enter a valid loan amount greater than zero.");
      return;
    }

    if (!purpose.trim()) {
      setError("Explain the purpose of your loan.");
      return;
    }

    setSaving(true);

    try {
      await createLoanRequest({
        amount: parsedAmount,
        purpose: purpose.trim(),
        termMonths,
      });

      Alert.alert(
        "Request submitted",
        "Your loan application has been submitted for review. This is not an approval or confirmation of payment.",
        [
          {
            text: "View my loans",
            onPress: () => router.replace("/loans"),
          },
        ],
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not submit your loan request. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.content}
      >
        <Pressable
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={18} color={C.text} />
          <Text style={styles.backText}>Back</Text>
        </Pressable>

        <View style={styles.headerIcon}>
          <Ionicons name="cash-outline" size={28} color={C.green} />
        </View>

        <Text style={styles.eyebrow}>FINANCIAL SUPPORT</Text>
        <Text style={styles.title}>Request a loan</Text>
        <Text style={styles.subtitle}>
          Tell us how much you need and what the loan is for.
        </Text>

        <View style={styles.formCard}>
          <Text style={styles.label}>Loan amount (ZAR)</Text>
          <View style={styles.amountInput}>
            <Text style={styles.currency}>R</Text>
            <TextInput
              value={amount}
              onChangeText={(value) =>
                setAmount(value.replace(/[^0-9.,]/g, ""))
              }
              placeholder="0.00"
              placeholderTextColor={C.muted}
              keyboardType="decimal-pad"
              style={styles.amountField}
              editable={!saving}
            />
          </View>

          <Text style={styles.label}>Purpose of the loan</Text>
          <TextInput
            value={purpose}
            onChangeText={setPurpose}
            placeholder="Explain why you need the loan"
            placeholderTextColor={C.muted}
            multiline
            numberOfLines={4}
            maxLength={1000}
            textAlignVertical="top"
            style={[styles.input, styles.textArea]}
            editable={!saving}
          />

          <Text style={styles.label}>Requested repayment term</Text>
          <Text style={styles.helper}>
            Select a preferred term. Final terms are subject to review.
          </Text>

          <View style={styles.termGrid}>
            {[3, 6, 12, 18, 24, 36].map((months) => {
              const selected = termMonths === months;

              return (
                <Pressable
                  key={months}
                  disabled={saving}
                  onPress={() => setTermMonths(months)}
                  style={[
                    styles.termOption,
                    selected && styles.termOptionSelected,
                  ]}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                >
                  <Text
                    style={[
                      styles.termNumber,
                      selected && styles.termTextSelected,
                    ]}
                  >
                    {months}
                  </Text>
                  <Text
                    style={[
                      styles.termLabel,
                      selected && styles.termTextSelected,
                    ]}
                  >
                    {months === 1 ? "month" : "months"}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <View style={styles.notice}>
            <Ionicons
              name="information-circle-outline"
              size={19}
              color={C.blue}
            />
            <Text style={styles.noticeText}>
              This is a loan application, not a loan agreement. Approval,
              interest, fees, repayment terms and disbursement must be
              confirmed separately.
            </Text>
          </View>

          {!!error && (
            <Text accessibilityRole="alert" style={styles.error}>
              {error}
            </Text>
          )}

          <Pressable
            onPress={() => void handleSubmit()}
            disabled={saving}
            style={[styles.submitButton, saving && styles.disabledButton]}
          >
            {saving ? (
              <ActivityIndicator color="#07130D" />
            ) : (
              <>
                <Ionicons name="send-outline" size={18} color="#07130D" />
                <Text style={styles.submitText}>Submit loan request</Text>
              </>
            )}
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: C.bg },
  content: {
    width: "100%",
    maxWidth: 640,
    alignSelf: "center",
    padding: 22,
    paddingBottom: 48,
  },
  backButton: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 10,
    marginBottom: 24,
  },
  backText: { color: C.muted, fontSize: 13, fontWeight: "600" },
  headerIcon: {
    width: 58,
    height: 58,
    borderRadius: 17,
    backgroundColor: "#142B27",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  eyebrow: {
    color: C.green,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  title: { color: C.text, fontSize: 28, fontWeight: "800" },
  subtitle: { color: C.muted, fontSize: 13, lineHeight: 20, marginTop: 8, marginBottom: 24 },
  formCard: {
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 17,
    padding: 20,
    gap: 10,
  },
  label: { color: C.text, fontSize: 12, fontWeight: "700", marginTop: 7 },
  helper: { color: C.muted, fontSize: 11, lineHeight: 16 },
  input: {
    minHeight: 48,
    color: C.text,
    backgroundColor: C.bg,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 11,
    paddingHorizontal: 13,
    fontSize: 13,
  },
  amountInput: {
    minHeight: 54,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.bg,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 11,
    paddingHorizontal: 14,
  },
  currency: { color: C.green, fontSize: 18, fontWeight: "800", marginRight: 10 },
  amountField: { flex: 1, color: C.text, fontSize: 20, fontWeight: "700", paddingVertical: 10 },
  textArea: { minHeight: 105, paddingTop: 13 },
  termGrid: { flexDirection: "row", flexWrap: "wrap", gap: 9, marginTop: 5 },
  termOption: {
    minWidth: 75,
    flexGrow: 1,
    flexBasis: "28%",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 11,
    paddingVertical: 12,
    backgroundColor: C.bg,
  },
  termOptionSelected: { borderColor: C.green, backgroundColor: "#142B27" },
  termNumber: { color: C.text, fontSize: 17, fontWeight: "800" },
  termLabel: { color: C.muted, fontSize: 10 },
  termTextSelected: { color: C.green },
  notice: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 9,
    backgroundColor: "#111E30",
    borderRadius: 11,
    padding: 12,
    marginTop: 8,
  },
  noticeText: { flex: 1, color: "#B4C6DF", fontSize: 11, lineHeight: 17 },
  error: { color: C.red, fontSize: 12, lineHeight: 18, marginTop: 5 },
  submitButton: {
    minHeight: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
    backgroundColor: C.green,
    borderRadius: 11,
    marginTop: 12,
    paddingHorizontal: 14,
  },
  submitText: { color: "#07130D", fontSize: 13, fontWeight: "800" },
  disabledButton: { opacity: 0.65 },
});
