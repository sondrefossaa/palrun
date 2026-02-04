import { useMemo } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors, mainColor } from "../../constants/theme";
import { useColorScheme } from "../../hooks/use-color-scheme";
import { HelloWave } from "../../components/hello-wave";

const mockUser = {
  name: "Sondre",
  initials: "SP",
  avatar:
    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=60",
};

const upcomingRuns = [
  {
    id: "run-1",
    title: "Sunrise Sprint",
    date: "Tomorrow • 06:30",
    distance: "8 km",
  },
  {
    id: "run-2",
    title: "Weekend Long",
    date: "Sat • 09:00",
    distance: "18 km",
  },
];

const feedItems = [
  {
    id: "feed-1",
    user: "Sarah M.",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=60",
    title: "Trail group run",
    excerpt: "Great sunrise session with the crew around the fjord.",
    distance: "12 km",
    time: "2h ago",
    likes: 24,
  },
  {
    id: "feed-2",
    user: "David K.",
    avatar:
      "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=100&q=60",
    title: "Intervals",
    excerpt: "6 x 800m with 90s rest. Legs felt strong today!",
    distance: "9 km",
    time: "5h ago",
    likes: 18,
  },
];

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const isDark = colorScheme === "dark";

  const sectionBg = useMemo(() => (isDark ? "#1d2433" : "#fff"), [isDark]);

  const textColor = colors.text;
  const subTextColor = isDark ? "#9ca3af" : "#6b7280";
  const borderColor = isDark ? "#334155" : "#e2e8f0";

  return (
    <ScrollView
      style={[styles.screen, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Hero Section */}
      <View style={[styles.hero, { backgroundColor: sectionBg }]}>
        <View style={styles.heroContent}>
          <View style={styles.headerRow}>
            <View style={styles.logoBadge}>
              <Ionicons name="footsteps" size={20} color="#fff" />
            </View>
            <View>
              <Text style={[styles.greeting, { color: subTextColor }]}>
                Good morning,
              </Text>
              <Text style={[styles.username, { color: textColor }]}>
                {mockUser.name} <HelloWave />
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.avatarContainer}>
          <Image source={{ uri: mockUser.avatar }} style={styles.avatar} />
        </TouchableOpacity>
      </View>

      {/* Action Grid */}
      <View style={styles.grid}>
        {/* Upcoming Runs Card */}
        <View style={[styles.card, { backgroundColor: sectionBg, flex: 1.2 }]}>
          <View style={styles.cardHeader}>
            <Ionicons name="calendar-outline" size={20} color={mainColor} />
            <Text style={[styles.cardTitle, { color: textColor }]}>
              Upcoming
            </Text>
          </View>

          <View style={styles.runsList}>
            {upcomingRuns.map((run, index) => (
              <View
                key={run.id}
                style={[
                  styles.runItem,
                  index !== upcomingRuns.length - 1 && {
                    borderBottomWidth: StyleSheet.hairlineWidth,
                    borderBottomColor: borderColor,
                  },
                ]}
              >
                <View style={styles.runInfo}>
                  <Text
                    style={[styles.runTitle, { color: textColor }]}
                    numberOfLines={1}
                  >
                    {run.title}
                  </Text>
                  <Text style={[styles.runDate, { color: subTextColor }]}>
                    {run.date}
                  </Text>
                </View>
                <View style={styles.distanceBadge}>
                  <Text style={styles.distanceText}>{run.distance}</Text>
                </View>
              </View>
            ))}
          </View>

          <TouchableOpacity style={styles.textLink}>
            <Text style={styles.textLinkContent}>Calendar</Text>
            <Ionicons name="arrow-forward" size={14} color={mainColor} />
          </TouchableOpacity>
        </View>

        {/* Create Run Card */}
        <View style={[styles.card, styles.accentCard, { flex: 0.8 }]}>
          <View style={styles.accentPattern} />
          <View style={styles.cardHeader}>
            <Ionicons name="add-circle-outline" size={22} color="#fff" />
          </View>
          <View style={{ flex: 1, justifyContent: "center", gap: 4 }}>
            <Text style={styles.accentTitle}>New Run</Text>
            <Text style={styles.accentSubtitle}>
              Plan a route & invite friends
            </Text>
          </View>
          <TouchableOpacity style={styles.accentButton}>
            <Text style={styles.accentButtonText}>Start</Text>
            <Ionicons name="arrow-forward" size={16} color={mainColor} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Feed Section */}
      <View style={styles.feedSection}>
        <View style={styles.feedHeader}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>
            Community Feed
          </Text>
          <TouchableOpacity style={styles.seeAllBtn}>
            <Text style={styles.seeAllText}>See all</Text>
            <Ionicons name="chevron-forward" size={14} color={mainColor} />
          </TouchableOpacity>
        </View>

        {feedItems.map((item) => (
          <View
            key={item.id}
            style={[styles.feedCard, { backgroundColor: sectionBg }]}
          >
            <View style={styles.feedHeaderRow}>
              <View style={styles.userInfo}>
                <Image
                  source={{ uri: item.avatar }}
                  style={styles.feedAvatar}
                />
                <View>
                  <Text style={[styles.feedUser, { color: textColor }]}>
                    {item.user}
                  </Text>
                  <Text style={styles.feedTime}>{item.time}</Text>
                </View>
              </View>
              <View style={styles.distanceTag}>
                <Ionicons name="stats-chart" size={12} color={mainColor} />
                <Text style={styles.distanceTagText}>{item.distance}</Text>
              </View>
            </View>

            <View style={styles.feedContent}>
              <Text style={[styles.feedItemTitle, { color: textColor }]}>
                {item.title}
              </Text>
              <Text style={[styles.feedExcerpt, { color: subTextColor }]}>
                {item.excerpt}
              </Text>
            </View>

            <View
              style={[
                styles.feedActions,
                { borderTopColor: isDark ? "#334155" : "#e5e7eb" },
              ]}
            >
              <TouchableOpacity style={styles.actionBtn}>
                <Ionicons name="heart-outline" size={18} color={subTextColor} />
                <Text style={[styles.actionText, { color: subTextColor }]}>
                  {item.likes}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionBtn}>
                <Ionicons
                  name="chatbubble-outline"
                  size={18}
                  color={subTextColor}
                />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    padding: 20,
    gap: 24,
    paddingBottom: 40,
  },
  hero: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderRadius: 24,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  heroContent: {
    flex: 1,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  logoBadge: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: mainColor,
    alignItems: "center",
    justifyContent: "center",
  },
  greeting: {
    fontSize: 13,
    fontWeight: "500",
  },
  username: {
    fontSize: 18,
    fontWeight: "700",
  },
  avatarContainer: {
    padding: 3,
    backgroundColor: "#fff",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 18,
  },
  grid: {
    flexDirection: "row",
    gap: 16,
  },
  card: {
    borderRadius: 20,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "700",
  },
  runsList: {
    gap: 10,
    marginBottom: 12,
  },
  runItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 8,
    paddingTop: 4,
  },
  runInfo: {
    flex: 1,
    gap: 2,
  },
  runTitle: {
    fontSize: 14,
    fontWeight: "600",
  },
  runDate: {
    fontSize: 11,
  },
  distanceBadge: {
    backgroundColor: "#fff0ea",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  distanceText: {
    fontSize: 12,
    fontWeight: "700",
    color: mainColor,
  },
  textLink: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: "auto",
  },
  textLinkContent: {
    fontSize: 13,
    fontWeight: "600",
    color: mainColor,
  },
  accentCard: {
    backgroundColor: "#0f172a",
    position: "relative",
    overflow: "hidden",
  },
  accentPattern: {
    position: "absolute",
    top: -20,
    right: -20,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  accentTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  accentSubtitle: {
    color: "#94a3b8",
    fontSize: 12,
    lineHeight: 16,
  },
  accentButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "#fff",
    paddingVertical: 10,
    borderRadius: 12,
    marginTop: 12,
  },
  accentButtonText: {
    color: "#0f172a",
    fontSize: 13,
    fontWeight: "700",
  },
  feedSection: {
    gap: 16,
  },
  feedHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  seeAllBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  seeAllText: {
    color: mainColor,
    fontSize: 14,
    fontWeight: "600",
  },
  feedCard: {
    borderRadius: 20,
    padding: 16,
    gap: 12,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  feedHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  feedAvatar: {
    width: 36,
    height: 36,
    borderRadius: 12,
  },
  feedUser: {
    fontSize: 14,
    fontWeight: "700",
  },
  feedTime: {
    fontSize: 11,
    color: "#9ca3af",
  },
  distanceTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#fff0ea",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  distanceTagText: {
    color: mainColor,
    fontSize: 12,
    fontWeight: "700",
  },
  feedContent: {
    gap: 6,
  },
  feedItemTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  feedExcerpt: {
    fontSize: 14,
    lineHeight: 20,
  },
  feedActions: {
    flexDirection: "row",
    gap: 16,
    marginTop: 4,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  actionText: {
    fontSize: 12,
    fontWeight: "500",
  },
});
