import React from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import LoanCard from "../components/LoanCard";
import { useLoanApplications } from "../../hooks/use-loan-applications";

export default function LoansScreen() {
  const { loans, loading, error, refresh } = useLoanApplications();
  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.content}>
      <Pressable onPress={() => router.replace("/dashboard")}><Text style={styles.link}>‹ Dashboard</Text></Pressable>
      <View style={styles.header}>
        <Text style={styles.title}>My Loan Applications</Text>
        <Pressable accessibilityRole="button" onPress={refresh} disabled={loading}><Text style={styles.link}>Refresh</Text></Pressable>
      </View>
      <Text style={styles.subtitle}>Track the progress of your loan requests.</Text>
      <Pressable accessibilityRole="button" onPress={() => router.push("/loans/request")}><Text style={styles.link}>+ Request a Loan</Text></Pressable>
      {loading ? <ActivityIndicator accessibilityLabel="Loading loan applications" color="#15803D" /> : error ? (
        <View style={styles.message}>
          <Text accessibilityRole="alert" style={styles.error}>{error}</Text>
          <Pressable accessibilityRole="button" onPress={refresh}><Text style={styles.link}>Try Again</Text></Pressable>
        </View>
      ) : loans.length === 0 ? (
        <View style={styles.message}><Text style={styles.emptyTitle}>No loan applications yet</Text><Text style={styles.subtitle}>Your applications will appear here once a loan request has been recorded.</Text></View>
      ) : loans.map(loan => <LoanCard key={loan.id} loan={loan} onPress={() => router.push({ pathname: "/loans/[id]", params: { id: loan.id } })} />)}
    </ScrollView>
  );
}

export const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#F4F8F5" },
  content: { padding: 24, width: "100%", maxWidth: 760, alignSelf: "center" },
  header: { flexDirection: "row", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 16, marginTop: 24 },
  title: { fontSize: 28, fontWeight: "700", color: "#17231B" },
  subtitle: { color: "#66756B", lineHeight: 22, marginTop: 10, marginBottom: 24 },
  link: { color: "#15803D", fontWeight: "600", paddingVertical: 8 },
  message: { backgroundColor: "white", padding: 24, borderRadius: 16 },
  emptyTitle: { color: "#17231B", fontWeight: "600", fontSize: 20 },
  error: { color: "#B91C1C", lineHeight: 22, marginBottom: 12 },
});
