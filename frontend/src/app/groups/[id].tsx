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
  StatusBar,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { auth } from "../../services/firebase";
import {
  fetchGroupById,
  fetchGroupMembers,
  handleAddMember,
  handleRemoveMember,
} from "../../controllers/GroupController";
import { Group, GroupMember } from "../../models/Group";

// ── Theme ────────────────────────────────────────────────────────────────────

const COLORS = {
  primary: "#059669",
  primaryDark: "#047857",
  primaryLight: "#D1FAE5",
  background: "#F5F8F7",
  white: "#FFFFFF",
  heading: "#102A24",
  text: "#374151",
  muted: "#6B7280",
  border: "#E5E7EB",
  danger: "#DC2626",
  dangerLight: "#FEE2E2",
  blue: "#2563EB",
  blueLight: "#EFF6FF",
};

// ── Member card ──────────────────────────────────────────────────────────────

interface MemberRowProps {
  member: GroupMember;
  isAdmin: boolean;
  isCreator: boolean;
  onRemove: (uid: string) => void;
}

function MemberRow({ member, isAdmin, isCreator, onRemove }: MemberRowProps) {
  const initials = (
    member.displayName?.trim()?.[0] ??
    member.email?.trim()?.[0] ??
    "?"
  ).toUpperCase();

  return (
    <View style={styles.memberCard}>
      <View style={styles.memberAvatar}>
        <Text style={styles.memberAvatarText}>{initials}</Text>
      </View>

      <View style={styles.memberInfo}>
        <Text style={styles.memberName} numberOfLines={1}>
          {member.displayName?.trim() || "Siya-Fund Member"}
        </Text>

        <Text style={styles.memberEmail} numberOfLines={1}>
          {member.email || "Email unavailable"}
        </Text>

        {isCreator && (
          <View style={styles.creatorBadge}>
            <Ionicons
              name="shield-checkmark"
              size={12}
              color={COLORS.primaryDark}
            />
            <Text style={styles.creatorBadgeText}>Group Admin</Text>
          </View>
        )}
      </View>

      {isAdmin && !isCreator && (
        <Pressable
          style={({ pressed }) => [
            styles.removeButton,
            pressed && styles.pressed,
          ]}
          onPress={() => onRemove(member.uid)}
          accessibilityRole="button"
          accessibilityLabel={`Remove ${member.displayName || "member"}`}
          hitSlop={6}
        >
          <Ionicons
            name="person-remove-outline"
            size={16}
            color={COLORS.danger}
          />
        </Pressable>
      )}
    </View>
  );
}

// ── Main screen ──────────────────────────────────────────────────────────────

