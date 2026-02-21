import {
  View,
  Image,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { format, isTomorrow, isToday, parseISO } from "date-fns";
import { Run, RunWithCreator } from "@/types/index";
const mainColor = "#2e8b57";

// Helper to format date like "Tomorrow • 06:30"
// Add case for next week ++
// Make usememo?
const formatRunDate = (dateString: string) => {
  const date = parseISO(dateString);
  const time = format(date, "HH:mm");

  if (isToday(date)) {
    return `Today • ${time}`;
  } else if (isTomorrow(date)) {
    return `Tomorrow • ${time}`;
  } else {
    return `${format(date, "EEE")} • ${time}`;
  }
};

export default function Feed() {
  const { user } = useAuth();
  const [upcomingRuns, setUpcomingRuns] = useState<RunWithCreator[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRuns = async () => {
      const { data, error } = await supabase
        .from("runs")
        .select(
          `
          *,
          profiles!runs_created_by_fkey(*)
        `,
        )
        .order("start_time", { ascending: true });

      if (error) {
        console.error("Error fetching runs:", error);
        return;
      }

      if (data) {
        const formattedRuns: RunWithCreator[] = data.map((run: any) => ({
          ...run,
          creator: run.profiles,
        }));

        setUpcomingRuns(formattedRuns);
      } else {
        setUpcomingRuns([]);
      }

      setIsLoading(false);
    };

    fetchRuns();
  }, [user?.id]);

  return (
    <SafeAreaView style={styles.mainContainer}>
      <View style={styles.topContainer}>
        <View style={styles.helloCard}>
          <Image
            style={styles.logo}
            source={require("@/assets/images/Jog-logo-temp.png")}
          />
          <View style={styles.greeting}>
            <Text style={styles.greetingText}>Hello,</Text>
            <Text style={styles.nameText}>Sondre</Text>
          </View>
          <Text style={{ fontSize: 35, marginLeft: 15 }}>👋</Text>
          <Image
            style={styles.avatar}
            source={{
              uri: "https://i.pravatar.cc/150?img=7",
            }}
          />
        </View>
      </View>

      <View style={styles.grid}>
        {/* Upcoming Runs Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="calendar-outline" size={20} color={mainColor} />
            <Text style={styles.cardTitle}>Upcoming</Text>
          </View>

          <ScrollView
            style={styles.runsList}
            contentContainerStyle={styles.runsListContent}
            showsVerticalScrollIndicator={false}
          >
            {upcomingRuns.length === 0 ? (
              <Text style={styles.emptyStateText}>No upcoming runs</Text>
            ) : (
              upcomingRuns.map((run, index) => (
                <TouchableOpacity
                  key={run.id}
                  style={[
                    styles.runItem,
                    index !== upcomingRuns.length - 1 && {
                      borderBottomWidth: StyleSheet.hairlineWidth,
                      borderBottomColor: "#e2e8f0",
                      marginBottom: 10,
                      paddingBottom: 10,
                    },
                  ]}
                  activeOpacity={0.85}
                  onPress={() => console.log(`Open run ${run.id}`)}
                >
                  <View style={styles.runHeaderRow}>
                    <Text style={styles.runTitle} numberOfLines={1}>
                      {run.title}
                    </Text>
                  </View>
                  <View style={styles.badgeContainer}>
                    <View style={styles.distanceBadge}>
                      <Text style={styles.distanceText}>{run.distance}km</Text>
                    </View>
                    <View style={styles.paceBadge}>
                      <Text style={styles.paceText}>{run.pace}km/h</Text>
                    </View>
                  </View>
                  <View style={styles.runDetailRow}>
                    <Ionicons name="time-outline" size={14} color="#64748b" />
                    <Text style={styles.runDate}>
                      {formatRunDate(run.start_time)}
                    </Text>
                  </View>

                  {/*{run.description ? (
                    <View style={styles.runDetailRow}>
                      <Ionicons
                        name="information-circle-outline"
                        size={14}
                        color="#64748b"
                      />
                      <Text style={styles.runDescription} numberOfLines={1}>
                        {run.description}
                      </Text>
                    </View>
                  ) : null}*/}
                </TouchableOpacity>
              ))
            )}
          </ScrollView>

          <TouchableOpacity
            style={styles.textLink}
            onPress={() => console.log("View All Upcoming Runs")}
          >
            <Text style={styles.textLinkContent}>View All</Text>
            <Ionicons name="arrow-forward" size={14} color={mainColor} />
          </TouchableOpacity>
        </View>

        {/* New Run Card */}
        <View style={styles.newRunContainer}>
          <View>
            <Text style={styles.newRunText}>New Run</Text>
            <TouchableOpacity
              onPress={() => console.log("New Run")}
              style={styles.plusButtonContainer}
              activeOpacity={0.8}
            >
              <Text style={styles.plusButton}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.communityContainer}>
        <Text style={styles.communityTitle}>Recommended runs: </Text>
        <View style={styles.communityCard}>
          <Text style={styles.communityName}>Alex</Text>
          <Text style={styles.communityText}>
            Planning a 5k tempo tomorrow morning.
          </Text>
        </View>
        <View style={styles.communityCard}>
          <Text style={styles.communityName}>Mia</Text>
          <Text style={styles.communityText}>
            Group long run this Sunday - 12km planned 🏃‍♀️
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const horPadding = 20;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 10,
  },
  topContainer: {
    paddingHorizontal: horPadding,
    marginBottom: 24,
  },
  helloCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  logo: {
    width: 50,
    height: 50,
    borderRadius: 16,
    marginRight: 16,
  },
  avatar: {
    right: 20,
    position: "absolute",
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  greeting: {
    flexDirection: "column",
  },
  greetingText: {
    fontSize: 14,
    color: "#64748b",
    fontWeight: "500",
  },
  nameText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0f172a",
  },

  // Grid Layout
  grid: {
    flexDirection: "row",
    gap: 16,
    paddingHorizontal: horPadding,
    marginBottom: 24,
    height: 280,
  },
  card: {
    flex: 1.2,
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1e293b",
  },
  runsList: {
    flex: 1,
  },
  runsListContent: {
    gap: 6,
    paddingBottom: 8,
  },
  runItem: {
    flexDirection: "column",
    gap: 6,
  },
  runHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  runDetailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  runInfo: {
    flex: 1,
    gap: 3,
  },
  runTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#334155",
    flex: 1,
  },
  runDate: {
    fontSize: 12,
    color: "#64748b",
    fontWeight: "500",
  },
  dotSeparator: {
    fontSize: 12,
    color: "#cbd5e1",
  },
  runDescription: {
    fontSize: 12,
    color: "#94a3b8",
    flex: 1,
  },
  badgeContainer: {
    justifyContent: "flex-start",
    flexDirection: "row",
    gap: 4,
  },
  distanceBadge: {
    backgroundColor: "#ecfdf5",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  distanceText: {
    fontSize: 11,
    fontWeight: "700",
    color: mainColor,
  },
  paceBadge: {
    backgroundColor: "#ecfdf5",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  paceText: {
    fontSize: 11,
    fontWeight: "700",
    color: mainColor,
  },
  emptyStateText: {
    fontSize: 13,
    color: "#94a3b8",
    fontStyle: "italic",
    textAlign: "center",
    marginTop: 20,
  },
  textLink: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: "auto",
    alignSelf: "flex-start",
  },
  textLinkContent: {
    fontSize: 13,
    fontWeight: "600",
    color: mainColor,
  },

  // Reverted New Run Button Styles
  newRunContainer: {
    flex: 0.7,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 24,
    paddingHorizontal: horPadding,
    borderRadius: 24,
    backgroundColor: "white",
    // borderWidth: 1,
    borderColor: mainColor,
    shadowColor: mainColor,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  newRunText: {
    fontSize: 20,
    fontWeight: "700",
    color: mainColor,
    textAlign: "center",
  },
  plusButtonContainer: {
    marginTop: 12,
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: mainColor,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 10,
  },
  plusButton: {
    color: "#fff",
    fontSize: 36,
    fontWeight: "800",
    marginTop: -2,
  },

  // Community Section
  communityContainer: {
    paddingHorizontal: horPadding,
    gap: 12,
  },
  communityTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 4,
  },
  communityCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  communityName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#334155",
    marginBottom: 4,
  },
  communityText: {
    fontSize: 14,
    color: "#64748b",
    lineHeight: 20,
  },
});
