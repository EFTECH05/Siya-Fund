import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Modal,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { fetchUserGroups, handleJoinGroup } from "../../controllers/GroupController";
import { Group } from "../../models/Group";
import GroupCard from "../../components/GroupCard";

export default function GroupsScreen() {
  const insets = useSafeAreaInsets();
  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Join by code modal
  const [joinModalVisible, setJoinModalVisible] = useState(false);
  const [joinCode, setJoinCode] = useState("");
  const [joinLoading, setJoinLoading] = useState(false);

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

  useEffect(() => {
    loadGroups();
  }, []);

  const handlePress = (id: string) => {
    router.push(`/groups/${id}`);
  };

  const handleJoin = async () => {
    try {
      setJoinLoading(true);
      const groupId = await handleJoinGroup(joinCode.trim());
      setJoinCode("");
      setJoinModalVisible(false);
      Alert.alert("Success", "You have joined the group!", [
        { text: "OK", onPress: () => router.push(`/groups/${groupId}`) },
      ]);
      await loadGroups(); // refresh list
    } catch (err: any) {
      Alert.alert("Error", err.message);
    } finally {
      setJoinLoading(false);
    }
  };

  if (isLoading) return <ActivityIndicator size="large" style={styles.center} />;

  return (
    <View style={[styles.container, { paddingTop: insets.top + 8 }]}>
      {/* Title */}
      <Text style={styles.title}>My Savings Groups</Text>

      {/* Action buttons */}
      <View style={styles.actions}>
        <Pressable
          style={[styles.btn, styles.joinBtn]}
          onPress={() => setJoinModalVisible(true)}
          accessibilityLabel="Join a group with a code"
        >
          <Text style={styles.joinBtnText}>Join with Code</Text>
        </Pressable>

        <Pressable
          style={[styles.btn, styles.createBtn]}
          onPress={() => router.push("/groups/create")}
          accessibilityLabel="Create a new group"
        >
          <Text style={styles.createBtnText}>+ Create Group</Text>
        </Pressable>
      </View>

      <FlatList
        data={groups}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <GroupCard group={item} onPress={handlePress} />
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>No groups found. Create or join one!</Text>
        }
        contentContainerStyle={styles.listContent}
      />

      {/* Join by code modal */}
      <Modal
        visible={joinModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setJoinModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalOverlay}
        >
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Join a Group</Text>
            <Text style={styles.modalSubtitle}>
              Enter the 6-character code shared by the group admin.
            </Text>

            <TextInput
              style={styles.input}
              placeholder="e.g. GK6HX3"
              placeholderTextColor="#9CA3AF"
              value={joinCode}
              onChangeText={(text) => setJoinCode(text.toUpperCase())}
              autoCapitalize="characters"
              autoCorrect={false}
              maxLength={6}
            />

            <View style={styles.modalActions}>
              <Pressable
                style={[styles.modalBtn, styles.cancelBtn]}
                onPress={() => {
                  setJoinCode("");
                  setJoinModalVisible(false);
                }}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[
                  styles.modalBtn,
                  styles.confirmBtn,
                  (!joinCode.trim() || joinLoading) && styles.disabledBtn,
                ]}
                onPress={handleJoin}
                disabled={!joinCode.trim() || joinLoading}
              >
                {joinLoading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.confirmBtnText}>Join</Text>
                )}
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
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
  actions: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 20,
  },
  btn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  joinBtn: {
    backgroundColor: "#EFF6FF",
    borderWidth: 1,
    borderColor: "#BFDBFE",
  },
  joinBtnText: {
    color: "#1D4ED8",
    fontWeight: "700",
    fontSize: 14,
  },
  createBtn: {
    backgroundColor: "#10B981",
  },
  createBtnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
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
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
  },
  modalCard: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    paddingBottom: 36,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 4,
  },
  modalSubtitle: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    padding: 12,
    fontSize: 20,
    fontWeight: "bold",
    color: "#1D4ED8",
    backgroundColor: "#F9FAFB",
    marginBottom: 16,
    textAlign: "center",
    letterSpacing: 6,
  },
  modalActions: {
    flexDirection: "row",
    gap: 12,
  },
  modalBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelBtn: {
    backgroundColor: "#F3F4F6",
  },
  cancelBtnText: {
    color: "#374151",
    fontWeight: "600",
  },
  confirmBtn: {
    backgroundColor: "#10B981",
  },
  confirmBtnText: {
    color: "#fff",
    fontWeight: "700",
  },
  disabledBtn: {
    opacity: 0.5,
  },
});
