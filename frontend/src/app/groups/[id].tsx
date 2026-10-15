import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  Modal,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { auth } from "../../services/firebase";
import {
  fetchGroupById,
  fetchGroupMembers,
  handleAddMember,
  handleRemoveMember,
} from "../../controllers/GroupController";
import { Group, GroupMember } from "../../models/Group";

// ── Sub-components ────────────────────────────────────────────────────────────

interface MemberRowProps {
  member: GroupMember;
  isAdmin: boolean;
  isCreator: boolean;
  onRemove: (uid: string) => void;
}

function MemberRow({ member, isAdmin, isCreator, onRemove }: MemberRowProps) {
  return (
    <View style={styles.memberRow}>
      <View style={styles.memberAvatar}>
        <Text style={styles.memberAvatarText}>
          {(member.displayName?.[0] ?? member.email?.[0] ?? "?").toUpperCase()}
        </Text>
      </View>
      <View style={styles.memberInfo}>
        <Text style={styles.memberName}>{member.displayName}</Text>
        <Text style={styles.memberEmail}>{member.email}</Text>
      </View>
      {isCreator && (
        <Text style={styles.creatorBadge}>Admin</Text>
      )}
      {/* Admin can remove any non-creator member */}
      {isAdmin && !isCreator && (
        <Pressable
          style={styles.removeBtn}
          onPress={() => onRemove(member.uid)}
          accessibilityLabel={`Remove ${member.displayName}`}
        >
          <Text style={styles.removeBtnText}>Remove</Text>
        </Pressable>
      )}
    </View>
  );
}

// ── Main screen ───────────────────────────────────────────────────────────────

