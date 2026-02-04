import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { router } from "expo-router";
import { Session } from "@supabase/supabase-js";

import Account from "@/components/user/Account";
import Auth from "@/components/user/Auth";
import { supabase } from "@/lib/supabase";
import {
  DEFAULT_PROFILE,
  getProfile,
  getStoredMockSession,
  MockProfile,
  MockSession,
  mockSignOut,
  mockUpdateProfile,
} from "@/lib/mockAuth";

export default function ProfileScreen() {
  const [supabaseSession, setSupabaseSession] = useState<Session | null>(null);

  const [mockSession, setMockSession] = useState<MockSession | null>(null);
  const [mockProfile, setMockProfile] = useState<MockProfile>(DEFAULT_PROFILE);
  const [loadingMockProfile, setLoadingMockProfile] = useState(true);
  const [savingMockProfile, setSavingMockProfile] = useState(false);
  const [authMode, setAuthMode] = useState<"real" | "mock">("mock");
  const [hasPickedAuthMode, setHasPickedAuthMode] = useState(false);

  const refreshMockState = useCallback(async () => {
    setLoadingMockProfile(true);
    try {
      const session = await getStoredMockSession();
      setMockSession(session);

      if (session) {
        const profile = (await getProfile(session.user.id)) ?? DEFAULT_PROFILE;
        setMockProfile(profile);
      } else {
        setMockProfile(DEFAULT_PROFILE);
      }
    } finally {
      setLoadingMockProfile(false);
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (mounted) setSupabaseSession(data.session ?? null);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (mounted) setSupabaseSession(session);
      },
    );

    return () => {
      mounted = false;
      authListener?.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    refreshMockState();
  }, [refreshMockState]);

  useEffect(() => {
    if (hasPickedAuthMode) return;

    if (supabaseSession) {
      setAuthMode("real");
    } else if (mockSession) {
      setAuthMode("mock");
    }
  }, [supabaseSession, mockSession, hasPickedAuthMode]);

  const updateMockField = (field: keyof MockProfile, value: string) => {
    setMockProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleMockSave = async () => {
    if (!mockSession) return;

    setSavingMockProfile(true);
    try {
      const updated = await mockUpdateProfile(mockSession, mockProfile);
      setMockProfile(updated);
    } finally {
      setSavingMockProfile(false);
    }
  };

  const handleMockSignOut = async () => {
    await mockSignOut();
    await refreshMockState();
  };

  const handleModeChange = (mode: "real" | "mock") => {
    setAuthMode(mode);
    setHasPickedAuthMode(true);
  };

  const hasSupabaseSession = Boolean(supabaseSession?.user);
  const hasMockSession = Boolean(mockSession?.user);

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.modeSwitcher}>
        <TouchableOpacity
          style={[
            styles.modeOption,
            authMode === "real" && styles.modeOptionActive,
          ]}
          onPress={() => handleModeChange("real")}
        >
          <Text
            style={[
              styles.modeOptionText,
              authMode === "real" && styles.modeOptionTextActive,
            ]}
          >
            Real auth
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.modeOption,
            authMode === "mock" && styles.modeOptionActive,
          ]}
          onPress={() => handleModeChange("mock")}
        >
          <Text
            style={[
              styles.modeOptionText,
              authMode === "mock" && styles.modeOptionTextActive,
            ]}
          >
            Mock auth
          </Text>
        </TouchableOpacity>
      </View>

      {authMode === "real" &&
        (hasSupabaseSession ? (
          <View style={styles.card}>
            <Text style={styles.heading}>Supabase profile</Text>
            <Text style={styles.description}>
              This account is synced with the real backend.
            </Text>
            <Account
              key={supabaseSession!.user.id}
              session={supabaseSession!}
            />
          </View>
        ) : (
          <View style={styles.card}>
            <Text style={styles.heading}>Supabase sign in</Text>
            <Text style={styles.description}>
              Have real credentials? Sign in below to sync with Supabase.
            </Text>
            <Auth />
          </View>
        ))}

      {authMode === "mock" &&
        (hasMockSession ? (
          <View style={styles.card}>
            <Text style={styles.heading}>Mock profile</Text>
            <Text style={styles.description}>
              This account lives only on your device. Use it to explore the
              profile flow without hitting real Supabase auth.
            </Text>

            <View style={styles.fieldBlock}>
              <Text style={styles.label}>Email</Text>
              <View style={styles.readOnlyField}>
                <Text style={styles.readOnlyText}>
                  {mockSession?.user.email ?? "unknown"}
                </Text>
              </View>
            </View>

            <View style={styles.fieldBlock}>
              <Text style={styles.label}>Display name</Text>
              <TextInput
                style={styles.input}
                placeholder="Trail lover"
                value={mockProfile.username}
                onChangeText={(value) => updateMockField("username", value)}
                editable={!loadingMockProfile && !savingMockProfile}
              />
            </View>

            <View style={styles.fieldBlock}>
              <Text style={styles.label}>Website</Text>
              <TextInput
                style={styles.input}
                placeholder="https://example.com"
                autoCapitalize="none"
                value={mockProfile.website}
                onChangeText={(value) => updateMockField("website", value)}
                editable={!loadingMockProfile && !savingMockProfile}
              />
            </View>

            <View style={styles.fieldBlock}>
              <Text style={styles.label}>Avatar URL (optional)</Text>
              <TextInput
                style={styles.input}
                placeholder="https://images.com/avatar.png"
                autoCapitalize="none"
                value={mockProfile.avatar_url ?? ""}
                onChangeText={(value) => updateMockField("avatar_url", value)}
                editable={!loadingMockProfile && !savingMockProfile}
              />
            </View>

            {loadingMockProfile ? (
              <View style={styles.loadingRow}>
                <ActivityIndicator color="#007AFF" />
                <Text style={styles.loadingText}>Loading profile…</Text>
              </View>
            ) : (
              <>
                <TouchableOpacity
                  style={[
                    styles.button,
                    styles.primaryButton,
                    (savingMockProfile || loadingMockProfile) &&
                      styles.disabled,
                  ]}
                  onPress={handleMockSave}
                  disabled={savingMockProfile || loadingMockProfile}
                >
                  {savingMockProfile ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.primaryButtonText}>Save changes</Text>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.button, styles.secondaryButton]}
                  onPress={handleMockSignOut}
                >
                  <Text style={styles.secondaryButtonText}>Sign out</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.heading}>No profile yet</Text>
            <Text style={styles.description}>
              Create a mock account to explore the profile screen, or sign in
              with Supabase if you have real credentials.
            </Text>

            <TouchableOpacity
              style={[styles.button, styles.primaryButton]}
              onPress={() => router.push("/register")}
            >
              <Text style={styles.primaryButtonText}>Create mock account</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.secondaryButton]}
              onPress={() => router.push("/login")}
            >
              <Text style={styles.secondaryButtonText}>I already have one</Text>
            </TouchableOpacity>
          </View>
        ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    gap: 20,
    backgroundColor: "#f6f7fb",
  },
  modeSwitcher: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 8,
  },
  modeOption: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#d0d5dd",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  modeOptionActive: {
    borderColor: "#007AFF",
    backgroundColor: "#e8f1ff",
  },
  modeOptionText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#5c5c5c",
  },
  modeOptionTextActive: {
    color: "#007AFF",
  },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 16,
    gap: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 4,
  },
  heading: {
    fontSize: 22,
    fontWeight: "600",
    color: "#111",
  },
  description: {
    fontSize: 15,
    color: "#5c5c5c",
  },
  fieldBlock: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#dcdfe6",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: "#fafafa",
    color: "#111",
  },
  readOnlyField: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: "#f1f2f6",
  },
  readOnlyText: {
    fontSize: 16,
    color: "#555",
  },
  button: {
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  primaryButton: {
    backgroundColor: "#007AFF",
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: "#007AFF",
  },
  secondaryButtonText: {
    color: "#007AFF",
    fontSize: 16,
    fontWeight: "600",
  },
  disabled: {
    opacity: 0.7,
  },
  loadingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  loadingText: {
    color: "#555",
    fontSize: 14,
  },
  emptyState: {
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 16,
    gap: 16,
    alignItems: "stretch",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
});
