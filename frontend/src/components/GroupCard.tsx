import React from "react";
import { Pressable, Text, View, StyleSheet } from "react-native";
import { Group } from "../models/Group";

interface GroupCardProps {
  group: Group;
  onPress: (id: string) => void;
}

export default function GroupCard({ group, onPress }: GroupCardProps) {
  return (
    <Pressable style={styles.card} onPress={() => onPress(group.id)}>
      <Text style={styles.name}>{group.name}</Text>
      <Text style={styles.description}>{group.description}</Text>
      <Text style={styles.members}>{group.members.length} Member(s)</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#1F2937",
  },
  description: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 8,
  },
  members: {
    fontSize: 12,
    color: "#9CA3AF",
    fontWeight: "600",
  },
});