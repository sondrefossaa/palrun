// app/login.tsx
import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { router } from "expo-router";
import { getStoredMockSession, mockLogin } from "@/lib/mockAuth";

export default function LoginScreen() {
  const [email, setEmail] = useState("test@example.com");
  const [password, setPassword] = useState("password123");
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        const session = await getStoredMockSession();
        if (session) {
          router.replace("/(tabs)/profile");
          return;
        }
      } finally {
        if (isMounted) {
          setCheckingSession(false);
        }
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleLogin = async () => {
    try {
      setStatusMessage("");
      setLoading(true);
      await mockLogin(email, password);
      router.replace("/(tabs)/profile");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to log in.";
      setStatusMessage(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mock Login</Text>
      <Text style={styles.subtitle}>
        Auth is mocked for development. Use any email/password combo.
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        editable={!loading && !checkingSession}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        editable={!loading && !checkingSession}
      />
      {checkingSession && (
        <Text style={styles.status}>Restoring session...</Text>
      )}
      {statusMessage.length > 0 && (
        <Text style={[styles.status, styles.statusError]}>{statusMessage}</Text>
      )}
      <Button
        title={loading ? "Logging in..." : "Login"}
        onPress={handleLogin}
        disabled={loading || checkingSession}
      />
      <Button
        title="Go to Register"
        onPress={() => router.push("/register")}
        disabled={loading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 14,
    color: "#555",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
  },
  status: {
    fontSize: 14,
    marginBottom: 10,
    color: "#555",
  },
  statusError: {
    color: "#D9534F",
  },
});
