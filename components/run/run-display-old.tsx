import { mainColor } from "@/constants/theme";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
} from "react-native";
import { Run } from "@/types/index";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

interface RunDisplayProps {
  selectedRun: Run;
  onClose: () => void;
}

export default function RunDisplay({ selectedRun, onClose }: RunDisplayProps) {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerIcon}>
              <MaterialCommunityIcons name="run" size={32} color="white" />
            </View>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="close-circle" size={32} color="#ddd" />
            </TouchableOpacity>
          </View>

          {/* Content */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            <Text style={styles.title}>{selectedRun.title}</Text>

            <View style={styles.metaRow}>
              <View style={styles.metaItem}>
                <Ionicons name="time-outline" size={16} color="#666" />
                <Text style={styles.metaText}>
                  {selectedRun.startTime || "TBD"}
                </Text>
              </View>
              <View style={styles.metaDivider} />
              <View style={styles.metaItem}>
                <Ionicons name="location-outline" size={16} color="#666" />
                <Text style={styles.metaText}>
                  {selectedRun.lat.toFixed(4)}, {selectedRun.lng.toFixed(4)}
                </Text>
              </View>
            </View>

            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>
              {selectedRun.description || "No description provided."}
            </Text>

            <Text style={styles.sectionTitle}>Run Details</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statBox}>
                <MaterialCommunityIcons
                  name="map-marker-distance"
                  size={24}
                  color={mainColor}
                />
                <Text style={styles.statValue}>{selectedRun.distance} km</Text>
                <Text style={styles.statLabel}>Distance</Text>
              </View>
              <View style={styles.statBox}>
                <MaterialCommunityIcons
                  name="speedometer"
                  size={24}
                  color={mainColor}
                />
                <Text style={styles.statValue}>{selectedRun.pace} /km</Text>
                <Text style={styles.statLabel}>Pace</Text>
              </View>
            </View>
          </ScrollView>

          {/* Footer Action */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.actionButton} onPress={onClose}>
              <Text style={styles.actionButtonText}>Join Run</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 20,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  container: {
    backgroundColor: "white",
    borderRadius: 24,
    maxHeight: "80%",
    width: "100%",
    maxWidth: 400,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 10,
    overflow: "hidden",
  },
  header: {
    height: 80,
    backgroundColor: mainColor,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    alignItems: "center",
  },
  headerIcon: {
    width: 40,
    height: 40,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  closeButton: {
    padding: 5,
  },
  scrollContent: {
    padding: 24,
    paddingTop: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1a1a1a",
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
    backgroundColor: "#f5f5f5",
    padding: 12,
    borderRadius: 12,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  metaDivider: {
    width: 1,
    height: 16,
    backgroundColor: "#ccc",
    marginHorizontal: 12,
  },
  metaText: {
    fontSize: 14,
    color: "#444",
    fontWeight: "500",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 8,
    marginTop: 8,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: "#666",
    marginBottom: 24,
  },
  statsGrid: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 24,
  },
  statBox: {
    flex: 1,
    backgroundColor: "#FFF5F2",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(218, 119, 86, 0.2)",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "700",
    color: mainColor,
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  footer: {
    padding: 24,
    paddingTop: 0,
  },
  actionButton: {
    backgroundColor: mainColor,
    borderRadius: 16,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: mainColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  actionButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
  },
});
