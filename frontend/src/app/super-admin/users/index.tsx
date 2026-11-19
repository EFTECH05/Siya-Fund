
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
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
import type { User } from "../../../models/User";

export default function UserManagementScreen() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadUsers = async () => {
    try {
      setError("");

      const snapshot = await getDocs(collection(db, "users"));

      const userList = snapshot.docs.map((userDoc) => ({
        ...userDoc.data(),
        uid: userDoc.id,
      })) as User[];

      setUsers(userList);
    } catch (err) {
      console.error("Failed to load users:", err);
      setError("Unable to load users. Please check your Firebase permissions.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const filteredUsers = users.filter((user) => {
    const value = search.toLowerCase();

    return (
      user.displayName?.toLowerCase().includes(value) ||
      user.email?.toLowerCase().includes(value)
    );
  });

  const getInitials = (name?: string, email?: string) => {
    const value = name?.trim() || email || "U";
    return value.charAt(0).toUpperCase();
  };

  const renderUser = ({ item }: { item: User }) => (
    <View style={styles.userCard}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
          {getInitials(item.displayName, item.email)}
        </Text>
      </View>

      <View style={styles.userInfo}>
        <Text style={styles.name}>
          {item.displayName || "Unnamed User"}
        </Text>

        <Text style={styles.email}>{item.email || "No email available"}</Text>

        <View style={styles.roleBadge}>
          <Text style={styles.roleText}>
            {(item.role || "user").replace("_", " ").toUpperCase()}
          </Text>
        </View>
      </View>

      <Ionicons name="chevron-forward" size={19} color="#64748B" />
    </View>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#22C55E" />
        <Text style={styles.loadingText}>Loading registered users...</Text>
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

        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>User Management</Text>
          <Text style={styles.headerSubtitle}>
            Manage your Siya-Fund community
          </Text>
        </View>

        <View style={styles.adminIcon}>
          <Ionicons name="people" size={21} color="#22C55E" />
        </View>
      </View>

      {/* Overview */}
      <View style={styles.statsCard}>
        <View style={styles.statsIcon}>
          <Ionicons name="people" size={25} color="#22C55E" />
        </View>

        <View style={styles.statsInfo}>
          <Text style={styles.statsLabel}>Total registered users</Text>
          <Text style={styles.statsNumber}>{users.length}</Text>
        </View>

        <View style={styles.activeIndicator}>
          <View style={styles.activeDot} />
          <Text style={styles.activeText}>Accounts</Text>
        </View>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color="#64748B" />

        <TextInput
          style={styles.searchInput}
          placeholder="Search users by name or email..."
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

      {/* User list heading */}
      <View style={styles.sectionHeader}>
        <View>
          <Text style={styles.sectionTitle}>Registered Users</Text>
          <Text style={styles.sectionSubtitle}>
            {filteredUsers.length} account(s) found
          </Text>
        </View>

        <Pressable
          style={styles.refreshButton}
          onPress={() => {
            setRefreshing(true);
            loadUsers();
          }}
        >
          <Ionicons name="refresh" size={19} color="#22C55E" />
        </Pressable>
      </View>

      {/* Users */}
      {error ? (
        <View style={styles.errorCard}>
          <Ionicons name="alert-circle-outline" size={25} color="#F87171" />
          <Text style={styles.errorText}>{error}</Text>
          <Pressable style={styles.retryButton} onPress={loadUsers}>
            <Text style={styles.retryText}>Try Again</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={filteredUsers}
          keyExtractor={(item) => item.uid}
          renderItem={renderUser}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                loadUsers();
              }}
              tintColor="#22C55E"
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons
                name="people-outline"
                size={42}
                color="#475569"
              />
              <Text style={styles.emptyTitle}>No users found</Text>
              <Text style={styles.emptyText}>
                {search
                  ? "Try searching with another name or email."
                  : "Registered users will appear here."}
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
    fontSize: 13,
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
  headerText: {
    flex: 1,
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 21,
    fontWeight: "800",
  },
  headerSubtitle: {
    color: "#94A3B8",
    fontSize: 12,
    marginTop: 4,
  },
  adminIcon: {
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
    padding: 19,
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
    marginRight: 14,
  },
  statsInfo: {
    flex: 1,
  },
  statsLabel: {
    color: "#94A3B8",
    fontSize: 12,
  },
  statsNumber: {
    color: "#FFFFFF",
    fontSize: 27,
    fontWeight: "800",
    marginTop: 4,
  },
  activeIndicator: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#123323",
    paddingHorizontal: 9,
    paddingVertical: 7,
    borderRadius: 20,
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#22C55E",
    marginRight: 6,
  },
  activeText: {
    color: "#86EFAC",
    fontSize: 10,
    fontWeight: "700",
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
  userCard: {
    backgroundColor: "#111B2E",
    borderRadius: 15,
    padding: 15,
    marginBottom: 11,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#1E293B",
  },
  avatar: {
    width: 47,
    height: 47,
    borderRadius: 15,
    backgroundColor: "#14532D",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 13,
  },
  avatarText: {
    color: "#86EFAC",
    fontSize: 19,
    fontWeight: "800",
  },
  userInfo: {
    flex: 1,
  },
  name: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 14,
  },
  email: {
    color: "#94A3B8",
    fontSize: 11,
    marginTop: 5,
  },
  roleBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#1E293B",
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 6,
    marginTop: 8,
  },
  roleText: {
    color: "#86EFAC",
    fontSize: 9,
    fontWeight: "800",
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
