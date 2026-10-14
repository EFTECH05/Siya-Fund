
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Contribution History</Text>
      <Text style={styles.subtitle}>
        View contributions recorded for your group.
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Member ID"
        value={memberId}
        onChangeText={setMemberId}
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Group ID"
        value={groupId}
        onChangeText={setGroupId}
        autoCapitalize="none"
      />

      <Pressable
        style={styles.button}
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
            <Text>
              Date: {item.date instanceof Date
                ? item.date.toLocaleDateString()
                : "Unavailable"}
            </Text>
            <Text>Status: {item.status}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 30,
    backgroundColor: "#FFFFFF",
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
    borderWidth: 1,
    borderColor: "#CCCCCC",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  button: {
    backgroundColor: "#247A55",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  list: {
    marginTop: 18,
  },
  card: {
    borderWidth: 1,
    borderColor: "#DDDDDD",
    borderRadius: 8,
    padding: 15,
    marginBottom: 12,
  },
  amount: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 6,
  },
  empty: {
    marginTop: 20,
    color: "#666666",
  },
});