
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { collection, getDocs } from "firebase/firestore";

import { db } from "../../../services/firebase";
import type { Group } from "../../../models/Group";

export default function GroupManagementScreen() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadGroups = async () => {
    try {
      setError("");

      const snapshot = await getDocs(collection(db, "groups"));

      const groupList = snapshot.docs.map((groupDoc) => ({
        ...groupDoc.data(),
        id: groupDoc.id,
      })) as Group[];

      setGroups(groupList);
    } catch (err) {
      console.error("Failed to load groups:", err);
      setError(
        "Unable to load groups. Check your Firestore permissions."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadGroups();
  }, []);

  const filteredGroups = groups.filter((group) => {
    const value = search.toLowerCase();

    return (
      group.name?.toLowerCase().includes(value) ||
      group.description?.toLowerCase().includes(value) ||
      group.joinCode?.toLowerCase().includes(value)
    );
  });

  const showGroupDetails = (group: Group) => {
    Alert.alert(
      group.name,
      `Description: ${group.description || "No description"}\n\nMembers: ${group.members?.length || 0}\n\nCreator ID: ${group.creatorId}\n\nJoin Code: ${group.joinCode}`,
      [{ text: "Close", style: "cancel" }]
    );
  };

  const renderGroup = ({ item }: { item: Group }) => (
    <Pressable
      style={styles.groupCard}
      onPress={() => showGroupDetails(item)}
    >
      <View style={styles.groupIcon}>
        <Ionicons name="people" size={24} color="#22C55E" />
      </View>

      <View style={styles.groupInfo}>
        <Text style={styles.groupName}>
          {item.name || "Unnamed Group"}
        </Text>

        <Text style={styles.description} numberOfLines={2}>
          {item.description || "No description available"}
        </Text>

        <View style={styles.groupMeta}>
          <View style={styles.metaItem}>
            <Ionicons name="people-outline" size={14} color="#22C55E" />
            <Text style={styles.metaText}>
              {item.members?.length || 0} members
            </Text>
          </View>

          <View style={styles.metaItem}>
            <Ionicons name="key-outline" size={14} color="#94A3B8" />
            <Text style={styles.metaText}>{item.joinCode || "N/A"}</Text>
          </View>
        </View>
      </View>

      <Ionicons name="chevron-forward" size={20} color="#64748B" />
    </Pressable>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#22C55E" />
        <Text style={styles.loadingText}>Loading groups...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          style={styles.backButton}
          onPress={() => router.replace("/super-admin")}
        >
          <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
        </Pressable>

        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>Group Management</Text>
          <Text style={styles.headerSubtitle}>
            Manage Siya-Fund savings groups
          </Text>
        </View>

        <View style={styles.headerIcon}>
          <Ionicons name="people" size={22} color="#22C55E" />
        </View>
      </View>

      {/* Statistics */}
      <View style={styles.statsCard}>
        <View style={styles.statsIcon}>
          <Ionicons name="people" size={26} color="#22C55E" />
        </View>

        <View style={styles.statsInfo}>
          <Text style={styles.statsLabel}>Total registered groups</Text>
          <Text style={styles.statsNumber}>{groups.length}</Text>
        </View>

        <View style={styles.memberSummary}>
          <Text style={styles.memberNumber}>
            {groups.reduce(
              (total, group) => total + (group.members?.length || 0),
              0
            )}
          </Text>
          <Text style={styles.memberLabel}>Memberships</Text>
        </View>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color="#64748B" />

        <TextInput
          style={styles.searchInput}
          placeholder="Search groups or join codes..."
          placeholderTextColor="#64748B"
          value={search}
          onChangeText={setSearch}
        />

        {search.length > 0 && (
          <Pressable onPress={() => setSearch("")}>
            <Ionicons name="close-circle" size={19} color="#64748B" />
          </Pressable>
        )}
      </View>

      {/* Section heading */}
      <View style={styles.sectionHeader}>
        <View>
          <Text style={styles.sectionTitle}>All Groups</Text>
          <Text style={styles.sectionSubtitle}>
            {filteredGroups.length} group(s) found
          </Text>
        </View>

        <Pressable
          style={styles.refreshButton}
          onPress={() => {
            setRefreshing(true);
            loadGroups();
          }}
        >
          <Ionicons name="refresh" size={19} color="#22C55E" />
        </Pressable>
      </View>

      {/* Group list */}
      {error ? (
        <View style={styles.errorCard}>
          <Ionicons
            name="alert-circle-outline"
            size={28}
            color="#F87171"
          />
          <Text style={styles.errorText}>{error}</Text>

          <Pressable
            style={styles.retryButton}
            onPress={() => {
              setLoading(true);
              loadGroups();
            }}
          >
            <Text style={styles.retryText}>Try Again</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={filteredGroups}
          keyExtractor={(item) => item.id}
          renderItem={renderGroup}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                loadGroups();
              }}
              tintColor="#22C55E"
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons
                name="people-outline"
                size={45}
                color="#475569"
              />
              <Text style={styles.emptyTitle}>No groups found</Text>
              <Text style={styles.emptyText}>
                {search
                  ? "Try another group name or join code."
                  : "Created groups will appear here."}
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#080D18",
    paddingHorizontal: 20,
    paddingTop: 55,
  },
  center: {
    flex: 1,
    backgroundColor: "#080D18",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#94A3B8",
    marginTop: 14,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 27,
  },
  backButton: {
    width: 43,
    height: 43,
    borderRadius: 13,
    backgroundColor: "#172236",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 13,
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "800",
  },
  headerSubtitle: {
    color: "#94A3B8",
    fontSize: 11,
    marginTop: 4,
  },
  headerIcon: {
    width: 43,
    height: 43,
    borderRadius: 13,
    backgroundColor: "#123323",
    justifyContent: "center",
    alignItems: "center",
  },
  statsCard: {
    backgroundColor: "#111B2E",
    borderRadius: 18,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#1E293B",
    marginBottom: 22,
  },
  statsIcon: {
    width: 49,
    height: 49,
    borderRadius: 14,
    backgroundColor: "#123323",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 13,
  },
  statsInfo: {
    flex: 1,
  },
  statsLabel: {
    color: "#94A3B8",
    fontSize: 11,
  },
  statsNumber: {
    color: "#FFFFFF",
    fontSize: 27,
    fontWeight: "800",
    marginTop: 4,
  },
  memberSummary: {
    alignItems: "flex-end",
  },
  memberNumber: {
    color: "#22C55E",
    fontSize: 21,
    fontWeight: "800",
  },
  memberLabel: {
    color: "#94A3B8",
    fontSize: 10,
    marginTop: 3,
  },
  searchContainer: {
    height: 51,
    backgroundColor: "#111B2E",
    borderRadius: 13,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#1E293B",
    marginBottom: 23,
  },
  searchInput: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 13,
    marginLeft: 10,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },
  sectionSubtitle: {
    color: "#64748B",
    fontSize: 11,
    marginTop: 5,
  },
  refreshButton: {
    width: 39,
    height: 39,
    borderRadius: 12,
    backgroundColor: "#123323",
    justifyContent: "center",
    alignItems: "center",
  },
  list: {
    paddingBottom: 35,
  },
  groupCard: {
    backgroundColor: "#111B2E",
    borderRadius: 15,
    padding: 15,
    marginBottom: 11,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#1E293B",
  },
  groupIcon: {
    width: 47,
    height: 47,
    borderRadius: 15,
    backgroundColor: "#123323",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 13,
  },
  groupInfo: {
    flex: 1,
  },
  groupName: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 14,
  },
  description: {
    color: "#94A3B8",
    fontSize: 11,
    marginTop: 5,
  },
  groupMeta: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10,
    gap: 13,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  metaText: {
    color: "#94A3B8",
    fontSize: 10,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 55,
  },
  emptyTitle: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 16,
    marginTop: 14,
  },
  emptyText: {
    color: "#64748B",
    textAlign: "center",
    fontSize: 12,
    marginTop: 7,
  },
  errorCard: {
    backgroundColor: "#25151B",
    borderRadius: 14,
    padding: 18,
    alignItems: "center",
  },
  errorText: {
    color: "#FCA5A5",
    textAlign: "center",
    fontSize: 12,
    marginTop: 10,
  },
  retryButton: {
    backgroundColor: "#14532D",
    borderRadius: 9,
    paddingHorizontal: 17,
    paddingVertical: 9,
    marginTop: 14,
  },
  retryText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
});
