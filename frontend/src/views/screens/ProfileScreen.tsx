import React, { useEffect, useState } from "react";
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { router } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../services/firebase";
import { loadProfile, logout, saveProfile } from "../../controllers/AuthController";
import { UserProfile } from "../../models/User";

export default function ProfileScreen() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) { setProfile(null); router.replace("/login"); return; }
      try {
        const result = await loadProfile();
        if (active && auth.currentUser?.uid === user.uid) setProfile(result);
      } catch {
        if (active) setError("We could not load your profile. Please try again.");
      } finally {
        if (active) setLoading(false);
      }
    });
    return () => { active = false; unsubscribe(); };
  }, [retry]);

  const change = (key: "firstName" | "lastName" | "phone", value: string) => {
    setProfile(current => current ? { ...current, [key]: value } : null);
    setNotice(""); setError("");
  };
  const save = async () => {
    if (!profile || busy) return;
    setBusy(true); setError(""); setNotice("");
    try {
      const saved = await saveProfile(profile);
      if (auth.currentUser?.uid === saved.uid) {
        setProfile(saved); setNotice("Your profile has been saved.");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "";
      setError(message.startsWith("Please enter") || message.startsWith("Each name")
        ? message : "We could not save your profile. Please try again.");
    } finally { setBusy(false); }
  };
  const signOut = async () => {
    if (busy) return;
    setBusy(true); setError("");
    try { await logout(); router.replace("/login"); }
    catch { setError("We could not log you out. Please try again."); }
    finally { setBusy(false); }
  };

  return (
    <KeyboardAvoidingView style={styles.page} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Pressable onPress={() => router.replace("/dashboard")}><Text style={styles.link}>‹ Dashboard</Text></Pressable>
        <Text style={styles.title}>My Profile</Text>
        <Text style={styles.subtitle}>View and update your personal information.</Text>
        {loading ? <ActivityIndicator accessibilityLabel="Loading profile" color="#15803d" /> : (
          <View style={styles.card}>
            {profile && <>
              <Text style={styles.name}>{profile.displayName}</Text>
              <Text style={styles.label}>First name</Text>
              <TextInput accessibilityLabel="First name" style={styles.input} value={profile.firstName} onChangeText={value => change("firstName", value)} editable={!busy} maxLength={80} autoComplete="given-name" />
              <Text style={styles.label}>Last name</Text>
              <TextInput accessibilityLabel="Last name" style={styles.input} value={profile.lastName} onChangeText={value => change("lastName", value)} editable={!busy} maxLength={80} autoComplete="family-name" />
              <Text style={styles.label}>Email address</Text>
              <TextInput accessibilityLabel="Email address, read only" style={[styles.input, styles.readOnly]} value={profile.email} editable={false} />
              <Text style={styles.hint}>Your sign-in email cannot be changed here.</Text>
              <Text style={styles.label}>Phone number (optional)</Text>
              <TextInput accessibilityLabel="Phone number" style={styles.input} value={profile.phone} onChangeText={value => change("phone", value)} editable={!busy} keyboardType="phone-pad" maxLength={20} autoComplete="tel" />
            </>}
            {!!error && <Text accessibilityRole="alert" style={styles.error}>{error}</Text>}
            {!!notice && <Text accessibilityLiveRegion="polite" style={styles.success}>{notice}</Text>}
            {profile ? <Pressable accessibilityRole="button" disabled={busy} onPress={save} style={[styles.button, busy && styles.disabled]}><Text style={styles.buttonText}>{busy ? "Please wait…" : "Save Changes"}</Text></Pressable>
              : <Pressable onPress={() => setRetry(value => value + 1)} style={styles.button}><Text style={styles.buttonText}>Retry</Text></Pressable>}
            <Pressable accessibilityRole="button" disabled={busy} onPress={signOut} style={styles.logout}><Text style={styles.link}>Log Out</Text></Pressable>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#F4F8F5" },
  content: { padding: 24, width: "100%", maxWidth: 580, alignSelf: "center" },
  title: { fontSize: 30, fontWeight: "700", color: "#17231B", marginTop: 24 },
  subtitle: { color: "#66756B", marginTop: 8, marginBottom: 24, lineHeight: 22 },
  card: { padding: 24, borderRadius: 20, backgroundColor: "white" },
  name: { fontSize: 22, fontWeight: "600", color: "#17231B", marginBottom: 12 },
  label: { marginTop: 16, marginBottom: 8, color: "#17231B", fontWeight: "600" },
  input: { borderWidth: 1, borderColor: "#D7E2DA", borderRadius: 12, padding: 14, fontSize: 16, color: "#17231B" },
  readOnly: { backgroundColor: "#F4F8F5", color: "#66756B" },
  hint: { color: "#66756B", fontSize: 12, marginTop: 6 },
  button: { backgroundColor: "#15803d", padding: 16, borderRadius: 12, alignItems: "center", marginTop: 24 },
  buttonText: { color: "white", fontWeight: "700" },
  disabled: { opacity: 0.6 },
  link: { color: "#15803d", fontWeight: "600" },
  logout: { padding: 18, alignItems: "center" },
  error: { color: "#B91C1C", marginTop: 16, lineHeight: 22 },
  success: { color: "#15803d", marginTop: 16, lineHeight: 22 },
});