export default function GroupDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [group, setGroup] = useState<Group | null>(null);
  const [members, setMembers] = useState<GroupMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Add-member modal (admin only — adds by UID)
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [addUid, setAddUid] = useState("");
  const [addLoading, setAddLoading] = useState(false);

  const currentUid = auth.currentUser?.uid ?? "";

  // ── Data loading ────────────────────────────────────────────────────────────

  const loadGroup = useCallback(async () => {
    try {
      setIsLoading(true);
      const [groupData, memberData] = await Promise.all([
        fetchGroupById(id),
        fetchGroupMembers(id),
      ]);
      setGroup(groupData);
      setMembers(memberData);
    } catch (err: any) {
      Alert.alert("Error", err.message ?? "Failed to load group.");
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadGroup();
  }, [loadGroup]);

  // ── Derived state ───────────────────────────────────────────────────────────

  const isAdmin = group?.creatorId === currentUid;

  // ── Handlers ────────────────────────────────────────────────────────────────

  const handleAdd = async () => {
    if (!group) return;
    try {
      setAddLoading(true);
      await handleAddMember(group, addUid.trim());
      setAddUid("");
      setAddModalVisible(false);
      await loadGroup(); // refresh list
    } catch (err: any) {
      Alert.alert("Error", err.message);
    } finally {
      setAddLoading(false);
    }
  };

  const confirmRemove = (uid: string) => {
    const target = members.find((m) => m.uid === uid);
    Alert.alert(
      "Remove Member",
      `Remove ${target?.displayName ?? "this member"} from the group?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => doRemove(uid),
        },
      ]
    );
  };

  const doRemove = async (uid: string) => {
    if (!group) return;
    try {
      await handleRemoveMember(group, uid);
      await loadGroup();
    } catch (err: any) {
      Alert.alert("Error", err.message);
    }
  };

  // ── Render ──────────────────────────────────────────────────────────────────

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#10B981" />
      </View>
    );
  }

  if (!group) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Group not found.</Text>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.backLink}>Go back</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* ── Group header ── */}
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={styles.title}>{group.name}</Text>
          <Text style={styles.description}>{group.description}</Text>
        </View>
        {isAdmin && (
          <View style={styles.adminBadge}>
            <Text style={styles.adminBadgeText}>Admin</Text>
          </View>
        )}
      </View>

      {/* ── Join code (visible to all members) ── */}
      <View style={styles.codeBox}>
        <Text style={styles.codeLabel}>Group Join Code</Text>
        <Text style={styles.codeValue} selectable>{group.joinCode}</Text>
        <Text style={styles.codeHint}>Share this code so others can join</Text>
      </View>

      {/* ── Members section ── */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          Members ({group.members.length})
        </Text>
        {isAdmin && (
          <Pressable
            style={styles.addBtn}
            onPress={() => setAddModalVisible(true)}
            accessibilityLabel="Add member"
          >
            <Text style={styles.addBtnText}>+ Add Member</Text>
          </Pressable>
        )}
      </View>

      <FlatList
        data={members}
        keyExtractor={(item) => item.uid}
        renderItem={({ item }) => (
          <MemberRow
            member={item}
            isAdmin={isAdmin}
            isCreator={item.uid === group.creatorId}
            onRemove={confirmRemove}
          />
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No member profiles found.</Text>
        }
        contentContainerStyle={styles.listContent}
      />

      {/* ── Add-member modal (admin only) ── */}
      <Modal
        visible={addModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setAddModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalOverlay}
        >
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Add Member</Text>
            <Text style={styles.modalSubtitle}>
              Enter the user's UID to add them to the group.
            </Text>

            <TextInput
              style={styles.input}
              placeholder="User UID"
              placeholderTextColor="#9CA3AF"
              value={addUid}
              onChangeText={setAddUid}
              autoCapitalize="none"
              autoCorrect={false}
            />

            <View style={styles.modalActions}>
              <Pressable
                style={[styles.modalBtn, styles.cancelBtn]}
                onPress={() => {
                  setAddUid("");
                  setAddModalVisible(false);
                }}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[
                  styles.modalBtn,
                  styles.confirmBtn,
                  (!addUid.trim() || addLoading) && styles.disabledBtn,
                ]}
                onPress={handleAdd}
                disabled={!addUid.trim() || addLoading}
              >
                {addLoading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.confirmBtnText}>Add</Text>
                )}
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 20 },
  errorText: { fontSize: 16, color: "#EF4444", marginBottom: 12 },
  backLink: { color: "#10B981", fontSize: 15, fontWeight: "600" },

  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  headerText: { flex: 1 },
  title: { fontSize: 22, fontWeight: "bold", color: "#1F2937", marginBottom: 4 },
  description: { fontSize: 14, color: "#6B7280" },
  adminBadge: {
    backgroundColor: "#D1FAE5",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    marginLeft: 12,
  },
  adminBadgeText: { color: "#065F46", fontSize: 12, fontWeight: "700" },

  // Join code
  codeBox: {
    margin: 16,
    padding: 16,
    backgroundColor: "#EFF6FF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#BFDBFE",
    alignItems: "center",
  },
  codeLabel: { fontSize: 12, color: "#3B82F6", fontWeight: "600", marginBottom: 6 },
  codeValue: { fontSize: 28, fontWeight: "bold", color: "#1D4ED8", letterSpacing: 6 },
  codeHint: { fontSize: 11, color: "#6B7280", marginTop: 6 },

  // Section header
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  sectionTitle: { fontSize: 16, fontWeight: "700", color: "#374151" },
  addBtn: {
    backgroundColor: "#10B981",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  addBtnText: { color: "#fff", fontWeight: "700", fontSize: 13 },

  // Member list
  listContent: { paddingHorizontal: 16, paddingBottom: 24 },
  memberRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  memberAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#10B981",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  memberAvatarText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  memberInfo: { flex: 1 },
  memberName: { fontSize: 14, fontWeight: "600", color: "#1F2937" },
  memberEmail: { fontSize: 12, color: "#6B7280" },
  creatorBadge: {
    fontSize: 11,
    color: "#065F46",
    backgroundColor: "#D1FAE5",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    fontWeight: "700",
    overflow: "hidden",
  },
  removeBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    backgroundColor: "#FEE2E2",
  },
  removeBtnText: { color: "#DC2626", fontWeight: "600", fontSize: 12 },
  emptyText: { textAlign: "center", color: "#9CA3AF", marginTop: 20 },

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
  modalTitle: { fontSize: 18, fontWeight: "bold", color: "#1F2937", marginBottom: 4 },
  modalSubtitle: { fontSize: 13, color: "#6B7280", marginBottom: 16 },
  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: "#111827",
    backgroundColor: "#F9FAFB",
    marginBottom: 16,
  },
  modalActions: { flexDirection: "row", gap: 12 },
  modalBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelBtn: { backgroundColor: "#F3F4F6" },
  cancelBtnText: { color: "#374151", fontWeight: "600" },
  confirmBtn: { backgroundColor: "#10B981" },
  confirmBtnText: { color: "#fff", fontWeight: "700" },
  disabledBtn: { opacity: 0.5 },
});
