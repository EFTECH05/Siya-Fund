import React, { useState, useEffect, useCallback } from "react";
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
  StatusBar,
  RefreshControl,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import {
  fetchUserGroups,
  handleJoinGroup,
} from "../../controllers/GroupController";
import { Group } from "../../models/Group";
import GroupCard from "../../components/GroupCard";

const COLORS = {
  primary: "#059669",
  primaryDark: "#047857",
  primaryLight: "#D1FAE5",
  background: "#F5F8F7",
  white: "#FFFFFF",
  heading: "#102A24",
  text: "#52645F",
  muted: "#899892",
  border: "#E5EDE9",
  danger: "#DC2626",
};

export default function GroupsScreen() {
  const insets = useSafeAreaInsets();

  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [joinModalVisible, setJoinModalVisible] = useState(false);
  const [joinCode, setJoinCode] = useState("");
  const [joinLoading, setJoinLoading] = useState(false);

  const loadGroups = useCallback(async (showLoader = false) => {
    try {
      if (showLoader) {
        setIsLoading(true);
      }

      const userGroups = await fetchUserGroups();
      setGroups(userGroups);
    } catch (error) {
      console.error("Failed to load groups:", error);

      Alert.alert(
        "Unable to load groups",
        "Please check your connection and try again.",
      );
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Load groups when this screen first opens.
  useEffect(() => {
    loadGroups(true);
  }, [loadGroups]);

  // Refresh the groups when returning to this screen.
  useFocusEffect(
    useCallback(() => {
      loadGroups();
    }, [loadGroups]),
  );

  const handleRefresh = () => {
    setRefreshing(true);
    loadGroups();
  };

  const handlePress = (id: string) => {
    router.push(`/groups/${id}`);
  };

  const handleJoin = async () => {
    const code = joinCode.trim().toUpperCase();

    if (code.length !== 6) {
      Alert.alert(
        "Invalid code",
        "Please enter the complete 6-character group code.",
      );
      return;
    }

    try {
      setJoinLoading(true);

      const groupId = await handleJoinGroup(code);

      setJoinCode("");
      setJoinModalVisible(false);

      await loadGroups();

      Alert.alert("Success", "You have joined the group!", [
        {
          text: "View Group",
          onPress: () => router.push(`/groups/${groupId}`),
        },
        {
          text: "OK",
        },
      ]);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "We couldn't join this group. Please try again.";

      Alert.alert("Unable to join group", message);
    } finally {
      setJoinLoading(false);
    }
  };

  const closeJoinModal = () => {
    if (joinLoading) return;

    setJoinCode("");
    setJoinModalVisible(false);
  };

  if (isLoading) {
    return (
      <View style={[styles.loadingScreen, { paddingTop: insets.top }]}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor={COLORS.background}
        />

        <View style={styles.loadingIcon}>
          <Ionicons name="people" size={32} color={COLORS.primary} />
        </View>

        <ActivityIndicator
          size="large"
          color={COLORS.primary}
          style={styles.loadingSpinner}
        />

        <Text style={styles.loadingTitle}>Loading your groups</Text>

        <Text style={styles.loadingSubtitle}>
          Getting your savings journey ready...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={COLORS.primaryDark}
      />

      <FlatList
        data={groups}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <GroupCard group={item} onPress={handlePress} />
        )}
        contentContainerStyle={[
          styles.listContent,
          {
            paddingBottom: Math.max(insets.bottom, 20) + 20,
          },
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={COLORS.primary}
            colors={[COLORS.primary]}
          />
        }
        ListHeaderComponent={
          <View>
            {/* Hero header */}
            <View
              style={[
                styles.hero,
                {
                  paddingTop: insets.top + 12,
                },
              ]}
            >
              <View style={styles.heroTopRow}>
                <Pressable
                  style={({ pressed }) => [
                    styles.backButton,
                    pressed && styles.pressed,
                  ]}
                  onPress={() => router.replace("/dashboard")}
                  accessibilityRole="button"
                  accessibilityLabel="Back to dashboard"
                >
                  <Ionicons name="arrow-back" size={19} color={COLORS.white} />

                  <Text style={styles.backButtonText}>Dashboard</Text>
                </Pressable>

                <View style={styles.heroIcon}>
                  <Ionicons
                    name="wallet-outline"
                    size={22}
                    color={COLORS.white}
                  />
                </View>
              </View>

              <Text style={styles.eyebrow}>YOUR FINANCIAL COMMUNITY</Text>

              <Text style={styles.heroTitle}>My Savings{"\n"}Groups</Text>

              <Text style={styles.heroDescription}>
                Save together, support each other, and reach your goals.
              </Text>

              <View style={styles.groupCountBadge}>
                <Ionicons name="people" size={16} color={COLORS.white} />

                <Text style={styles.groupCountText}>
                  {groups.length} {groups.length === 1 ? "group" : "groups"}
                </Text>
              </View>

              {/* Decorative circles */}
              <View style={styles.decorCircleLarge} />
              <View style={styles.decorCircleSmall} />
            </View>

            {/* Main content */}
            <View style={styles.content}>
              <View style={styles.sectionHeading}>
                <View>
                  <Text style={styles.sectionTitle}>Your community</Text>

                  <Text style={styles.sectionSubtitle}>
                    Manage your savings groups
                  </Text>
                </View>

                <View style={styles.sectionIcon}>
                  <Ionicons
                    name="people-outline"
                    size={21}
                    color={COLORS.primary}
                  />
                </View>
              </View>

              {/* Action cards */}
              <View style={styles.actions}>
                <Pressable
                  style={({ pressed }) => [
                    styles.actionCard,
                    styles.joinActionCard,
                    pressed && styles.pressed,
                  ]}
                  onPress={() => setJoinModalVisible(true)}
                  accessibilityRole="button"
                  accessibilityLabel="Join a group with a code"
                >
                  <View style={styles.joinIconBox}>
                    <Ionicons
                      name="key-outline"
                      size={23}
                      color={COLORS.primary}
                    />
                  </View>

                  <Text style={styles.actionTitle}>Join a Group</Text>

                  <Text style={styles.actionDescription}>
                    Have an invitation code?
                  </Text>

                  <View style={styles.actionFooter}>
                    <Text style={styles.joinActionLabel}>Enter code</Text>

                    <Ionicons
                      name="arrow-forward-circle"
                      size={22}
                      color={COLORS.primary}
                    />
                  </View>
                </Pressable>

                <Pressable
                  style={({ pressed }) => [
                    styles.actionCard,
                    styles.createActionCard,
                    pressed && styles.pressed,
                  ]}
                  onPress={() => router.push("/groups/create")}
                  accessibilityRole="button"
                  accessibilityLabel="Create a new savings group"
                >
                  <View style={styles.createIconBox}>
                    <Ionicons name="add" size={25} color={COLORS.white} />
                  </View>

                  <Text style={styles.actionTitle}>Create a Group</Text>

                  <Text style={styles.actionDescription}>
                    Start saving together.
                  </Text>

                  <View style={styles.actionFooter}>
                    <Text style={styles.createActionLabel}>Get started</Text>

                    <Ionicons
                      name="arrow-forward-circle"
                      size={22}
                      color={COLORS.primary}
                    />
                  </View>
                </Pressable>
              </View>

              <View style={styles.groupsHeading}>
                <Text style={styles.sectionTitle}>Your groups</Text>

                <Text style={styles.groupsCount}>{groups.length}</Text>
              </View>
            </View>

            {/* Empty state */}
            {groups.length === 0 && (
              <View style={styles.emptyCard}>
                <View style={styles.emptyIconCircle}>
                  <Ionicons
                    name="people-outline"
                    size={38}
                    color={COLORS.primary}
                  />
                </View>

                <Text style={styles.emptyTitle}>Your journey starts here</Text>

                <Text style={styles.emptyDescription}>
                  You haven't joined a savings group yet. Create your own group
                  or use an invitation code to join friends and start saving
                  together.
                </Text>

                <Pressable
                  style={({ pressed }) => [
                    styles.emptyButton,
                    pressed && styles.pressed,
                  ]}
                  onPress={() => router.push("/groups/create")}
                  accessibilityRole="button"
                >
                  <Ionicons
                    name="add-circle-outline"
                    size={19}
                    color={COLORS.white}
                  />

                  <Text style={styles.emptyButtonText}>
                    Create Your First Group
                  </Text>
                </Pressable>
              </View>
            )}
          </View>
        }
        ItemSeparatorComponent={() => <View style={styles.groupSeparator} />}
      />

      {/* Join group modal */}
      <Modal
        visible={joinModalVisible}
        transparent
        animationType="slide"
        statusBarTranslucent
        onRequestClose={closeJoinModal}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={[
            styles.modalOverlay,
            {
              paddingBottom: Math.max(insets.bottom, 12),
            },
          ]}
        >
          {/* Fixed: use absoluteFill instead of absoluteFillObject */}
          <Pressable
            style={styles.modalBackdrop}
            onPress={closeJoinModal}
            accessibilityLabel="Close join group dialog"
          />

          <View style={styles.modalCard}>
            <View style={styles.modalHandle} />

            <View style={styles.modalHeader}>
              <View style={styles.modalIconBox}>
                <Ionicons name="people" size={25} color={COLORS.primary} />
              </View>

              <Pressable
                style={styles.modalCloseButton}
                onPress={closeJoinModal}
                disabled={joinLoading}
                accessibilityLabel="Close"
              >
                <Ionicons name="close" size={23} color={COLORS.text} />
              </Pressable>
            </View>

            <Text style={styles.modalTitle}>Join a Savings Group</Text>

            <Text style={styles.modalSubtitle}>
              Enter the 6-character invitation code shared by your group admin.
            </Text>

            <Text style={styles.inputLabel}>INVITATION CODE</Text>

            <TextInput
              style={styles.input}
              placeholder="e.g. GK6HX3"
              placeholderTextColor="#A0ADA7"
              value={joinCode}
              onChangeText={(text) =>
                setJoinCode(
                  text
                    .toUpperCase()
                    .replace(/[^A-Z0-9]/g, "")
                    .slice(0, 6),
                )
              }
              autoCapitalize="characters"
              autoCorrect={false}
              maxLength={6}
              editable={!joinLoading}
              returnKeyType="done"
              onSubmitEditing={handleJoin}
              accessibilityLabel="Six-character group invitation code"
            />

            <Text style={styles.codeHint}>
              {joinCode.length}/6 characters entered
            </Text>

            <View style={styles.modalActions}>
              <Pressable
                style={({ pressed }) => [
                  styles.cancelButton,
                  pressed && styles.pressed,
                ]}
                onPress={closeJoinModal}
                disabled={joinLoading}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>

              <Pressable
                style={({ pressed }) => [
                  styles.confirmButton,
                  (joinCode.length !== 6 || joinLoading) &&
                    styles.disabledButton,
                  pressed && joinCode.length === 6 && styles.pressed,
                ]}
                onPress={handleJoin}
                disabled={joinCode.length !== 6 || joinLoading}
                accessibilityRole="button"
              >
                {joinLoading ? (
                  <ActivityIndicator color={COLORS.white} size="small" />
                ) : (
                  <>
                    <Text style={styles.confirmButtonText}>Join Group</Text>

                    <Ionicons
                      name="arrow-forward"
                      size={18}
                      color={COLORS.white}
                    />
                  </>
                )}
              </Pressable>
            </View>

            <View style={styles.secureNote}>
              <Ionicons
                name="shield-checkmark-outline"
                size={16}
                color={COLORS.primary}
              />

              <Text style={styles.secureNoteText}>
                Make sure you have the correct invitation code.
              </Text>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  loadingScreen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.background,
    paddingHorizontal: 24,
  },

  loadingIcon: {
    width: 76,
    height: 76,
    borderRadius: 25,
    backgroundColor: COLORS.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },

  loadingSpinner: {
    marginTop: 26,
  },

  loadingTitle: {
    marginTop: 18,
    fontSize: 19,
    fontWeight: "800",
    color: COLORS.heading,
  },

  loadingSubtitle: {
    marginTop: 7,
    fontSize: 14,
    color: COLORS.text,
    textAlign: "center",
  },

  hero: {
    backgroundColor: COLORS.primaryDark,
    paddingHorizontal: 22,
    paddingBottom: 30,
    overflow: "hidden",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },

  heroTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 29,
    zIndex: 2,
  },

  backButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingVertical: 10,
    paddingHorizontal: 13,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.14)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.19)",
    gap: 8,
  },

  backButtonText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: "700",
  },

  heroIcon: {
    width: 43,
    height: 43,
    borderRadius: 15,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },

  eyebrow: {
    color: "#A7F3D0",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 2,
    marginBottom: 12,
    zIndex: 1,
  },

  heroTitle: {
    color: COLORS.white,
    fontSize: 35,
    lineHeight: 40,
    fontWeight: "900",
    letterSpacing: -0.8,
    zIndex: 1,
  },

  heroDescription: {
    color: "#D1FAE5",
    fontSize: 14,
    lineHeight: 22,
    marginTop: 12,
    maxWidth: 310,
    zIndex: 1,
  },

  groupCountBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 7,
    paddingHorizontal: 13,
    paddingVertical: 9,
    marginTop: 20,
    borderRadius: 30,
    backgroundColor: "rgba(255,255,255,0.15)",
    zIndex: 1,
  },

  groupCountText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: "700",
  },

  decorCircleLarge: {
    position: "absolute",
    width: 210,
    height: 210,
    borderRadius: 105,
    backgroundColor: "rgba(255,255,255,0.045)",
    right: -80,
    top: 80,
  },

  decorCircleSmall: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    right: 5,
    bottom: -48,
  },

  listContent: {
    paddingBottom: 24,
  },

  content: {
    paddingHorizontal: 20,
  },

  sectionHeading: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 25,
    marginBottom: 17,
  },

  sectionTitle: {
    color: COLORS.heading,
    fontSize: 19,
    fontWeight: "800",
    letterSpacing: -0.3,
  },

  sectionSubtitle: {
    color: COLORS.muted,
    fontSize: 12,
    marginTop: 5,
  },

  sectionIcon: {
    width: 43,
    height: 43,
    borderRadius: 15,
    backgroundColor: COLORS.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },

  actions: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 27,
  },

  actionCard: {
    flex: 1,
    minWidth: 0,
    padding: 15,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
    minHeight: 190,
    justifyContent: "flex-start",
    shadowColor: "#163D30",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.045,
    shadowRadius: 12,
    elevation: 2,
  },

  joinActionCard: {
    backgroundColor: "#F0FDF7",
    borderColor: "#CDEFE0",
  },

  createActionCard: {
    backgroundColor: COLORS.white,
  },

  joinIconBox: {
    width: 43,
    height: 43,
    borderRadius: 14,
    backgroundColor: "#D1FAE5",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },

  createIconBox: {
    width: 43,
    height: 43,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },

  actionTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: COLORS.heading,
  },

  actionDescription: {
    fontSize: 11,
    lineHeight: 17,
    color: COLORS.text,
    marginTop: 6,
    minHeight: 34,
  },

  actionFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: "auto",
    paddingTop: 12,
  },

  joinActionLabel: {
    fontSize: 11,
    fontWeight: "800",
    color: COLORS.primaryDark,
  },

  createActionLabel: {
    fontSize: 11,
    fontWeight: "800",
    color: COLORS.heading,
  },

  groupsHeading: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 15,
  },

  groupsCount: {
    minWidth: 27,
    height: 27,
    overflow: "hidden",
    textAlign: "center",
    textAlignVertical: "center",
    paddingHorizontal: 7,
    paddingTop: 5,
    borderRadius: 10,
    color: COLORS.primaryDark,
    backgroundColor: COLORS.primaryLight,
    fontSize: 12,
    fontWeight: "800",
  },

  groupSeparator: {
    height: 13,
  },

  emptyCard: {
    marginHorizontal: 20,
    marginTop: 4,
    paddingHorizontal: 22,
    paddingVertical: 28,
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 24,
  },

  emptyIconCircle: {
    width: 82,
    height: 82,
    borderRadius: 27,
    backgroundColor: "#E8F8F0",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },

  emptyTitle: {
    color: COLORS.heading,
    fontSize: 18,
    fontWeight: "800",
    textAlign: "center",
  },

  emptyDescription: {
    marginTop: 10,
    fontSize: 13,
    lineHeight: 21,
    color: COLORS.text,
    textAlign: "center",
  },

  emptyButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
    alignSelf: "stretch",
    marginTop: 22,
    paddingVertical: 15,
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
  },

  emptyButtonText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: "800",
  },

  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(8, 25, 19, 0.55)",
  },

  modalBackdrop: {
    ...StyleSheet.absoluteFill,
  },

  modalCard: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 25,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },

  modalHandle: {
    alignSelf: "center",
    width: 43,
    height: 5,
    borderRadius: 5,
    backgroundColor: "#DDE5E0",
    marginBottom: 23,
  },

  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 17,
  },

  modalIconBox: {
    width: 54,
    height: 54,
    borderRadius: 18,
    backgroundColor: "#D1FAE5",
    alignItems: "center",
    justifyContent: "center",
  },

  modalCloseButton: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: COLORS.background,
    alignItems: "center",
    justifyContent: "center",
  },

  modalTitle: {
    color: COLORS.heading,
    fontSize: 23,
    fontWeight: "900",
    letterSpacing: -0.4,
  },

  modalSubtitle: {
    color: COLORS.text,
    fontSize: 13,
    lineHeight: 21,
    marginTop: 9,
    marginBottom: 25,
  },

  inputLabel: {
    color: COLORS.text,
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.5,
    marginBottom: 10,
  },

  input: {
    borderWidth: 1.5,
    borderColor: "#B9E7D3",
    borderRadius: 16,
    paddingVertical: 17,
    paddingHorizontal: 14,
    fontSize: 23,
    fontWeight: "900",
    color: COLORS.primaryDark,
    backgroundColor: "#F5FCF8",
    textAlign: "center",
    letterSpacing: 8,
  },

  codeHint: {
    textAlign: "right",
    fontSize: 11,
    color: COLORS.muted,
    marginTop: 8,
    marginBottom: 22,
  },

  modalActions: {
    flexDirection: "row",
    gap: 12,
  },

  cancelButton: {
    flex: 0.8,
    minHeight: 52,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F1F5F3",
    borderRadius: 15,
  },

  cancelButtonText: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: "800",
  },

  confirmButton: {
    flex: 1.2,
    minHeight: 52,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: COLORS.primary,
    borderRadius: 15,
  },

  confirmButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "800",
  },

  disabledButton: {
    opacity: 0.45,
  },

  secureNote: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 7,
    marginTop: 22,
  },

  secureNoteText: {
    color: COLORS.muted,
    fontSize: 11,
    flexShrink: 1,
    textAlign: "center",
  },

  pressed: {
    opacity: 0.78,
    transform: [{ scale: 0.98 }],
  },
});