export default function GroupDetailsScreen() {
  const params = useLocalSearchParams<{ id: string | string[] }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const insets = useSafeAreaInsets();

  const [group, setGroup] = useState<Group | null>(null);
  const [members, setMembers] = useState<GroupMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [addModalVisible, setAddModalVisible] = useState(false);
  const [addUid, setAddUid] = useState("");
  const [addLoading, setAddLoading] = useState(false);

  const currentUid = auth.currentUser?.uid ?? "";
  const isAdmin = group?.creatorId === currentUid;

  // ── Load group and members ─────────────────────────────────────────────────

  const loadGroup = useCallback(
    async (showLoader = false) => {
      if (!id) {
        setGroup(null);
        setIsLoading(false);
        return;
      }

      if (showLoader) {
        setIsRefreshing(true);
      }

      try {
        const [groupData, memberData] = await Promise.all([
          fetchGroupById(id),
          fetchGroupMembers(id),
        ]);

        setGroup(groupData);
        setMembers(memberData);
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Failed to load group.";

        Alert.alert("Unable to load group", message);
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [id],
  );

  useEffect(() => {
    void loadGroup();
  }, [loadGroup]);

  // ── Add member ─────────────────────────────────────────────────────────────

  const handleAdd = async () => {
    if (!group || !addUid.trim()) {
      Alert.alert("Missing information", "Please enter the user's UID.");
      return;
    }

    try {
      setAddLoading(true);

      await handleAddMember(group, addUid.trim());

      setAddUid("");
      setAddModalVisible(false);

      await loadGroup();

      Alert.alert("Member added", "The member has been added to the group.");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Could not add member.";

      Alert.alert("Unable to add member", message);
    } finally {
      setAddLoading(false);
    }
  };

  // ── Remove member ──────────────────────────────────────────────────────────

  const confirmRemove = (uid: string) => {
    const target = members.find((member) => member.uid === uid);

    Alert.alert(
      "Remove member?",
      `Are you sure you want to remove ${
        target?.displayName || "this member"
      } from the group?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => {
            void doRemove(uid);
          },
        },
      ],
    );
  };

  const doRemove = async (uid: string) => {
    if (!group) return;

    try {
      await handleRemoveMember(group, uid);
      await loadGroup();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Could not remove member.";

      Alert.alert("Unable to remove member", message);
    }
  };

  // ── Loading state ──────────────────────────────────────────────────────────

  if (isLoading) {
    return (
      <View
        style={[
          styles.center,
          {
            paddingTop: insets.top,
            paddingBottom: insets.bottom,
          },
        ]}
      >
        <StatusBar
          barStyle="dark-content"
          backgroundColor={COLORS.background}
        />

        <View style={styles.loadingIcon}>
          <Ionicons name="people-outline" size={30} color={COLORS.primary} />
        </View>

        <ActivityIndicator
          size="large"
          color={COLORS.primary}
          style={styles.loadingSpinner}
        />

        <Text style={styles.loadingText}>Loading group details...</Text>
      </View>
    );
  }

  // ── Group not found ────────────────────────────────────────────────────────

  if (!group) {
    return (
      <View
        style={[
          styles.center,
          {
            paddingTop: insets.top,
            paddingBottom: insets.bottom,
          },
        ]}
      >
        <StatusBar
          barStyle="dark-content"
          backgroundColor={COLORS.background}
        />

        <View style={styles.notFoundIcon}>
          <Ionicons name="people-outline" size={36} color={COLORS.muted} />
        </View>

        <Text style={styles.notFoundTitle}>Group not found</Text>

        <Text style={styles.notFoundDescription}>
          This group may have been deleted or is no longer available.
        </Text>

        <Pressable
          style={styles.primaryButton}
          onPress={() => router.replace("/groups")}
        >
          <Ionicons name="arrow-back" size={18} color={COLORS.white} />
          <Text style={styles.primaryButtonText}>Back to Groups</Text>
        </Pressable>
      </View>
    );
  }

  // ── Main screen ────────────────────────────────────────────────────────────

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={COLORS.primaryDark}
      />

      <FlatList
        data={members}
        keyExtractor={(item) => item.uid}
        renderItem={({ item }) => (
          <MemberRow
            member={item}
            isAdmin={!!isAdmin}
            isCreator={item.uid === group.creatorId}
            onRemove={confirmRemove}
          />
        )}
        refreshing={isRefreshing}
        onRefresh={() => {
          void loadGroup(true);
        }}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: Math.max(insets.bottom, 20) + 16 },
        ]}
        ListHeaderComponent={
          <View>
            {/* Header */}
            <View
              style={[
                styles.hero,
                { paddingTop: Math.max(insets.top, 18) + 8 },
              ]}
            >
              <View style={styles.topBar}>
                <Pressable
                  style={styles.backButton}
                  onPress={() => router.replace("/groups")}
                  accessibilityRole="button"
                  accessibilityLabel="Back to groups"
                  hitSlop={8}
                >
                  <Ionicons name="arrow-back" size={22} color={COLORS.white} />
                </Pressable>

                <Text style={styles.topBarTitle}>Group Details</Text>

                <View style={styles.headerSpacer} />
              </View>

              <View style={styles.groupIcon}>
                <Ionicons name="people" size={34} color={COLORS.white} />
              </View>

              <Text style={styles.groupTitle}>{group.name}</Text>

              <Text style={styles.groupDescription}>
                {group.description?.trim() || "Your savings group"}
              </Text>

              {isAdmin && (
                <View style={styles.adminHeroBadge}>
                  <Ionicons
                    name="shield-checkmark"
                    size={14}
                    color={COLORS.white}
                  />
                  <Text style={styles.adminHeroBadgeText}>
                    Group Administrator
                  </Text>
                </View>
              )}

              {/* Statistics */}
              <View style={styles.statsCard}>
                <View style={styles.statItem}>
                  <View style={styles.statIcon}>
                    <Ionicons
                      name="people-outline"
                      size={20}
                      color={COLORS.primary}
                    />
                  </View>

                  <Text style={styles.statValue}>{members.length}</Text>
                  <Text style={styles.statLabel}>Members loaded</Text>
                </View>

                <View style={styles.statDivider} />

                <View style={styles.statItem}>
                  <View style={styles.statIcon}>
                    <Ionicons
                      name="key-outline"
                      size={20}
                      color={COLORS.primary}
                    />
                  </View>

                  <Text style={styles.statValue}>
                    {group.joinCode ? "Active" : "—"}
                  </Text>
                  <Text style={styles.statLabel}>Join code</Text>
                </View>
              </View>
            </View>

            {/* Join code */}
            <View style={styles.joinCodeCard}>
              <View style={styles.joinCodeTop}>
                <View style={styles.joinCodeIcon}>
                  <Ionicons name="key" size={21} color={COLORS.blue} />
                </View>

                <View style={styles.joinCodeTextContainer}>
                  <Text style={styles.cardTitle}>Group Join Code</Text>
                  <Text style={styles.cardSubtitle}>
                    Share this code with people you want to invite.
                  </Text>
                </View>
              </View>

              <View style={styles.codeDisplay}>
                <Text style={styles.codeValue} selectable>
                  {group.joinCode || "No code available"}
                </Text>
              </View>

              <View style={styles.codeHintRow}>
                <Ionicons
                  name="information-circle-outline"
                  size={15}
                  color={COLORS.muted}
                />
                <Text style={styles.codeHint}>
                  Only share this code with people you trust.
                </Text>
              </View>
            </View>

            {/* Members heading */}
            <View style={styles.membersHeader}>
              <View style={styles.membersHeadingText}>
                <Text style={styles.sectionTitle}>Group Members</Text>
                <Text style={styles.sectionSubtitle}>
                  {members.length} {members.length === 1 ? "person" : "people"}{" "}
                  in this list
                </Text>
              </View>

              {isAdmin && (
                <Pressable
                  style={({ pressed }) => [
                    styles.addButton,
                    pressed && styles.pressed,
                  ]}
                  onPress={() => setAddModalVisible(true)}
                  accessibilityRole="button"
                  accessibilityLabel="Add member"
                >
                  <Ionicons
                    name="person-add-outline"
                    size={17}
                    color={COLORS.white}
                  />
                  <Text style={styles.addButtonText}>Add Member</Text>
                </Pressable>
              )}
            </View>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyCard}>
            <View style={styles.emptyIcon}>
              <Ionicons name="people-outline" size={30} color={COLORS.muted} />
            </View>

            <Text style={styles.emptyTitle}>No member profiles found</Text>

            <Text style={styles.emptyDescription}>
              Member profiles will appear here when available.
            </Text>
          </View>
        }
        ListFooterComponent={
          members.length > 0 ? (
            <View style={styles.footerNote}>
              <Ionicons
                name="checkmark-circle-outline"
                size={16}
                color={COLORS.primary}
              />
              <Text style={styles.footerNoteText}>
                You are viewing the members of this group.
              </Text>
            </View>
          ) : null
        }
      />

      {/* Add member modal */}
      <Modal
        visible={addModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => {
          if (!addLoading) setAddModalVisible(false);
        }}
        statusBarTranslucent
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.modalOverlay}
        >
          {/* Corrected: use absoluteFill instead of absoluteFillObject */}
          <Pressable
            style={styles.modalDismissArea}
            onPress={() => {
              if (!addLoading) setAddModalVisible(false);
            }}
            accessibilityLabel="Close add member dialog"
          />

          <View
            style={[
              styles.modalCard,
              { paddingBottom: Math.max(insets.bottom, 24) },
            ]}
          >
            <View style={styles.modalHandle} />

            <View style={styles.modalIcon}>
              <Ionicons name="person-add" size={25} color={COLORS.primary} />
            </View>

            <Text style={styles.modalTitle}>Add a Member</Text>

            <Text style={styles.modalSubtitle}>
              Enter the Firebase user UID of the person you want to add.
            </Text>

            <Text style={styles.inputLabel}>USER UID</Text>

            <View style={styles.inputContainer}>
              <Ionicons name="key-outline" size={19} color={COLORS.muted} />

              <TextInput
                style={styles.input}
                placeholder="Enter user UID"
                placeholderTextColor="#9CA3AF"
                value={addUid}
                onChangeText={setAddUid}
                autoCapitalize="none"
                autoCorrect={false}
                editable={!addLoading}
                accessibilityLabel="User UID"
              />
            </View>

            <View style={styles.modalActions}>
              <Pressable
                style={({ pressed }) => [
                  styles.cancelButton,
                  pressed && styles.pressed,
                ]}
                onPress={() => {
                  setAddUid("");
                  setAddModalVisible(false);
                }}
                disabled={addLoading}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>

              <Pressable
                style={({ pressed }) => [
                  styles.confirmButton,
                  (!addUid.trim() || addLoading) && styles.disabledButton,
                  pressed && styles.pressed,
                ]}
                onPress={() => {
                  void handleAdd();
                }}
                disabled={!addUid.trim() || addLoading}
              >
                {addLoading ? (
                  <ActivityIndicator size="small" color={COLORS.white} />
                ) : (
                  <>
                    <Ionicons
                      name="person-add-outline"
                      size={18}
                      color={COLORS.white}
                    />
                    <Text style={styles.confirmButtonText}>Add Member</Text>
                  </>
                )}
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

// ── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 28,
    backgroundColor: COLORS.background,
  },
  loadingIcon: {
    width: 72,
    height: 72,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primaryLight,
  },
  loadingSpinner: {
    marginTop: 24,
  },
  loadingText: {
    marginTop: 12,
    color: COLORS.muted,
    fontSize: 14,
  },
  notFoundIcon: {
    width: 84,
    height: 84,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E5E7EB",
    marginBottom: 20,
  },
  notFoundTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: COLORS.heading,
    marginBottom: 8,
  },
  notFoundDescription: {
    fontSize: 14,
    color: COLORS.muted,
    textAlign: "center",
    lineHeight: 21,
    marginBottom: 24,
  },
  primaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
  },
  primaryButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "700",
  },

  // Hero header
  hero: {
    backgroundColor: COLORS.primaryDark,
    paddingHorizontal: 20,
    paddingBottom: 42,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 26,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.14)",
  },
  topBarTitle: {
    flex: 1,
    textAlign: "center",
    color: COLORS.white,
    fontSize: 17,
    fontWeight: "700",
  },
  headerSpacer: {
    width: 44,
  },
  groupIcon: {
    width: 68,
    height: 68,
    borderRadius: 23,
    backgroundColor: "rgba(255,255,255,0.16)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 17,
    alignSelf: "center",
  },
  groupTitle: {
    color: COLORS.white,
    fontSize: 27,
    fontWeight: "800",
    textAlign: "center",
    letterSpacing: -0.5,
  },
  groupDescription: {
    color: "#D1FAE5",
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
    marginTop: 8,
    paddingHorizontal: 8,
  },
  adminHeroBadge: {
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(255,255,255,0.15)",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 30,
    marginTop: 15,
  },
  adminHeroBadgeText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: "700",
  },

  // Statistics
  statsCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: 20,
    paddingVertical: 18,
    paddingHorizontal: 8,
    marginTop: 28,
    marginBottom: -67,
    elevation: 5,
    shadowColor: "#064E3B",
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 5 },
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statIcon: {
    width: 38,
    height: 38,
    borderRadius: 13,
    backgroundColor: COLORS.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 7,
  },
  statValue: {
    color: COLORS.heading,
    fontSize: 18,
    fontWeight: "800",
  },
  statLabel: {
    color: COLORS.muted,
    fontSize: 11,
    marginTop: 4,
    textAlign: "center",
  },
  statDivider: {
    width: 1,
    height: 66,
    backgroundColor: COLORS.border,
  },

  // List
  listContent: {
    paddingBottom: 24,
  },

  // Join code
  joinCodeCard: {
    marginHorizontal: 16,
    marginTop: 83,
    padding: 18,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: "#102A24",
    shadowOpacity: 0.035,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  joinCodeTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  joinCodeIcon: {
    width: 46,
    height: 46,
    borderRadius: 15,
    backgroundColor: COLORS.blueLight,
    alignItems: "center",
    justifyContent: "center",
  },
  joinCodeTextContainer: {
    flex: 1,
  },
  cardTitle: {
    color: COLORS.heading,
    fontSize: 15,
    fontWeight: "800",
  },
  cardSubtitle: {
    color: COLORS.muted,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 4,
  },
  codeDisplay: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
    paddingHorizontal: 10,
    marginTop: 18,
    borderRadius: 14,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#93C5FD",
    backgroundColor: "#F8FBFF",
  },
  codeValue: {
    color: COLORS.blue,
    fontSize: 24,
    fontWeight: "800",
    letterSpacing: 4,
    textAlign: "center",
  },
  codeHintRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    marginTop: 13,
  },
  codeHint: {
    color: COLORS.muted,
    fontSize: 11,
    flexShrink: 1,
  },

  // Members
  membersHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 18,
    marginTop: 28,
    marginBottom: 15,
  },
  membersHeadingText: {
    flex: 1,
    minWidth: 0,
  },
  sectionTitle: {
    color: COLORS.heading,
    fontSize: 19,
    fontWeight: "800",
  },
  sectionSubtitle: {
    color: COLORS.muted,
    fontSize: 12,
    marginTop: 5,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 11,
    borderRadius: 12,
  },
  addButtonText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: "700",
  },
  memberCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 11,
    backgroundColor: COLORS.white,
    marginHorizontal: 16,
    marginBottom: 10,
    padding: 13,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: "#E8EEEB",
    shadowColor: "#102A24",
    shadowOpacity: 0.025,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  memberAvatar: {
    width: 47,
    height: 47,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primaryLight,
  },
  memberAvatarText: {
    color: COLORS.primaryDark,
    fontSize: 19,
    fontWeight: "800",
  },
  memberInfo: {
    flex: 1,
    minWidth: 0,
  },
  memberName: {
    color: COLORS.heading,
    fontSize: 14,
    fontWeight: "700",
  },
  memberEmail: {
    color: COLORS.muted,
    fontSize: 11,
    marginTop: 4,
  },
  creatorBadge: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 7,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
    backgroundColor: COLORS.primaryLight,
  },
  creatorBadgeText: {
    color: COLORS.primaryDark,
    fontSize: 10,
    fontWeight: "700",
  },
  removeButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: COLORS.dangerLight,
    alignItems: "center",
    justifyContent: "center",
  },
  pressed: {
    opacity: 0.75,
    transform: [{ scale: 0.98 }],
  },

  // Empty state
  emptyCard: {
    marginHorizontal: 16,
    paddingVertical: 30,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
  },
  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: 22,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  emptyTitle: {
    color: COLORS.heading,
    fontSize: 15,
    fontWeight: "700",
    textAlign: "center",
  },
  emptyDescription: {
    color: COLORS.muted,
    fontSize: 12,
    lineHeight: 18,
    textAlign: "center",
    marginTop: 7,
  },
  footerNote: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  footerNoteText: {
    color: COLORS.muted,
    fontSize: 11,
  },

  // Modal
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(15, 23, 42, 0.48)",
  },
  modalDismissArea: {
    ...StyleSheet.absoluteFill,
  },
  modalCard: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 24,
    paddingTop: 12,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },
  modalHandle: {
    width: 42,
    height: 5,
    borderRadius: 10,
    backgroundColor: "#D1D5DB",
    alignSelf: "center",
    marginBottom: 24,
  },
  modalIcon: {
    width: 58,
    height: 58,
    borderRadius: 19,
    backgroundColor: COLORS.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },
  modalTitle: {
    color: COLORS.heading,
    fontSize: 23,
    fontWeight: "800",
  },
  modalSubtitle: {
    color: COLORS.muted,
    fontSize: 13,
    lineHeight: 20,
    marginTop: 8,
    marginBottom: 24,
  },
  inputLabel: {
    color: COLORS.text,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1,
    marginBottom: 9,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    minHeight: 54,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 14,
    paddingHorizontal: 14,
    backgroundColor: "#F9FAFB",
  },
  input: {
    flex: 1,
    minWidth: 0,
    color: COLORS.heading,
    fontSize: 14,
    paddingVertical: 13,
  },
  modalActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 24,
  },
  cancelButton: {
    flex: 1,
    minHeight: 50,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F3F4F6",
    borderRadius: 14,
  },
  cancelButtonText: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: "700",
  },
  confirmButton: {
    flex: 1.4,
    flexDirection: "row",
    gap: 8,
    minHeight: 50,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primary,
    borderRadius: 14,
  },
  confirmButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "700",
  },
  disabledButton: {
    opacity: 0.45,
  },
});
