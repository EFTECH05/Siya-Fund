import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { onAuthStateChanged } from "firebase/auth";
import { router } from "expo-router";
import { auth } from "../../services/firebase";
import { LoanSubmission } from "../../services/LoanService";
import { prepareLoanRequest } from "../../controllers/LoanController";

export default function LoanRequestScreen() {
  const [ready, setReady] = useState(false);
  const [amount, setAmount] = useState("");
  const [purpose, setPurpose] = useState("");
  const [repaymentMonths, setRepaymentMonths] = useState("12");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const submission = useRef<LoanSubmission | null>(null);
  const submitting = useRef(false);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    const unsubscribe = onAuthStateChanged(auth, user => {
      submission.current = null;
      setAmount(""); setPurpose(""); setRepaymentMonths("12"); setError("");
      setReady(!!user);
      if (!user) router.replace("/login");
    });
    return () => { mounted.current = false; unsubscribe(); };
  }, []);

  const change = (setter: (value: string) => void, value: string) => {
    submission.current = null;
    setter(value); setError("");
  };

  const submit = async () => {
    if (submitting.current) return;
    const uid = auth.currentUser?.uid;
    if (!uid) { router.replace("/login"); return; }
    setError("");
    try {
      if (!submission.current) submission.current = prepareLoanRequest({ amount, purpose, repaymentMonths });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Please check your loan details.");
      return;
    }
    submitting.current = true; setBusy(true);
    try {
      const id = await submission.current.submit();
      if (mounted.current && auth.currentUser?.uid === uid) {
        router.replace({ pathname: "/loans/[id]", params: { id } });
      }
    } catch (err) {
      if (mounted.current && auth.currentUser?.uid === uid) {
        const code = (err as { code?: string }).code;
        setError(code === "permission-denied"
          ? "You do not have permission to submit a loan application. Please contact support."
          : "We could not confirm your application. Please check your connection and retry without changing the form.");
      }
    } finally {
      submitting.current = false;
      if (mounted.current) setBusy(false);
    }
  };

  if (!ready) return <View style={styles.page}><ActivityIndicator accessibilityLabel="Loading loan request" color="#15803D" /></View>;
  return (
    <KeyboardAvoidingView style={styles.page} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Pressable disabled={busy} onPress={() => router.replace("/loans")}><Text style={styles.link}>‹ My Loan Applications</Text></Pressable>
        <Text style={styles.title}>Request a Loan</Text>
        <Text style={styles.subtitle}>Submit your application and track its progress. New requests start as pending.</Text>
        <View style={styles.card}>
          <Text style={styles.label}>Requested amount (R)</Text>
          <TextInput accessibilityLabel="Requested amount in rand" style={styles.input} value={amount} onChangeText={value => change(setAmount, value)} keyboardType="decimal-pad" placeholder="2500.00" editable={!busy} />
          <Text style={styles.hint}>Use a decimal point, without spaces or commas.</Text>
          <Text style={styles.label}>Loan purpose</Text>
          <TextInput accessibilityLabel="Loan purpose" style={[styles.input, styles.purpose]} value={purpose} onChangeText={value => change(setPurpose, value)} placeholder="What will you use the loan for?" multiline maxLength={500} editable={!busy} />
          <Text style={styles.label}>Repayment term in months (1–120)</Text>
          <TextInput accessibilityLabel="Repayment term in months" style={styles.input} value={repaymentMonths} onChangeText={value => change(setRepaymentMonths, value)} keyboardType="number-pad" placeholder="12" editable={!busy} />
          {!!error && <Text accessibilityRole="alert" style={styles.error}>{error}</Text>}
          <Pressable accessibilityRole="button" onPress={submit} disabled={busy} style={[styles.button, busy && styles.disabled]}>
            <Text style={styles.buttonText}>{busy ? "Submitting…" : "Submit Application"}</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#F4F8F5" },
  content: { padding: 24, width: "100%", maxWidth: 580, alignSelf: "center" },
  title: { fontSize: 30, fontWeight: "700", color: "#17231B", marginTop: 24 },
  subtitle: { color: "#66756B", lineHeight: 22, marginTop: 10, marginBottom: 24 },
  card: { backgroundColor: "white", padding: 24, borderRadius: 20 },
  label: { color: "#17231B", fontWeight: "600", marginTop: 16, marginBottom: 8 },
  input: { borderColor: "#D7E2DA", borderWidth: 1, borderRadius: 12, padding: 14, fontSize: 16, color: "#17231B" },
  purpose: { minHeight: 100, textAlignVertical: "top" },
  hint: { color: "#66756B", fontSize: 12, marginTop: 6 },
  link: { color: "#15803D", fontWeight: "600", paddingVertical: 8 },
  button: { backgroundColor: "#15803D", padding: 16, borderRadius: 12, alignItems: "center", marginTop: 24 },
  buttonText: { color: "white", fontWeight: "700" },
  disabled: { opacity: 0.6 },
  error: { color: "#B91C1C", lineHeight: 22, marginTop: 16 },
});
