import React from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { useLoanApplications } from "../../hooks/use-loan-applications";
import { formatLoanAmount, formatLoanDate, loanStatusColor, loanStatusLabel } from "../../models/Loan";
import { styles as shared } from "./LoansScreen";

export default function LoanDetailsScreen({ id }: { id: string }) {
  const { loans, loading, error, refresh } = useLoanApplications(id);
  const loan = loans[0];
  return (
    <ScrollView style={shared.page} contentContainerStyle={shared.content}>
      <Pressable onPress={() => router.replace("/loans")}><Text style={shared.link}>‹ My Loan Applications</Text></Pressable>
      <Text style={[shared.title, styles.title]}>Loan Details</Text>
      {loading ? <ActivityIndicator accessibilityLabel="Loading loan details" color="#15803D" /> : error ? (
        <View style={shared.message}><Text accessibilityRole="alert" style={shared.error}>{error}</Text><Pressable onPress={refresh}><Text style={shared.link}>Try Again</Text></Pressable></View>
      ) : !loan ? (
        <View style={shared.message}><Text style={shared.emptyTitle}>Loan unavailable</Text><Text style={shared.subtitle}>This loan does not exist or you do not have permission to view it.</Text></View>
      ) : (
        <View style={shared.message}>
          <Text style={styles.amount}>{formatLoanAmount(loan)}</Text>
          <Text style={[styles.status, { color: loanStatusColor(loan.status) }]}>{loanStatusLabel(loan.status)}</Text>
          <Detail label="Application date" value={formatLoanDate(loan.applicationDate)} />
          <Detail label="Application reference" value={loan.id} />
          {(!!loan.groupName || !!loan.groupId) && <Detail label="Group" value={loan.groupName || loan.groupId} />}
          {!!loan.purpose && <Detail label="Purpose" value={loan.purpose} />}
          {loan.repaymentMonths !== null && <Detail label="Repayment term" value={`${loan.repaymentMonths} months`} />}
          {loan.interestRate !== null && <Detail label="Interest rate" value={`${loan.interestRate}%`} />}
          {!!loan.decisionDate && <Detail label="Decision date" value={formatLoanDate(loan.decisionDate)} />}
          <Pressable accessibilityRole="button" onPress={refresh}><Text style={shared.link}>Refresh Status</Text></Pressable>
        </View>
      )}
    </ScrollView>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return <View style={styles.detail}><Text style={styles.label}>{label}</Text><Text style={styles.value}>{value}</Text></View>;
}

const styles = StyleSheet.create({
  title: { marginVertical: 24 },
  amount: { color: "#17231B", fontSize: 32, fontWeight: "700" },
  status: { fontSize: 16, fontWeight: "700", marginTop: 8, marginBottom: 12 },
  detail: { paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: "#E5ECE7" },
  label: { color: "#66756B", marginBottom: 6 },
  value: { color: "#17231B", fontSize: 16, lineHeight: 24 },
});
