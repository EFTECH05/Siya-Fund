import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { fetchUserGroups } from "../../controllers/GroupController";
import { Group } from "../../models/Group";
import GroupCard from "../../components/GroupCard";

export default function GroupsScreen() {
  const insets = useSafeAreaInsets();
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
    <View style={[styles.container, { paddingTop: insets.top + 8 }]}>
      {/* Title row */}
      <Text style={styles.title}>My Savings Groups</Text>

      {/* Create button on its own row, full width — avoids the Expo Go overlay */}
      <Pressable
        style={styles.createBtn}
        onPress={() => router.push("/groups/create")}
        accessibilityLabel="Create a new group"
      >
        <Text style={styles.createBtnText}>+ Create New Group</Text>
      </Pressable>

      <FlatList
        data={groups}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <GroupCard group={item} onPress={handlePress} />
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>No groups found. Create one!</Text>
        }
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 12,
  },
  createBtn: {
    backgroundColor: "#10B981",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  createBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
  },
  center: {
    flex: 1,
    justifyContent: "center",
  },
  listContent: {
    paddingBottom: 24,
  },
  empty: {
    textAlign: "center",
    color: "#6B7280",
    marginTop: 40,
    fontSize: 15,
  },
});
