import React, { useCallback, useEffect, useState } from "react";
import {
  Text,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StatusBar,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { useFocusEffect } from "@react-navigation/native";

import AntDesign from "@expo/vector-icons/AntDesign";
import { useRouter } from "expo-router";

/* ---------- CONSTANTS ---------- */

const { width } = Dimensions.get("window");

const AVATAR_SIZE = 160;
const BUBBLE_SIZE = 100;
const ARC_RADIUS = 110; // unchanged

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
  const [profileStats, setProfileStats] = useState<ProfileStats | null>(null);
  const styles = useDynamicStyles();
  const router = useRouter();

  const fetchProfileStats = useCallback(async () => {
    if (!user?.id) return;

    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (data) {
      setProfileStats(data as ProfileStats);
    }
  }, [user?.id]);

  useEffect(() => {
    if (!user?.id) return;
    fetchProfileStats();
  }, [fetchProfileStats, user?.id]);

  useFocusEffect(
    useCallback(() => {
      fetchProfileStats();
    }, [fetchProfileStats]),
  );

  if (!profileStats) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#DA7756" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />

      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        {/* HEADER */}
        <View style={styles.headerBackground}>
          <SafeAreaView edges={["top"]}>
            <View style={styles.headerTopActions}>
              <View style={styles.headerTextContainer}>
                <Text style={styles.headerName}>{profileStats.full_name}</Text>
                <Text style={styles.shortDesc}>{profileStats.short_desc}</Text>
              </View>

              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => router.push("/settings")}
              >
                <AntDesign name="setting" size={22} color="white" />
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </View>

        {/* PROFILE SECTION */}
        <View style={styles.profileSection}>
          <Image
            key={profileStats.avatar_url}
            source={{
              uri: profileStats.avatar_url || "https://via.placeholder.com/150",
            }}
            style={styles.avatar}
          />

          {/* ARC STAT BUBBLES */}
          <View style={styles.arcContainer}>
            <StatBubble
              label="Location"
              value={profileStats.location}
              style={{
                transform: [{ translateX: -ARC_RADIUS }, { translateY: 25 }],
              }}
            />

            <StatBubble
              label="Age"
              value={profileStats.age?.toString() || "--"}
              style={{
                transform: [{ translateY: 55 }],
              }}
            />

            <StatBubble
              label="Runs"
              value="42"
              style={{
                transform: [{ translateX: ARC_RADIUS }, { translateY: 25 }],
              }}
            />
          </View>
        </View>

        {/* CONTENT */}
        <View style={styles.mainContainer}>
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.aboutHeader}>About me</Text>
              <AntDesign name="idcard" size={18} color="#DA7756" />
            </View>

            <Text style={styles.aboutText}>
              {profileStats.long_desc || "Edit about text in settings"}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

/* ---------- STAT BUBBLE ---------- */

function StatBubble({
  label,
  value,
  style,
}: {
  label: string;
  value: string;
  style?: any;
}) {
  const styles = useDynamicStyles();

  return (
    <View style={[styles.statBubble, style]}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

/* ---------- STYLES ---------- */

function useDynamicStyles() {
  // Old color #DA7756
  const brandGreen = "#ee6e3b";
  const lightBg = "#F7F7F7";
  const surface = "#FFFFFF";
  const textMain = "#1A1A1A";

  return StyleSheet.create({
    cardHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 12,
    },

    aboutHeader: {
      fontSize: 18,
      fontWeight: "700",
      color: "#1A1A1A",
    },

    container: {
      flex: 1,
      backgroundColor: lightBg,
    },

    loader: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },

    /* HEADER */
    headerBackground: {
      height: 160,
      backgroundColor: brandGreen,
    },

    headerTopActions: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 20,
      paddingTop: 10,
    },

    headerTextContainer: {
      flex: 1,
      justifyContent: "center",
    },

    headerName: {
      color: "white",
      fontSize: 20,
      fontWeight: "700",
    },

    shortDesc: {
      color: "rgba(255,255,255,0.85)",
      fontSize: 14,
      marginTop: 2,
    },

    iconButton: {
      padding: 10,
      backgroundColor: "rgba(255,255,255,0.2)",
      borderRadius: 30,
    },

    /* PROFILE */
    profileSection: {
      alignItems: "center",
      marginTop: -75,
      marginBottom: 110,
    },

    avatar: {
      width: AVATAR_SIZE,
      height: AVATAR_SIZE,
      borderRadius: AVATAR_SIZE / 2,
      borderWidth: 6,
      borderColor: lightBg,
      backgroundColor: surface,
      zIndex: 10,
    },

    arcContainer: {
      position: "absolute",
      bottom: 0,
      width: width,
      alignItems: "center",
      justifyContent: "center",
    },

    statBubble: {
      position: "absolute",
      width: BUBBLE_SIZE,
      height: BUBBLE_SIZE,
      borderRadius: BUBBLE_SIZE / 2,
      backgroundColor: brandGreen,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 5,
      borderColor: "white",
      shadowColor: "#000",
      shadowOpacity: 0.15,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 4 },
      elevation: 6,
    },

    statValue: {
      fontSize: 16,
      fontWeight: "700",
      color: "white",
    },

    statLabel: {
      fontSize: 10,
      color: "white",
      marginTop: 2,
    },

    /* CONTENT */
    mainContainer: {
      paddingHorizontal: 24,
      alignItems: "center",
    },

    card: {
      backgroundColor: surface,
      borderRadius: 24,
      padding: 20,
      marginTop: 24,
      width: "100%",
      elevation: 2,
    },

    aboutText: {
      fontSize: 15,
      color: textMain,
      lineHeight: 22,
    },
  });
}
