import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  FlatList,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import { ContributionController } from "../../controllers/ContributionController";
import type { Contribution } from "../../models/Contribution";

export default function ContributionHistoryScreen() {
  const [memberId, setMemberId] = useState("");
  const [groupId, setGroupId] = useState("");
  const [records, setRecords] = useState<Contribution[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const loadHistory = async () => {
    if (loading) return;

    if (!memberId.trim() || !groupId.trim()) {
      Alert.alert("Missing details", "Enter your member ID and group ID.");
      return;
    }

    setLoading(true);
    setSearched(true);

    try {
      const result =
        await ContributionController.getContributionHistory(
          memberId,
          groupId
        );

      setRecords(result);
    } catch (error) {
      Alert.alert(
        "Unable to load history",
        error instanceof Error ? error.message : "Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (value?: string | Date) => {
    if (!value) return "Unavailable";
    const parsed = value instanceof Date ? value : new Date(value);
    return Number.isNaN(parsed.getTime())
      ? "Unavailable"
      : parsed.toLocaleDateString();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Text style={styles.title}>Contribution History</Text>
      <Text style={styles.subtitle}>
        View contributions recorded for your group.
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Member ID"
        placeholderTextColor="#8A968E"
        value={memberId}
        onChangeText={setMemberId}
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Group ID"
        placeholderTextColor="#8A968E"
        value={groupId}
        onChangeText={setGroupId}
        autoCapitalize="none"
      />

      <Pressable
        style={({ pressed }) => [
          styles.button,
          loading && styles.disabledButton,
          pressed && styles.pressed,
        ]}
        onPress={loadHistory}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.buttonText}>View History</Text>
        )}
      </Pressable>

      <FlatList
        style={styles.list}
        data={records}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.listContent}
        keyExtractor={(item, index) => item.id ?? String(index)}
        ListEmptyComponent={
          !loading && searched ? (
            <Text style={styles.empty}>No contributions found.</Text>
          ) : null
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.amount}>
              R{Number(item.amount).toFixed(2)}
            </Text>
            <Text style={styles.cardText}>Date: {formatDate(item.date)}</Text>
            <Text style={styles.cardText}>
              Status: {item.status ?? "Unavailable"}
            </Text>
          </View>
        )}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 30,
    backgroundColor: "#F4F8F5",
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#183B32",
    marginBottom: 8,
  },
  subtitle: {
    color: "#666666",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D5DED8",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
    color: "#183B32",
  },
  button: {
    backgroundColor: "#247A55",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 50,
    elevation: 2,
  },
  disabledButton: {
    opacity: 0.6,
  },
  pressed: {
    opacity: 0.85,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  list: {
    marginTop: 18,
  },
  listContent: {
    paddingBottom: 40,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D5DED8",
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    elevation: 2,
  },
  amount: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#183B32",
    marginBottom: 6,
  },
  cardText: {
    color: "#24372D",
  },
  empty: {
    marginTop: 20,
    color: "#666666",
  },
});