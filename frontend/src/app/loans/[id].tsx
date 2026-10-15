
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { getLoanById } from "../../services/LoanService";
import type { Loan } from "../../models/Loan";

const C = {
  bg: "#07130D",
  card: "#101E17",
  border: "#25382D",
  text: "#F2F7F3",
  muted: "#9BAFA1",
  green: "#6EE7A0",
  red: "#FF7777",
  blue: "#83B8FF",
};

function formatDate(value: Loan["createdAt"]): string {
  if (!value) return "Not available";
  const date = value instanceof Date ? value : value.toDate();
  return date.toLocaleDateString("en-ZA", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function statusColor(status: Loan["status"]): string {
  if (status === "approved" || status === "disbursed" || status === "repaid") {
    return C.green;
  }
  if (status === "rejected" || status === "cancelled") {
    return C.red;
  }
  return C.blue;
}

export default function LoanDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [loan, setLoan] = useState<Loan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadLoan() {
      try {
        setLoading(true);
        setError("");

        const result = await getLoanById(
          Array.isArray(id) ? id[0] : id ?? "",
        );

        if (active) {
          if (result) {
            setLoan(result);
          } else {
            setError("Loan request not found or you do not have access.");
          }
        }
      } catch (e) {
        if (active) {
          setError(
            e instanceof Error
              ? e.message
              : "Unable to load this loan request.",
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadLoan();

    return () => {
      active = false;
    };
  }, [id]);

  return (
    <>
      <Stack.Screen options={{ title: "Loan details", headerShown: false }} />

      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.content}
      >
        <Pressable
          onPress={() => router.back()}
          style={styles.backButton}
          accessibilityRole="button"
        >
          <Ionicons name="arrow-back" size={19} color={C.text} />
          <Text style={styles.backText}>Back</Text>
        </Pressable>

        <View style={styles.iconBox}>
          <Ionicons name="cash-outline" size={28} color={C.green} />
        </View>

        <Text style={styles.eyebrow}>FINANCIAL SUPPORT</Text>
        <Text style={styles.title}>Loan details</Text>
        <Text style={styles.subtitle}>
          Review your loan request and its current status.
        </Text>

        {loading ? (
          <ActivityIndicator size="large" color={C.green} />
        ) : error ? (
          <View style={styles.card}>
            <Ionicons
              name="alert-circle-outline"
              size={26}
              color={C.red}
            />
            <Text style={styles.error}>{error}</Text>
            <Pressable
              style={styles.button}
              onPress={() => router.replace("/loans")}
            >
              <Text style={styles.buttonText}>Back to loans</Text>
            </Pressable>
          </View>
        ) : loan ? (
          <View style={styles.card}>
            <Text style={styles.label}>Requested amount</Text>
            <Text style={styles.amount}>
              R {loan.amount.toLocaleString("en-ZA", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </Text>

            <View style={styles.divider} />

            <Text style={styles.label}>Request status</Text>
            <View
              style={[
                styles.statusBadge,
                { borderColor: statusColor(loan.status) },
              ]}
            >
              <View
                style={[
                  styles.statusDot,
                  { backgroundColor: statusColor(loan.status) },
                ]}
              />
              <Text
                style={[
                  styles.statusText,
                  { color: statusColor(loan.status) },
                ]}
              >
                {loan.status.toUpperCase()}
              </Text>
            </View>

            <Text style={styles.label}>Purpose</Text>
            <Text style={styles.value}>
              {loan.purpose || "No purpose provided"}
            </Text>

            <Text style={styles.label}>Requested repayment term</Text>
            <Text style={styles.value}>
              {loan.termMonths} months
            </Text>

            <Text style={styles.label}>Date submitted</Text>
            <Text style={styles.value}>
              {formatDate(loan.createdAt)}
            </Text>

            <View style={styles.notice}>
              <Ionicons
                name="information-circle-outline"
                size={19}
                color={C.blue}
              />
              <Text style={styles.noticeText}>
                A pending request is awaiting review. This request is not
                a loan agreement, and approval or disbursement is not
                guaranteed.
              </Text>
            </View>
          </View>
        ) : null}
      </ScrollView>
    </>
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
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 10,
    marginBottom: 24,
  },
  backText: { color: C.muted, fontSize: 13, fontWeight: "600" },
  iconBox: {
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
  subtitle: {
    color: C.muted,
    fontSize: 13,
    lineHeight: 20,
    marginTop: 8,
    marginBottom: 24,
  },
  card: {
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 17,
    padding: 20,
    gap: 10,
  },
  label: {
    color: C.muted,
    fontSize: 12,
    fontWeight: "700",
    marginTop: 12,
  },
  amount: { color: C.green, fontSize: 30, fontWeight: "800" },
  value: { color: C.text, fontSize: 14, lineHeight: 21 },
  divider: { height: 1, backgroundColor: C.border, marginVertical: 8 },
  statusBadge: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  statusDot: { width: 7, height: 7, borderRadius: 4 },
  statusText: { fontSize: 11, fontWeight: "800" },
  notice: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 9,
    backgroundColor: "#111E30",
    borderRadius: 11,
    padding: 12,
    marginTop: 18,
  },
  noticeText: { flex: 1, color: "#B4C6DF", fontSize: 11, lineHeight: 17 },
  error: { color: C.red, fontSize: 13, lineHeight: 20 },
  button: {
    backgroundColor: C.green,
    borderRadius: 10,
    padding: 13,
    alignItems: "center",
    marginTop: 12,
  },
  buttonText: { color: "#07130D", fontWeight: "800" },
});
