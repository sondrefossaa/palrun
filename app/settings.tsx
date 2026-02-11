import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system/legacy";
import * as ImageManipulator from "expo-image-manipulator";

/* ---------- TYPES ---------- */

type ProfileRecord = {
  id: string;
  full_name: string;
  avatar_url: string;
  location: string;
  short_desc: string;
  long_desc: string;
  age: number | null;
};

/* ---------- COMPONENT ---------- */

export default function SettingsScreen() {
  const { user } = useAuth();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [fullName, setFullName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [location, setLocation] = useState("");
  const [shortDesc, setShortDesc] = useState("");
  const [longDescription, setLongDescription] = useState("");
  const [ageInput, setAgeInput] = useState("");

  const styles = useMemo(() => createStyles(), []);

  /* ---------- DATA FETCH ---------- */

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.id) return;
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Profile fetch error:", error);
        setError("Failed to load profile");
      } else if (data) {
        const profile = data as ProfileRecord;
        setFullName(profile.full_name ?? "");
        setAvatarUrl(profile.avatar_url ?? "");
        setLocation(profile.location ?? "");
        setShortDesc(profile.short_desc ?? "");
        setLongDescription(profile.long_desc ?? "");
        setAgeInput(
          profile.age === null || profile.age === undefined
            ? ""
            : profile.age.toString(),
        );
      }
      setLoading(false);
    };

    fetchProfile();
  }, [user?.id]);

  /* ---------- IMAGE PICKER & UPLOAD ---------- */

  const pickAndUploadImage = async () => {
    if (!user?.id) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
        base64: false,
      });

      if (result.canceled || result.assets.length === 0) return;

      const localUri = result.assets[0].uri;

      // convert to JPEG to avoid format issues
      const manipResult = await ImageManipulator.manipulateAsync(localUri, [], {
        compress: 0.7,
        format: ImageManipulator.SaveFormat.JPEG,
      });

      const supabasePath = `avatars/${user.id}-${Date.now()}.jpg`;

      // delete old avatar if exists
      const oldFilename = supabasePath;
      await supabase.storage.from("avatars").remove([oldFilename]);

      // read file as base64
      const base64 = await FileSystem.readAsStringAsync(manipResult.uri, {
        encoding: "base64",
      });

      const fileData = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(supabasePath, fileData, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(supabasePath);

      const baseUrl = publicUrlData.publicUrl;
      const newAvatarUrl = baseUrl;

      // Update the avatar_url in state
      setAvatarUrl(newAvatarUrl);

      // Update the avatar_url in the database
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: newAvatarUrl })
        .eq("id", user.id);

      if (updateError) throw updateError;

      Alert.alert("Success", "Avatar updated successfully!");
    } catch (err) {
      console.error("Image upload failed:", err);
      Alert.alert("Upload failed", "Could not upload image. Try again.");
    }
  };

  /* ---------- SAVE ---------- */

  const handleSave = async () => {
    if (!user?.id) return;
    const parsedAge =
      ageInput.trim() === "" ? null : Number.parseInt(ageInput, 10);
    if (parsedAge !== null && Number.isNaN(parsedAge)) {
      Alert.alert("Invalid age", "Please enter a valid number.");
      return;
    }

    setSaving(true);
    setError(null);

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: fullName.trim(),
        avatar_url: avatarUrl.trim(),
        location: location.trim(),
        short_desc: shortDesc.trim(),
        long_desc: longDescription.trim(),
        age: parsedAge,
      })
      .eq("id", user.id);

    setSaving(false);

    if (error) {
      console.error("Profile update error:", error);
      setError("Failed to save changes");
      Alert.alert("Save failed", error.message ?? "Please try again.");
      return;
    }

    Alert.alert("Saved", "Your profile has been updated.", [
      { text: "OK", onPress: () => router.back() },
    ]);
  };

  /* ---------- RENDER ---------- */

  if (loading) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color="#DA7756" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView contentContainerStyle={styles.content} bounces={false}>
          <View style={styles.headerRow}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
            <Text style={styles.header}>Profile Settings</Text>
          </View>

          <View style={styles.card}>
            {error ? <Text style={styles.error}>{error}</Text> : null}

            {/* AVATAR */}
            <Text style={styles.inputLabel}>Avatar</Text>
            <TouchableOpacity
              onPress={pickAndUploadImage}
              style={styles.avatarPicker}
            >
              {avatarUrl ? (
                <Image source={{ uri: avatarUrl }} style={styles.avatar} />
              ) : (
                <Text style={styles.avatarPlaceholderText}>
                  Tap to select image
                </Text>
              )}
            </TouchableOpacity>

            <Input
              label="Full Name"
              value={fullName}
              onChangeText={setFullName}
              placeholder="Your full name"
            />

            <Input
              label="Location"
              value={location}
              onChangeText={setLocation}
              placeholder="City, Country"
            />

            <Input
              label="Short Description"
              value={shortDesc}
              onChangeText={setShortDesc}
              placeholder="A short tagline"
              maxLength={80}
            />

            <Input
              label="Long Description"
              value={longDescription}
              onChangeText={setLongDescription}
              placeholder="Tell others about yourself"
              multiline
              numberOfLines={4}
              style={{ minHeight: 120, textAlignVertical: "top" }}
            />

            <Input
              label="Age"
              value={ageInput}
              onChangeText={setAgeInput}
              placeholder="Age"
              keyboardType="numeric"
            />

            <TouchableOpacity
              style={[styles.saveButton, saving && styles.saveButtonDisabled]}
              onPress={handleSave}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.saveButtonText}>Save changes</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

