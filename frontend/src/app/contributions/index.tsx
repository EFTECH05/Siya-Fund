import { useRouter } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
} from "react-native";

export default function ContributionsScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>My Contributions</Text>

        <Text style={styles.description}>
          Record a new contribution or view your previous contributions.
        </Text>

        <Pressable
          style={({ pressed }) => [styles.button, pressed && styles.pressed]}
          onPress={() => router.push("/contributions/create" as any)}
          hitSlop={8}
        >
          <Text style={styles.buttonText}>Record a Contribution</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.historyButton,
            pressed && styles.pressed,
          ]}
          onPress={() => router.push("/contributions/history" as any)}
          hitSlop={8}
        >
          <Text style={styles.buttonText}>View Contribution History</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#F4F8F5",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: "#D5DED8",
    elevation: 3,
    shadowColor: "#000000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#1B4332",
  },
  description: {
    fontSize: 16,
    color: "#555555",
    marginBottom: 28,
    lineHeight: 24,
  },
  button: {
    backgroundColor: "#2D6A4F",
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 14,
  },
  historyButton: {
    backgroundColor: "#40916C",
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderRadius: 12,
    alignItems: "center",
  },
  pressed: {
    opacity: 0.85,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});