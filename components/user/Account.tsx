import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import {
  StyleSheet,
  View,
  Alert,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { Session } from "@supabase/supabase-js";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

export default function Account({ session }: { session: Session }) {
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [website, setWebsite] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  useEffect(() => {
    if (session) getProfile();
  }, [session]);

  async function getProfile() {
    try {
      setLoading(true);
      if (!session?.user) throw new Error("No user on the session!");

      const { data, error, status } = await supabase
        .from("profiles")
        .select(`username, website, avatar_url`)
        .eq("id", session?.user.id)
        .single();
      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setUsername(data.username);
        setWebsite(data.website);
        setAvatarUrl(data.avatar_url);
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert("Error", error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile({
    username,
    website,
    avatar_url,
  }: {
    username: string;
    website: string;
    avatar_url: string;
  }) {
    try {
      setLoading(true);
      if (!session?.user) throw new Error("No user on the session!");

      const updates = {
        id: session?.user.id,
        username,
        website,
        avatar_url,
        updated_at: new Date(),
      };

      const { error } = await supabase.from("profiles").upsert(updates);

      if (error) {
        throw error;
      }
      Alert.alert("Success", "Profile updated successfully!");
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert("Error", error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  if (loading && !username) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Account Settings</Text>
        <Text style={styles.subtitle}>Manage your profile information</Text>
      </View>

      <View style={styles.card}>
        {/* Email (Read-only) */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Email</Text>
          <View style={styles.readOnlyField}>
            <Text style={styles.readOnlyText}>
              {session?.user?.email || "No email"}
            </Text>
          </View>
          <Text style={styles.helperText}>Email cannot be changed</Text>
        </View>

        {/* Username */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Username</Text>
          <TextInput
            style={styles.input}
            value={username || ""}
            onChangeText={setUsername}
            placeholder="Enter your username"
            placeholderTextColor="#999"
            editable={!loading}
          />
        </View>

        {/* Website */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Website</Text>
          <TextInput
            style={styles.input}
            value={website || ""}
            onChangeText={setWebsite}
            placeholder="https://example.com"
            placeholderTextColor="#999"
            keyboardType="url"
            autoCapitalize="none"
            editable={!loading}
          />
        </View>

        {/* Avatar URL (Optional) */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Avatar URL (Optional)</Text>
          <TextInput
            style={styles.input}
            value={avatarUrl || ""}
            onChangeText={setAvatarUrl}
            placeholder="https://example.com/avatar.jpg"
            placeholderTextColor="#999"
            keyboardType="url"
            autoCapitalize="none"
            editable={!loading}
          />
          <Text style={styles.helperText}>Link to your profile picture</Text>
        </View>

        {/* Update Button */}
        <TouchableOpacity
          style={[styles.button, styles.primaryButton]}
          onPress={() =>
            updateProfile({ username, website, avatar_url: avatarUrl })
          }
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Update Profile</Text>
          )}
        </TouchableOpacity>

        {/* Sign Out Button */}
        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={async () => {
            try {
              // Sign out of Google
              await GoogleSignin.signOut();

              // Sign out of Supabase
              await supabase.auth.signOut();

              console.log("Signed out successfully");
            } catch (error) {
              console.error("Sign out error:", error);
            }
          }}
          disabled={loading}
        >
          <Text style={styles.secondaryButtonText}>Sign Out</Text>
        </TouchableOpacity>

        {/* User ID Info */}
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Account Information</Text>
          <Text style={styles.infoText}>
            User ID: {session?.user?.id?.substring(0, 8)}...
          </Text>
          <Text style={styles.infoText}>
            Last login:{" "}
            {new Date(
              session?.user?.last_sign_in_at || Date.now(),
            ).toLocaleDateString()}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#666",
  },
  header: {
    padding: 24,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
  },
  card: {
    margin: 16,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#f8f9fa",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
    color: "#333",
  },
  readOnlyField: {
    backgroundColor: "#f0f0f0",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 14,
  },
  readOnlyText: {
    fontSize: 16,
    color: "#666",
  },
  helperText: {
    fontSize: 13,
    color: "#888",
    marginTop: 4,
  },
  button: {
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  primaryButton: {
    backgroundColor: "#007AFF",
    marginTop: 10,
  },
  secondaryButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#007AFF",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButtonText: {
    color: "#007AFF",
    fontSize: 16,
    fontWeight: "600",
  },
  infoBox: {
    marginTop: 24,
    padding: 16,
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#007AFF",
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
});