/* ---------- INPUT COMPONENT ---------- */

type InputProps = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  keyboardType?: "default" | "numeric" | "email-address" | "url";
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  maxLength?: number;
  multiline?: boolean;
  numberOfLines?: number;
  style?: object;
};

function Input({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType,
  autoCapitalize,
  maxLength,
  multiline,
  numberOfLines,
  style,
}: InputProps) {
  const styles = useMemo(() => createStyles(), []);
  return (
    <View style={styles.inputGroup}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        style={[styles.input, multiline ? styles.inputMultiline : null, style]}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        maxLength={maxLength}
        multiline={multiline}
        numberOfLines={numberOfLines}
      />
    </View>
  );
}

/* ---------- STYLES ---------- */

function createStyles() {
  const brand = "#DA7756";
  const bg = "#F7F7F7";
  const surface = "#FFFFFF";
  const text = "#111827";
  const muted = "rgba(17, 24, 39, 0.7)";
  const danger = "#DC2626";
  const border = "#E5E7EB";

  return StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: brand },
    centered: { flex: 1, justifyContent: "center", alignItems: "center" },
    content: { padding: 20, paddingBottom: 40, backgroundColor: brand },
    headerRow: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
    backButton: { paddingVertical: 8, paddingRight: 12, paddingLeft: 0 },
    backButtonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "600" },
    header: {
      fontSize: 24,
      fontWeight: "700",
      color: "#FFFFFF",
      marginBottom: 0,
    },
    card: {
      backgroundColor: bg,
      borderTopLeftRadius: 32,
      borderTopRightRadius: 32,
      paddingHorizontal: 20,
      paddingVertical: 24,
    },
    error: { color: danger, marginBottom: 12 },
    inputGroup: { marginBottom: 14 },
    inputLabel: { fontSize: 14, color: muted, marginBottom: 6 },
    input: {
      backgroundColor: surface,
      borderWidth: 1,
      borderColor: border,
      borderRadius: 12,
      paddingHorizontal: 14,
      paddingVertical: 12,
      fontSize: 16,
      color: text,
    },
    inputMultiline: { minHeight: 100 },
    saveButton: {
      marginTop: 10,
      backgroundColor: brand,
      borderRadius: 14,
      paddingVertical: 16,
      alignItems: "center",
      justifyContent: "center",
    },
    saveButtonDisabled: { opacity: 0.7 },
    saveButtonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "600" },

    avatarPicker: {
      height: 100,
      width: 100,
      borderRadius: 50,
      backgroundColor: "#E5E7EB",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 16,
      alignSelf: "center",
      overflow: "hidden",
    },
    avatar: { width: "100%", height: "100%" },
    avatarPlaceholderText: { color: "#6B7280" },
  });
}
