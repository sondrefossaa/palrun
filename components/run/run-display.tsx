import { View, Image, Text, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { RunWithCreator } from "@/types/index";

const formatDateTime = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleString();
};

const getInitials = (name: string) => {
  const parts = name.trim().split(" ").filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
};
export default function RunDisplay({ run }: { run: RunWithCreator }) {
  const creator = run.creator;
  const creatorName =
    creator?.full_name || creator?.username || "Unknown runner";
  const distanceLabel =
    typeof run.distance === "number" ? `${run.distance.toFixed(1)} km` : "N/A";
  const paceLabel =
    typeof run.pace === "number" ? `${run.pace.toFixed(2)} min/km` : "N/A";
  const startLabel = formatDateTime(run.start_time);

  return (
    <SafeAreaView style={styles.mainContainer}>
      <View style={styles.headerRow}>
        {creator?.avatar_url ? (
          <Image source={{ uri: creator.avatar_url }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarFallback}>
            <Text style={styles.avatarFallbackText}>
              {getInitials(creatorName)}
            </Text>
          </View>
        )}
        <View style={styles.headerText}>
          <Text style={styles.title}>{run.title}</Text>
          <Text style={styles.creator}>Hosted by {creatorName}</Text>
        </View>
      </View>

      <Text style={styles.description}>{run.description}</Text>

      <View style={styles.metaRow}>
        <View style={styles.metaItem}>
          <Text style={styles.metaLabel}>Location</Text>
          <Text style={styles.metaValue}>{run.location}</Text>
        </View>
        <View style={styles.metaItem}>
          <Text style={styles.metaLabel}>Start</Text>
          <Text style={styles.metaValue}>{startLabel}</Text>
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Distance</Text>
          <Text style={styles.statValue}>{distanceLabel}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Pace</Text>
          <Text style={styles.statValue}>{paceLabel}</Text>
        </View>
      </View>

      <View style={styles.actionsRow}>
        <TouchableOpacity style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>Join run</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryButton}>
          <Text style={styles.secondaryButtonText}>Details</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  creator: {
    marginTop: 4,
    fontSize: 13,
    color: "#6B7280",
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#E5E7EB",
  },
  avatarFallback: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#111827",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarFallbackText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  description: {
    fontSize: 14,
    color: "#374151",
    lineHeight: 20,
    marginBottom: 14,
  },
  metaRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  metaItem: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    padding: 10,
    borderRadius: 10,
  },
  metaLabel: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 4,
  },
  metaValue: {
    fontSize: 14,
    color: "#111827",
    fontWeight: "600",
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#EEF2FF",
    padding: 12,
    borderRadius: 10,
  },
  statLabel: {
    fontSize: 12,
    color: "#4F46E5",
    marginBottom: 6,
  },
  statValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },
  actionsRow: {
    flexDirection: "row",
    gap: 12,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: "#111827",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  secondaryButtonText: {
    color: "#111827",
    fontWeight: "700",
    fontSize: 14,
  },
});
