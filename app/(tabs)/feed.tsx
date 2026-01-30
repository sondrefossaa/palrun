import { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Region } from "react-native-maps";

import { Run, Filter } from "@/types";
import { supabase } from "@/lib/supabase";
import RunDisplay from "@/components/run/run-display";
import FilterModal from "@/components/filter-modal";
import { mainColor } from "@/constants/theme";

const test_region: Region = {
  latitude: 60.391262,
  longitude: 5.322054,
  latitudeDelta: 1,
  longitudeDelta: 1,
};

export default function Feed() {
  const [runs, setRuns] = useState<Run[]>([]);
  const [filter, setFilter] = useState<Filter | null>(null);
  const [selectedRun, setSelectedRun] = useState<Run | null>(null);
  const [loading, setLoading] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const fetchRuns = async () => {
        if (loading) return;

        setLoading(true);
        try {
          // In a real app, you would pass filter params to the RPC call here
          const { data, error } = await supabase.rpc("runs_nearby", {
            lat: test_region.latitude,
            lng: test_region.longitude,
            radius_m: 5000,
          });

          if (error) {
            console.error("Error fetching runs:", error);
            setRuns([]);
          } else {
            // Client-side filtering as an example if RPC doesn't support it yet
            let filteredRuns = data || [];

            // Apply client-side filters if necessary (simplified example)
            // if (filter?.distance === 'short') ...

            setRuns(filteredRuns);
          }
        } catch (err) {
          console.error("Fetch error:", err);
          setRuns([]);
        } finally {
          setLoading(false);
        }
      };

      fetchRuns();
    }, [filter]),
  );

  const renderRunCard = (run: Run) => (
    <TouchableOpacity
      key={run.id}
      style={styles.card}
      onPress={() => setSelectedRun(run)}
      activeOpacity={0.8}
    >
      <View style={styles.cardHeader}>
        <View style={styles.cardIconContainer}>
          <MaterialCommunityIcons name="run" size={24} color="white" />
        </View>
        <View style={styles.cardTitleContainer}>
          <Text style={styles.cardTitle} numberOfLines={1}>
            {run.title}
          </Text>
          <Text style={styles.cardDate}>{run.startTime}</Text>
        </View>
        <Ionicons name="chevron-forward" size={24} color="#ccc" />
      </View>

      <Text style={styles.cardDescription} numberOfLines={2}>
        {run.description}
      </Text>

      <View style={styles.divider} />

      <View style={styles.cardStats}>
        <View style={styles.statItem}>
          <MaterialCommunityIcons
            name="map-marker-distance"
            size={18}
            color={mainColor}
          />
          <Text style={styles.statValue}>{run.distance} km</Text>
        </View>
        <View style={styles.statItem}>
          <MaterialCommunityIcons
            name="speedometer"
            size={18}
            color={mainColor}
          />
          <Text style={styles.statValue}>{run.pace} /km</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <SafeAreaView edges={["top"]}>
          <View style={styles.headerTop}>
            <View style={styles.headerTextContainer}>
              <Text style={styles.headerTitle}>Find Runs</Text>
              <Text style={styles.headerSubtitle}>
                Explore running events nearby
              </Text>
            </View>
            <TouchableOpacity
              style={styles.filterButton}
              onPress={() => setFilterModalVisible(true)}
            >
              <Ionicons name="options-outline" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {runs.map(renderRunCard)}
      </ScrollView>

      <FilterModal
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        currentFilters={filter}
        onApply={(newFilters) => setFilter(newFilters)}
      />

      {selectedRun && (
        <RunDisplay
          selectedRun={selectedRun}
          onClose={() => setSelectedRun(null)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F4F8", // Light gray background for contrast
  },
  header: {
    backgroundColor: mainColor,
    paddingBottom: 20,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    zIndex: 10,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    color: "white",
    fontSize: 32,
    fontWeight: "800",
    marginTop: 10,
  },
  headerSubtitle: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 14,
    marginTop: 4,
  },
  filterButton: {
    width: 48,
    height: 48,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingTop: 20,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  cardIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: mainColor,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  cardTitleContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1a1a1a",
  },
  cardDate: {
    fontSize: 12,
    color: "#888",
    marginTop: 2,
  },
  cardDescription: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    marginBottom: 16,
  },
  divider: {
    height: 1,
    backgroundColor: "#f0f0f0",
    marginBottom: 12,
  },
  cardStats: {
    flexDirection: "row",
    justifyContent: "flex-start",
    gap: 20,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF5F2", // Light version of mainColor
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  statValue: {
    marginLeft: 6,
    fontSize: 13,
    fontWeight: "600",
    color: mainColor,
  },
});
