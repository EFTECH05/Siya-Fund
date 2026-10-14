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
import { router } from "expo-router";
import { handleCreateGroup } from "../../controllers/GroupController";

export default function CreateGroupScreen() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleCreate = async () => {
    if (!name || !description) {
      Alert.alert("Missing Info", "Please fill in both name and description.");
      return;
    }
    try {
      setIsLoading(true);
      await handleCreateGroup(name, description);
      Alert.alert("Success", "Group created successfully!");
      router.replace("/groups");
    } catch (error: any) {
      console.error("Create Group Error:", error);
      Alert.alert(
        "Error",
        error?.message || "Could not create group. Try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.title}>Create Savings Group</Text>

      <TextInput
        style={styles.input}
        placeholder="Group Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Group Description"
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <Pressable
        style={styles.button}
        onPress={handleCreate}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>CREATE GROUP</Text>
        )}
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  contentContainer: { padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  textArea: { height: 100, textAlignVertical: "top" },
  button: {
    backgroundColor: "#10B981",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
});