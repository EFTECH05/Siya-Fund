import { Link } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
} from "react-native";

export default function ContributionsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Contributions</Text>

      <Text style={styles.description}>
        Record a new contribution or view your previous contributions.
      </Text>

      <Link href="/contributions/create" asChild>
        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>
            Record a Contribution
          </Text>
        </Pressable>
      </Link>

      <Link href={"/contributions/history" as any} asChild>
        <Pressable style={styles.historyButton}>
          <Text style={styles.buttonText}>
            View Contribution History
          </Text>
        </Pressable>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#FFFFFF",
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
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 14,
  },
  historyButton: {
    backgroundColor: "#40916C",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});