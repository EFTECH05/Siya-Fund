import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Loan, formatLoanAmount, formatLoanDate, loanStatusColor, loanStatusLabel } from "../../models/Loan";

export default function LoanCard({ loan, onPress }: { loan: Loan; onPress: () => void }) {
  const status = loanStatusLabel(loan.status);
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={`View loan: ${formatLoanAmount(loan)}, ${status}, applied ${formatLoanDate(loan.applicationDate)}`} onPress={onPress} style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      <View style={styles.row}>
        <Text style={styles.amount}>{formatLoanAmount(loan)}</Text>
        <Text style={[styles.status, { color: loanStatusColor(loan.status) }]}>{status}</Text>
      </View>
      {!!loan.groupName && <Text style={styles.group}>{loan.groupName}</Text>}
      <Text style={styles.date}>Applied: {formatLoanDate(loan.applicationDate)}</Text>
      <Text style={styles.link}>View details ›</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: "white", padding: 20, borderRadius: 16, borderWidth: 1, borderColor: "#D7E2DA", marginBottom: 14 },
  pressed: { opacity: 0.75 },
  row: { flexDirection: "row", flexWrap: "wrap", gap: 12, justifyContent: "space-between", alignItems: "center" },
  amount: { fontSize: 23, fontWeight: "700", color: "#17231B" },
  status: { fontWeight: "700", backgroundColor: "#F4F8F5", paddingVertical: 6, paddingHorizontal: 10, borderRadius: 8 },
  group: { color: "#17231B", fontWeight: "600", marginTop: 12 },
  date: { color: "#66756B", marginTop: 12 },
  link: { color: "#15803D", fontWeight: "600", marginTop: 16 },
});
