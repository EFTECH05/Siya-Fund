import React, { useState } from "react";
import {
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
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
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Record Contribution</Text>
        <Text style={styles.subtitle}>
          Enter your contribution details below.
        </Text>

        <Text style={styles.label}>Member ID</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter member ID"
          placeholderTextColor="#8A968E"
          value={memberId}
          onChangeText={setMemberId}
          autoCapitalize="none"
        />

        <Text style={styles.label}>Group ID</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter group ID"
          placeholderTextColor="#8A968E"
          value={groupId}
          onChangeText={setGroupId}
          autoCapitalize="none"
        />

        <Text style={styles.label}>Amount (R)</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. 100"
          placeholderTextColor="#8A968E"
          value={amount}
          onChangeText={setAmount}
          keyboardType="decimal-pad"
        />

        <Pressable
          style={({ pressed }) => [
            styles.button,
            loading && styles.disabledButton,
            pressed && { opacity: 0.85 },
          ]}
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
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F4F8F5",
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 120,
    backgroundColor: "#F4F8F5",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#183B32",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: "#647067",
    marginBottom: 28,
    lineHeight: 22,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#24372D",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D5DED8",
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 14,
    marginBottom: 20,
    fontSize: 16,
    color: "#183B32",
  },
  button: {
    backgroundColor: "#247A55",
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 54,
    marginTop: 8,
    elevation: 2,
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