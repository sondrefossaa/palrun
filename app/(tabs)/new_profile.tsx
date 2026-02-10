//TODO: fix profile picture url stuff
import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { useRouter } from "expo-router";
import Feather from "@expo/vector-icons/Feather";
/* ---------- TYPES ---------- */

type ProfileStats = {
  id: string;
  full_name: string;
  avatar_url: string | null;
  location: string;
  short_desc: string;
  long_desc: string;
  age: number;
};

/* ---------- MAIN COMPONENT ---------- */

export default function Profile() {
  const { user } = useAuth();
  const [profileStats, setProfileStats] = useState<ProfileStats | null>(null);
  const [loading, setLoading] = useState(true);
  const styles = useDynamicStyles();
  const router = useRouter();

  useEffect(() => {
    const fetchProfileStats = async () => {
      if (!user?.id) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Supabase error:", error);
      } else {
        setProfileStats(data);
      }

      setLoading(false);
    };

    fetchProfileStats();
  }, [user?.id]);

  /* ---------- STATES ---------- */

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#DA7756" />
      </View>
    );
  }

  if (!profileStats) {
    return (
      <View style={styles.loading}>
        <Text style={styles.errorText}>Profile not found</Text>
      </View>
    );
  }

  const quickStats = [
    { title: "Location", value: profileStats.location || "--" },
    { title: "Age", value: profileStats.age?.toString() || "--" },
    { title: "Style", value: "Social" },
  ];
  console.log(profileStats.avatar_url);

  return (
    <View style={styles.mainContainer}>
      <SafeAreaView style={styles.safe}>
        {/* TOP SECTION */}
        <View style={styles.topContainer}>
          <TouchableOpacity
            style={styles.settingsButton}
            onPress={() => router.push("/settings")}
          >
            <Feather name="settings" size={24} color="white" />
          </TouchableOpacity>
          <View style={styles.avatarAndNameContainer}>
            <View style={styles.avatarContainer}>
              <Image
                source={{ uri: profileStats.avatar_url }}
                style={styles.avatar}
              />
            </View>

            <View style={styles.nameAndDescriptionContainer}>
              <Text style={styles.name}>{profileStats.full_name}</Text>
              <Text style={styles.shortDesc}>
                {profileStats.short_desc || "Looking for running partners"}
              </Text>
            </View>
          </View>

          <View style={styles.longDescContainer}>
            <Text style={styles.longDesc}>
              {profileStats.long_desc ||
                "Tell others what pace you like, when you usually run, and what kind of runs you enjoy."}
            </Text>
          </View>
        </View>
      </SafeAreaView>
      {/* BOTTOM CARD */}
      <View style={styles.bottomCard}>
        <View style={styles.bottomContent}>
          <QuickStats stats={quickStats} styles={styles} />
          <View style={styles.runContainer}>
            <Text style={styles.sectionTitle}>Recent runs</Text>
            <Text style={styles.mutedText}>
              You haven’t joined any runs yet
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.editProfileButton}
          onPress={() => router.push("/settings")}
        >
          <Text style={styles.editProfileText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

/* ---------- COMPONENTS ---------- */

function QuickStats({
  stats,
  styles,
}: {
  stats: Array<{ title: string; value: string }>;
  styles: ReturnType<typeof useDynamicStyles>;
}) {
  return (
    <View style={styles.statsContainer}>
      {stats.map((stat, index) => (
        <React.Fragment key={index}>
          <StatsCard title={stat.title} value={stat.value} styles={styles} />
          {index < stats.length - 1 && <View style={styles.separator} />}
        </React.Fragment>
      ))}
    </View>
  );
}

function StatsCard({
  title,
  value,
  styles,
}: {
  title: string;
  value: string;
  styles: ReturnType<typeof useDynamicStyles>;
}) {
  return (
    <View style={styles.statsCard}>
      <Text style={styles.statsValue}>{value}</Text>
      <Text style={styles.statsTitle}>{title}</Text>
    </View>
  );
}

/* ---------- STYLES ---------- */

function useDynamicStyles() {
  const brand = "#DA7756";
  const bg = "#F7F7F7";

  return StyleSheet.create({
    safe: {
      backgroundColor: brand,
    },
    loading: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: bg,
    },
    errorText: {
      fontSize: 16,
      color: "#374151",
    },

    mainContainer: {
      flex: 1,
      backgroundColor: brand,
    },

    topContainer: {
      padding: 20,
    },

    settingsButton: {
      position: "absolute",
      // backgroundColor: "rgba(255,255,255,0.16)",
      padding: 10,
      top: 20,
      right: 20,
      borderRadius: 12,
      marginBottom: 12,
    },
    avatarAndNameContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 20,
    },

    avatarContainer: {
      width: 80,
      height: 80,
      borderRadius: 40,
      overflow: "hidden",
      borderWidth: 2,
      borderColor: "white",
    },

    avatar: {
      width: "100%",
      height: "100%",
    },

    nameAndDescriptionContainer: {
      marginLeft: 16,
    },

    name: {
      fontSize: 24,
      fontWeight: "700",
      color: "white",
    },

    shortDesc: {
      fontSize: 15,
      color: "rgba(255,255,255,0.8)",
      marginTop: 2,
    },

    longDescContainer: {
      backgroundColor: bg,
      padding: 16,
      borderRadius: 14,
    },

    longDesc: {
      fontSize: 15,
      color: "#374151",
      lineHeight: 22,
    },

    bottomCard: {
      flex: 1,
      backgroundColor: bg,
      borderTopLeftRadius: 32,
      borderTopRightRadius: 32,
      paddingTop: 20,
      paddingHorizontal: 20,
      paddingBottom: 20,
    },

    statsContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingHorizontal: 20,
      paddingBottom: 16,
    },

    statsCard: {
      alignItems: "center",
      width: "30%",
    },

    statsValue: {
      fontSize: 22,
      fontWeight: "700",
      color: "#111827",
    },

    statsTitle: {
      fontSize: 12,
      color: "#6B7280",
      marginTop: 2,
    },

    separator: {
      width: 1,
      backgroundColor: "#E5E7EB",
    },

    bottomContent: {
      flex: 1,
      justifyContent: "flex-start",
    },

    runContainer: {
      backgroundColor: "white",
      borderRadius: 16,
      padding: 16,
      marginTop: 12,
    },

    sectionTitle: {
      fontSize: 16,
      fontWeight: "700",
      marginBottom: 6,
      color: "#111827",
    },

    mutedText: {
      fontSize: 14,
      color: "#6B7280",
    },

    editProfileButton: {
      backgroundColor: brand,
      paddingVertical: 14,
      borderRadius: 14,
      alignItems: "center",
      marginTop: 16,
    },

    editProfileText: {
      color: "white",
      fontSize: 16,
      fontWeight: "700",
    },
  });
}
