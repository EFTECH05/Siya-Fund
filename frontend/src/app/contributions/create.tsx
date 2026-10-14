
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";

import { ContributionController } from "../../controllers/ContributionController";

export default function CreateContributionScreen() {
  const [memberId, setMemberId] = useState("");
  const [groupId, setGroupId] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (loading) return;

    if (!memberId.trim() || !groupId.trim()) {
      Alert.alert("Missing details", "Enter your member ID and group ID.");
      return;
    }

    const numericAmount = Number(amount);

    if (
      !amount.trim() ||
      !Number.isFinite(numericAmount) ||
      numericAmount <= 0
    ) {
      Alert.alert("Invalid amount", "Enter an amount greater than zero.");
      return;
    }

    setLoading(true);

    try {
      await ContributionController.recordContribution({
        memberId,
        groupId,
        amount,
      });

      Alert.alert("Success", "Your contribution has been recorded.");
      setAmount("");
    } catch (error) {
      Alert.alert(
        "Could not save",
        error instanceof Error ? error.message : "Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Record Contribution</Text>
      <Text style={styles.subtitle}>
        Enter your contribution details below.
      </Text>

      <Text style={styles.label}>Member ID</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter member ID"
        value={memberId}
        onChangeText={setMemberId}
        autoCapitalize="none"
      />

      <Text style={styles.label}>Group ID</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter group ID"
        value={groupId}
        onChangeText={setGroupId}
        autoCapitalize="none"
      />

      <Text style={styles.label}>Amount (R)</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. 100"
        value={amount}
        onChangeText={setAmount}
        keyboardType="decimal-pad"
      />

      <Pressable
        style={[styles.button, loading && styles.disabledButton]}
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.buttonText}>Save Contribution</Text>
        )}
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#183B32",
    marginBottom: 8,
  },
  subtitle: {
    color: "#666666",
    marginBottom: 28,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 7,
  },
  input: {
    borderWidth: 1,
    borderColor: "#CCCCCC",
    borderRadius: 8,
    padding: 13,
    marginBottom: 18,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#247A55",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 5,
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});