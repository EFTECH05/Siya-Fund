import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { fetchUserGroups } from "../../controllers/GroupController";
import { Group } from "../../models/Group";
import GroupCard from "../../components/GroupCard";

export default function GroupsScreen() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadGroups = async () => {
      try {
        const userGroups = await fetchUserGroups();
        setGroups(userGroups);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    loadGroups();
  }, []);

  const handlePress = (id: string) => {
    router.push(`/groups/${id}`);
  };

  if (isLoading) return <ActivityIndicator size="large" style={styles.center} />;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Savings Groups</Text>
        <Pressable style={styles.createBtn} onPress={() => router.push("/groups/create")}>
          <Text style={styles.createBtnText}>+ Create</Text>
        </Pressable>
      </View>

      <FlatList
        data={groups}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <GroupCard group={item} onPress={handlePress} />
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>No groups found. Create one!</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  header: { flexDirection: "row", justifyContent: "space-between", marginBottom: 20 },
  title: { fontSize: 24, fontWeight: "bold" },
  createBtn: { backgroundColor: "#10B981", padding: 10, borderRadius: 8 },
  createBtnText: { color: "#fff", fontWeight: "bold" },
  center: { flex: 1, justifyContent: "center" },
  empty: { textAlign: "center", color: "#6B7280", marginTop: 20 },
});