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
import { useRouter } from "expo-router";

/* ---------- TYPES ---------- */

type ProfileStats = {
  id: string;
  full_name: string;
  avatar_url: string;
  location: string;
  short_desc: string;
  long_desc: string;
  age: number;
};

/* ---------- MAIN COMPONENT ---------- */

export default function Profile() {
  const { user } = useAuth();
  const [canEditDesc, setCanEditDesc] = useState(false);
  const [profileStats, setProfileStats] = useState<ProfileStats | null>(null);
  const styles = useDynamicStyles();
  const router = useRouter();

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
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => router.push("/settings")}
              >
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
            <Text style={styles.aboutInput}>
              {profileStats.long_desc || "Edit about text in settings"}
            </Text>
          </View>
        </View>
      </ScrollView>
      {/*EDIT AND LOGOUT BUTTON  */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={styles.editProfileButton}
          onPress={() => router.push("/settings")}
        >
          <Text style={styles.bottomText}>Edit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

/* ---------- HELPER COMPONENTS ---------- */

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
  const brandGreen = "#DA7756";
  const lightBg = "#F7F7F7";
  const surface = "#FFFFFF";
  const textMain = "#1A1A1A";
  const textMuted = "#6B7280";
  const badRed = "red";
  return StyleSheet.create({
    bottomText: {
      color: surface,
      fontSize: 16,
      fontWeight: "bold",
      textAlign: "center",
    },
    bottomContainer: {
      paddingHorizontal: 24,
      position: "absolute",
      bottom: 10,
      flexDirection: "row",
      justifyContent: "space-between",
    },
    editProfileButton: {
      flex: 1,
      backgroundColor: brandGreen,
      borderRadius: 8,
      padding: 25,
    },
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
      height: 80,
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
      backgroundColor: "gray",
      borderRadius: 20,
      position: "absolute",
      top: 10,
      right: 20,
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

    statsCard: {
      flexDirection: "row",
      backgroundColor: lightBg,
      borderRadius: 24,
      paddingVertical: 20,
      marginTop: 24,
      width: "100%",
    },
    statColumn: {
      flex: 1,
      alignItems: "center",
    },
    statValue: {
      fontSize: 18,
      fontWeight: "700",
      color: "666B6A",
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
    mutedText: {
      fontSize: 14,
      color: textMuted,
    },
  });
}
