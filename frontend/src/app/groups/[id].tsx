import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { fetchGroupById } from "../../controllers/GroupController";
import { Group } from "../../models/Group";

export default function GroupDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [group, setGroup] = useState<Group | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadGroup = async () => {
      try {
        const data = await fetchGroupById(id);
        setGroup(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    loadGroup();
  }, []);

  if (isLoading) return <ActivityIndicator size="large" style={styles.center} />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{group?.name}</Text>
      <Text style={styles.description}>{group?.description}</Text>
      <Text style={styles.members}>Members: {group?.members.length}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  description: { fontSize: 16, color: "#4B5563", marginBottom: 20 },
  members: { fontSize: 14, color: "#6B7280", fontWeight: "600" },
  center: { flex: 1, justifyContent: "center" },
});