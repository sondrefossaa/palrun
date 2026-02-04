import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import { getStoredMockSession, mockRegister } from "@/lib/mockAuth";

export default function RegisterScreen() {
  const [email, setEmail] = useState("runner@example.com");
  const [password, setPassword] = useState("password123");
  const [username, setUsername] = useState("Trail Blazer");
  const [website, setWebsite] = useState("https://palrun.dev");
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    let active = true;

    (async () => {
      const existing = await getStoredMockSession();
      if (existing && active) {
        router.replace("/(tabs)/profile");
        return;
      }
      if (active) setCheckingSession(false);
    })();

    return () => {
      active = false;
    };
  }, []);

  const handleRegister = async () => {
    try {
      setStatusMessage("");
      setLoading(true);
      await mockRegister(email, password, {
        username,
        website,
      });
      router.replace("/(tabs)/profile");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Something went wrong.";
      setStatusMessage(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Mock Registration</Text>
      <Text style={styles.subtitle}>
        Real email verification is disabled. Create a mock account to preview
        the profile flow.
      </Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Login details</Text>
        <TextInput
          style={styles.input}
          placeholder="Email address"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          editable={!loading && !checkingSession}
        />
        <TextInput
          style={styles.input}
          placeholder="Password (min 6 chars)"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          editable={!loading && !checkingSession}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Profile preview</Text>
        <TextInput
          style={styles.input}
          placeholder="Display name"
          value={username}
          onChangeText={setUsername}
          editable={!loading && !checkingSession}
        />
        <TextInput
          style={styles.input}
          placeholder="Website"
          value={website}
          onChangeText={setWebsite}
          autoCapitalize="none"
          editable={!loading && !checkingSession}
        />
      </View>

      {checkingSession && (
        <Text style={styles.status}>Checking existing session...</Text>
      )}
      {statusMessage.length > 0 && (
        <Text style={[styles.status, styles.error]}>{statusMessage}</Text>
      )}

      <Button
        title={loading ? "Creating account..." : "Create mock account"}
        onPress={handleRegister}
        disabled={loading || checkingSession}
      />
      <View style={styles.helperRow}>
        <Text style={styles.helperText}>Already have a mock account?</Text>
        <Button
          title="Go to login"
          onPress={() => router.push("/login")}
          disabled={loading}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    justifyContent: "center",
    backgroundColor: "#f5f6fa",
    gap: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
    color: "#111",
  },
  subtitle: {
    fontSize: 15,
    color: "#555",
    textAlign: "center",
  },
  section: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#222",
  },
  input: {
    borderWidth: 1,
    borderColor: "#dedede",
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    backgroundColor: "#fafafa",
  },
  status: {
    textAlign: "center",
    fontSize: 14,
    color: "#444",
  },
  error: {
    color: "#c53030",
  },
  helperRow: {
    marginTop: 12,
    alignItems: "center",
    gap: 8,
  },
  helperText: {
    color: "#555",
    fontSize: 14,
  },
});
