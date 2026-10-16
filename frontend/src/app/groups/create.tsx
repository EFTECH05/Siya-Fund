import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { handleCreateGroup } from "../../controllers/GroupController";

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
  inputBackground: "#F9FBFA",
};

export default function CreateGroupScreen() {
  const insets = useSafeAreaInsets();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const MAX_NAME_LENGTH = 50;
  const MAX_DESCRIPTION_LENGTH = 250;

  const handleCreate = async () => {
    const trimmedName = name.trim();
    const trimmedDescription = description.trim();

    if (!trimmedName || !trimmedDescription) {
      Alert.alert(
        "Missing information",
        "Please enter both a group name and a description.",
      );
      return;
    }

    if (trimmedName.length < 3) {
      Alert.alert(
        "Group name too short",
        "Please enter a group name with at least 3 characters.",
      );
      return;
    }

    try {
      setIsLoading(true);

      await handleCreateGroup(trimmedName, trimmedDescription);

      Alert.alert(
        "Group created!",
        "Your savings group has been created successfully.",
        [
          {
            text: "View Groups",
            onPress: () => router.replace("/groups"),
          },
        ],
      );
    } catch (error: unknown) {
      console.error("Create Group Error:", error);

      const message =
        error instanceof Error
          ? error.message
          : "Could not create your group. Please try again.";

      Alert.alert("Unable to create group", message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <StatusBar
        barStyle="light-content"
        backgroundColor={COLORS.primaryDark}
      />

      <ScrollView
        style={styles.container}
        contentContainerStyle={[
          styles.contentContainer,
          {
            paddingBottom: Math.max(insets.bottom, 20) + 24,
          },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View
          style={[
            styles.hero,
            {
              paddingTop: insets.top + 12,
            },
          ]}
        >
          <View style={styles.headerRow}>
            <Pressable
              style={({ pressed }) => [
                styles.backButton,
                pressed && styles.pressed,
              ]}
              onPress={() => router.replace("/groups")}
              accessibilityRole="button"
              accessibilityLabel="Back to savings groups"
            >
              <Ionicons name="arrow-back" size={19} color={COLORS.white} />
              <Text style={styles.backButtonText}>My Groups</Text>
            </Pressable>

            <View style={styles.headerIcon}>
              <Ionicons name="people" size={22} color={COLORS.white} />
            </View>
          </View>

          <Text style={styles.eyebrow}>SAVE BETTER TOGETHER</Text>

          <Text style={styles.heroTitle}>Create Your{"\n"}Savings Group</Text>

          <Text style={styles.heroDescription}>
            Bring people together, set a shared goal, and build a stronger
            savings habit as a team.
          </Text>

          <View style={styles.heroDecorationLarge} />
          <View style={styles.heroDecorationSmall} />
        </View>

        {/* Form introduction */}
        <View style={styles.intro}>
          <View style={styles.introIcon}>
            <Ionicons
              name="sparkles-outline"
              size={23}
              color={COLORS.primary}
            />
          </View>

          <View style={styles.introTextContainer}>
            <Text style={styles.introTitle}>Let's get started</Text>
            <Text style={styles.introDescription}>
              Add a name and description for your group.
            </Text>
          </View>
        </View>

        {/* Form card */}
        <View style={styles.formCard}>
          <View style={styles.formHeading}>
            <Text style={styles.formTitle}>Group details</Text>
            <Text style={styles.requiredLabel}>* Required</Text>
          </View>

          {/* Group name */}
          <View style={styles.fieldHeader}>
            <Text style={styles.label}>Group name</Text>
            <Text style={styles.counter}>
              {name.length}/{MAX_NAME_LENGTH}
            </Text>
          </View>

          <View style={styles.inputWrapper}>
            <Ionicons
              name="people-outline"
              size={20}
              color={COLORS.primary}
              style={styles.inputIcon}
            />

            <TextInput
              style={styles.input}
              placeholder="e.g. Family Savings Club"
              placeholderTextColor="#9AA9A2"
              value={name}
              onChangeText={(text) => setName(text.slice(0, MAX_NAME_LENGTH))}
              maxLength={MAX_NAME_LENGTH}
              autoCapitalize="words"
              autoCorrect
              editable={!isLoading}
              returnKeyType="next"
              accessibilityLabel="Group name"
            />
          </View>

          <Text style={styles.helperText}>
            Choose a name that everyone in your group will recognise.
          </Text>

          {/* Description */}
          <View style={[styles.fieldHeader, styles.descriptionHeader]}>
            <Text style={styles.label}>Group description</Text>
            <Text style={styles.counter}>
              {description.length}/{MAX_DESCRIPTION_LENGTH}
            </Text>
          </View>

          <View style={[styles.inputWrapper, styles.descriptionWrapper]}>
            <Ionicons
              name="document-text-outline"
              size={20}
              color={COLORS.primary}
              style={[styles.inputIcon, styles.descriptionIcon]}
            />

            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="What are you saving for? Describe your group's purpose and goals..."
              placeholderTextColor="#9AA9A2"
              value={description}
              onChangeText={(text) =>
                setDescription(text.slice(0, MAX_DESCRIPTION_LENGTH))
              }
              maxLength={MAX_DESCRIPTION_LENGTH}
              multiline
              numberOfLines={5}
              textAlignVertical="top"
              autoCorrect
              editable={!isLoading}
              accessibilityLabel="Group description"
            />
          </View>

          <Text style={styles.helperText}>
            Explain the purpose of the group and what members hope to achieve
            together.
          </Text>

          {/* Submit */}
          <Pressable
            style={({ pressed }) => [
              styles.createButton,
              isLoading && styles.disabledButton,
              pressed && !isLoading && styles.pressed,
            ]}
            onPress={handleCreate}
            disabled={isLoading}
            accessibilityRole="button"
            accessibilityLabel="Create savings group"
          >
            {isLoading ? (
              <>
                <ActivityIndicator color={COLORS.white} size="small" />
                <Text style={styles.createButtonText}>
                  Creating your group...
                </Text>
              </>
            ) : (
              <>
                <Ionicons
                  name="add-circle-outline"
                  size={21}
                  color={COLORS.white}
                />
                <Text style={styles.createButtonText}>
                  Create Savings Group
                </Text>
                <Ionicons name="arrow-forward" size={19} color={COLORS.white} />
              </>
            )}
          </Pressable>

          <View style={styles.secureNote}>
            <Ionicons
              name="shield-checkmark-outline"
              size={17}
              color={COLORS.primary}
            />
            <Text style={styles.secureNoteText}>
              Your group details will be saved securely.
            </Text>
          </View>
        </View>

        {/* Bottom tip */}
        <View style={styles.tipCard}>
          <View style={styles.tipIcon}>
            <Ionicons name="bulb-outline" size={22} color="#B7791F" />
          </View>

          <View style={styles.tipTextContainer}>
            <Text style={styles.tipTitle}>A little tip</Text>
            <Text style={styles.tipDescription}>
              Give your group a clear purpose so members understand what they
              are working towards together.
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  container: {
    flex: 1,
  },

  contentContainer: {
    paddingBottom: 30,
  },

  hero: {
    backgroundColor: COLORS.primaryDark,
    paddingHorizontal: 22,
    paddingBottom: 32,
    overflow: "hidden",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },

  headerRow: {
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
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 13,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.14)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.19)",
  },

  backButtonText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: "700",
  },

  headerIcon: {
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
    fontSize: 34,
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
    maxWidth: 320,
    zIndex: 1,
  },

  heroDecorationLarge: {
    position: "absolute",
    width: 210,
    height: 210,
    borderRadius: 105,
    backgroundColor: "rgba(255,255,255,0.045)",
    right: -80,
    top: 90,
  },

  heroDecorationSmall: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    right: 8,
    bottom: -45,
  },

  intro: {
    flexDirection: "row",
    alignItems: "center",
    gap: 13,
    paddingHorizontal: 20,
    marginTop: 25,
    marginBottom: 18,
  },

  introIcon: {
    width: 49,
    height: 49,
    borderRadius: 16,
    backgroundColor: COLORS.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },

  introTextContainer: {
    flex: 1,
  },

  introTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: COLORS.heading,
  },

  introDescription: {
    marginTop: 4,
    fontSize: 12,
    lineHeight: 18,
    color: COLORS.text,
  },

  formCard: {
    marginHorizontal: 20,
    padding: 20,
    backgroundColor: COLORS.white,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: "#163D30",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.045,
    shadowRadius: 12,
    elevation: 2,
  },

  formHeading: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 23,
  },

  formTitle: {
    color: COLORS.heading,
    fontSize: 18,
    fontWeight: "900",
  },

  requiredLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: COLORS.muted,
  },

  fieldHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 9,
  },

  label: {
    fontSize: 13,
    fontWeight: "800",
    color: COLORS.heading,
  },

  counter: {
    fontSize: 10,
    color: COLORS.muted,
    fontWeight: "600",
  },

  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 15,
    backgroundColor: COLORS.inputBackground,
    paddingHorizontal: 13,
    minHeight: 54,
  },

  inputIcon: {
    marginRight: 11,
  },

  input: {
    flex: 1,
    minWidth: 0,
    color: COLORS.heading,
    fontSize: 14,
    paddingVertical: 15,
  },

  helperText: {
    color: COLORS.muted,
    fontSize: 11,
    lineHeight: 17,
    marginTop: 8,
    marginBottom: 22,
  },

  descriptionHeader: {
    marginTop: 1,
  },

  descriptionWrapper: {
    alignItems: "flex-start",
    minHeight: 145,
    paddingTop: 4,
  },

  descriptionIcon: {
    marginTop: 12,
  },

  textArea: {
    minHeight: 135,
    paddingTop: 12,
    paddingBottom: 12,
    lineHeight: 21,
  },

  createButton: {
    minHeight: 55,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingHorizontal: 15,
    marginTop: 5,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
  },

  createButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "800",
    flexShrink: 1,
  },

  disabledButton: {
    opacity: 0.65,
  },

  secureNote: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    marginTop: 18,
  },

  secureNoteText: {
    color: COLORS.muted,
    fontSize: 11,
    flexShrink: 1,
    textAlign: "center",
  },

  tipCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 13,
    marginHorizontal: 20,
    marginTop: 17,
    padding: 16,
    borderRadius: 19,
    borderWidth: 1,
    borderColor: "#F3E5BC",
    backgroundColor: "#FFFBEB",
  },

  tipIcon: {
    width: 39,
    height: 39,
    borderRadius: 13,
    backgroundColor: "#FEF3C7",
    alignItems: "center",
    justifyContent: "center",
  },

  tipTextContainer: {
    flex: 1,
  },

  tipTitle: {
    color: "#854D0E",
    fontSize: 13,
    fontWeight: "800",
  },

  tipDescription: {
    color: "#92723A",
    fontSize: 12,
    lineHeight: 19,
    marginTop: 5,
  },

  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.99 }],
  },
});
