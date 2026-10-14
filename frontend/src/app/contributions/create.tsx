
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

import { createContribution } from "../../services/ContributionService";

const C = {
  bg: "#080D17",
  card: "#0D1422",
  border: "#202B3D",
  green: "#39D98A",
  text: "#F4F7FC",
  muted: "#8290A6",
  red: "#F28B82",
};

export default function CreateContributionRoute() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit() {
    setError("");

    const parsedAmount = Number(amount.replace(/,/g, "").trim());

    if (!title.trim()) {
      setError("Enter a title for your contribution.");
      return;
    }

    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      setError("Enter a valid amount greater than zero.");
      return;
    }

    setSaving(true);

    try {
      await createContribution({
        title: title.trim(),
        amount: parsedAmount,
        description: description.trim(),
      });

      Alert.alert(
        "Contribution recorded",
        "Your contribution request has been saved as pending. This does not confirm payment.",
        [
          {
            text: "View contributions",
            onPress: () => router.replace("/contributions"),
          },
        ],
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not create your contribution. Please try again.",
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
          <Ionicons name="wallet-outline" size={28} color={C.green} />
        </View>

        <Text style={styles.eyebrow}>BUILD YOUR SAVINGS</Text>
        <Text style={styles.title}>New contribution</Text>
        <Text style={styles.subtitle}>
          Enter the details of your contribution below.
        </Text>

        <View style={styles.formCard}>
          <Text style={styles.label}>Contribution title</Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="e.g. Monthly savings"
            placeholderTextColor={C.muted}
            maxLength={100}
            style={styles.input}
            editable={!saving}
          />

          <Text style={styles.label}>Amount (ZAR)</Text>
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

          <Text style={styles.label}>Description (optional)</Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="Add a note about this contribution"
            placeholderTextColor={C.muted}
            multiline
            numberOfLines={4}
            maxLength={500}
            textAlignVertical="top"
            style={[styles.input, styles.textArea]}
            editable={!saving}
          />

          <View style={styles.notice}>
            <Ionicons
              name="information-circle-outline"
              size={19}
              color={C.green}
            />
            <Text style={styles.noticeText}>
              Submitting creates a pending record. Payment must be confirmed
              separately before it is marked completed.
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
                <Ionicons name="checkmark-circle-outline" size={20} color="#07130D" />
                <Text style={styles.submitText}>Submit contribution</Text>
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
  input: {
    minHeight: 48,
    color: C.text,
    backgroundColor: "#080D17",
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
    backgroundColor: "#080D17",
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 11,
    paddingHorizontal: 14,
  },
  currency: { color: C.green, fontSize: 18, fontWeight: "800", marginRight: 10 },
  amountField: { flex: 1, color: C.text, fontSize: 20, fontWeight: "700", paddingVertical: 10 },
  textArea: { minHeight: 100, paddingTop: 13 },
  notice: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 9,
    backgroundColor: "#142B27",
    borderRadius: 11,
    padding: 12,
    marginTop: 8,
  },
  noticeText: { flex: 1, color: "#B7D9C9", fontSize: 11, lineHeight: 17 },
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
