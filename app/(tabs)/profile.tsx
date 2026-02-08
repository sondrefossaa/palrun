import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useThemeColor } from "@/hooks/use-theme-color";

/* ---------- TYPES ---------- */

type ProfileStats = {
  id: string;
  full_name: string;
  avatar_url: string;
  location: string;
  short_desc: string;
  long_description: string;
  age: number;
};

/* ---------- MAIN COMPONENT ---------- */

export default function Profile() {
  const { user } = useAuth();
  const [canEditDesc, setCanEditDesc] = useState(false);
  const [profileStats, setProfileStats] = useState<ProfileStats | null>(null);
  const styles = useDynamicStyles();

  useEffect(() => {
    const fetchProfileStats = async () => {
      try {
        if (!user?.id) return;
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();
        if (error) throw error;
        setProfileStats(data);
      } catch (error) {
        console.error("Supabase Error:", error);
      }
    };
    fetchProfileStats();
  }, [user?.id]);

  if (!profileStats) {
    return (
      <View
        style={[
          styles.safe,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color="#2D5A27" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        bounces={false}
      >
        {/* TOP GREEN HEADER SECTION */}
        <View style={styles.headerBackground}>
          <SafeAreaView>
            <View style={styles.headerTopActions}>
              <TouchableOpacity style={styles.iconButton}>
                <AntDesign name="setting" size={22} color="white" />
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </View>

        {/* OVERLAPPING AVATAR */}
        <View style={styles.avatarWrapper}>
          <Image
            source={{
              uri: profileStats.avatar_url || "https://via.placeholder.com/150",
            }}
            style={styles.avatar}
          />
        </View>

        {/* MAIN PROFILE CONTENT */}
        <View style={styles.mainContainer}>
          <Text style={styles.name}>{profileStats.full_name}</Text>
          <Text style={styles.shortDesc}>{profileStats.short_desc}</Text>

          {/* RUNNING VIBE TAGS */}
          {/*<View style={styles.tagContainer}>
            <VibeTag label="Chill" />
            <VibeTag label="Social" />
            <VibeTag label="Morning" />
          </View>*/}

          {/* STATS CARD */}
          <View style={styles.statsCard}>
            <StatColumn label="Location" value={profileStats.location} />
            <View style={styles.verticalDivider} />
            <StatColumn
              label="Age"
              value={profileStats.age?.toString() || "--"}
            />
            <View style={styles.verticalDivider} />
            <StatColumn label="Runs" value="42" />
          </View>

          {/* ABOUT SECTION */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>About me</Text>
              <TouchableOpacity onPress={() => setCanEditDesc(!canEditDesc)}>
                <AntDesign name="edit" size={18} color="#9CA3AF" />
              </TouchableOpacity>
            </View>

            <TextInput
              style={[styles.aboutInput, canEditDesc && styles.editingInput]}
              editable={canEditDesc}
              multiline
              placeholder="Tell others about your running style..."
              placeholderTextColor="#9CA3AF"
              value={profileStats.long_description}
              onChangeText={(text) =>
                setProfileStats({ ...profileStats, long_description: text })
              }
              scrollEnabled={false}
            />
          </View>

          {/* RECENT ACTIVITY PLACEHOLDER */}
          <View style={[styles.card, { marginBottom: 40 }]}>
            <Text style={styles.cardTitle}>Last Social Run</Text>
            <Text style={[styles.mutedText, { marginTop: 8 }]}>
              5km Loop with Alex • Tuesday Morning
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

/* ---------- HELPER COMPONENTS ---------- */

function VibeTag({ label }: { label: string }) {
  const styles = useDynamicStyles();
  return (
    <View style={styles.vibeTag}>
      <Text style={styles.vibeTagText}>{label}</Text>
    </View>
  );
}

function StatColumn({ label, value }: { label: string; value: string }) {
  const styles = useDynamicStyles();
  return (
    <View style={styles.statColumn}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

/* ---------- STYLES ---------- */

function useDynamicStyles() {
  const brandGreen = "#2D5A27"; // Deep, sporty green
  const lightBg = "#F9FAFB"; // Clean off-white/gray
  const surface = "#FFFFFF"; // Pure white for cards
  const textMain = "#111827";
  const textMuted = "#6B7280";

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: lightBg,
    },
    safe: {
      flex: 1,
    },
    scroll: {
      flex: 1,
    },
    scrollContent: {
      paddingBottom: 40,
    },
    headerBackground: {
      backgroundColor: brandGreen,
      height: 160,
      width: "100%",
    },
    headerTopActions: {
      flexDirection: "row",
      justifyContent: "flex-end",
      paddingHorizontal: 20,
      paddingTop: 10,
    },
    iconButton: {
      padding: 8,
      backgroundColor: "rgba(255,255,255,0.15)",
      borderRadius: 20,
    },
    avatarWrapper: {
      alignItems: "center",
      marginTop: -60, // The 50% overlap logic
      zIndex: 10,
    },
    avatar: {
      width: 120,
      height: 120,
      borderRadius: 60,
      borderWidth: 6,
      borderColor: lightBg, // Matches the page background
      backgroundColor: surface,
    },
    mainContainer: {
      paddingHorizontal: 24,
      paddingTop: 16,
      alignItems: "center",
    },
    name: {
      fontSize: 26,
      fontWeight: "700",
      color: textMain,
      letterSpacing: -0.5,
    },
    shortDesc: {
      fontSize: 16,
      color: textMuted,
      marginTop: 4,
      textAlign: "center",
    },
    tagContainer: {
      flexDirection: "row",
      gap: 8,
      marginTop: 16,
    },
    vibeTag: {
      backgroundColor: "#E8F0E6",
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 20,
    },
    vibeTagText: {
      color: brandGreen,
      fontSize: 13,
      fontWeight: "600",
    },
    statsCard: {
      flexDirection: "row",
      backgroundColor: surface,
      borderRadius: 24,
      paddingVertical: 20,
      marginTop: 24,
      width: "100%",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.05,
      shadowRadius: 12,
      elevation: 3,
    },
    statColumn: {
      flex: 1,
      alignItems: "center",
    },
    statValue: {
      fontSize: 18,
      fontWeight: "700",
      color: brandGreen,
    },
    statLabel: {
      fontSize: 11,
      color: textMuted,
      textTransform: "uppercase",
      letterSpacing: 0.8,
      marginTop: 2,
    },
    verticalDivider: {
      width: 1,
      height: "100%",
      backgroundColor: "#F3F4F6",
    },
    card: {
      backgroundColor: surface,
      borderRadius: 24,
      padding: 20,
      marginTop: 16,
      width: "100%",
    },
    cardHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 12,
    },
    cardTitle: {
      fontSize: 17,
      fontWeight: "700",
      color: textMain,
    },
    aboutInput: {
      fontSize: 15,
      color: "#374151",
      lineHeight: 22,
      minHeight: 80,
      textAlignVertical: "top",
    },
    editingInput: {
      backgroundColor: "#FBFBFB",
      borderRadius: 12,
      padding: 12,
      borderWidth: 1,
      borderColor: "#E5E7EB",
    },
    mutedText: {
      fontSize: 14,
      color: textMuted,
    },
  });
}
