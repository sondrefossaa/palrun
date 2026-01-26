import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useRef, useState } from "react";
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
  View
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { supabase } from "../../utils/supabase";

const THEME_COLOR = "#da7756";
const RUNNING_DISTANCES = [1, 3, 5, 10, 15, 21.1, 42.2];

interface LocationPin {
  latitude: number;
  longitude: number;
}

export default function NewRun() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedDistance, setSelectedDistance] = useState<number | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<LocationPin | null>(
    null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const mapRef = useRef<MapView>(null);

  const handleMapPress = (event: any) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setSelectedLocation({ latitude, longitude });
  };

  const handleSubmit = async () => {
    // Validation
    if (!title.trim()) {
      Alert.alert("Error", "Please enter a run title");
      return;
    }

    if (!selectedLocation) {
      Alert.alert("Error", "Please select a location on the map");
      return;
    }

    if (selectedDistance === null) {
      Alert.alert("Error", "Please select a distance");
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("runs").insert([
        {
          title: title.trim(),
          lat: selectedLocation.latitude,
          lng: selectedLocation.longitude,
          description: description.trim() || null,
          distance: selectedDistance,
        },
      ]);

      if (error) {
        Alert.alert("Error", error.message || "Failed to submit run");
      } else {
        Alert.alert("Success", "Run submitted successfully!");
        setTitle("");
        setDescription("");
        setSelectedDistance(null);
        setSelectedLocation(null);
      }
    } catch (err) {
      Alert.alert("Error", "An unexpected error occurred");
      console.error("Error submitting run:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const themeColors = Colors[colorScheme ?? "light"];

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView
        style={[
          styles.content,
          { backgroundColor: themeColors.background },
        ]}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header Title */}
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: themeColors.text }]}>
            Sart ny joggetur
          </Text>
        </View>

        {/* Title Input */}
        <View style={styles.section}>
          <Text
            style={[
              styles.label,
              { color: themeColors.text },
            ]}
          >
            Run Title
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                borderColor: THEME_COLOR,
                color: themeColors.text,
                backgroundColor: isDark ? "#2a2a2a" : "#f5f5f5",
              },
            ]}
            placeholder="Enter run title..."
            placeholderTextColor={isDark ? "#888" : "#999"}
            value={title}
            onChangeText={setTitle}
            editable={!isSubmitting}
          />
        </View>

        {/* Description Input */}
        <View style={styles.section}>
          <Text
            style={[
              styles.label,
              { color: themeColors.text },
            ]}
          >
            Description (Optional)
          </Text>
          <TextInput
            style={[
              styles.input,
              styles.textArea,
              {
                borderColor: THEME_COLOR,
                color: themeColors.text,
                backgroundColor: isDark ? "#2a2a2a" : "#f5f5f5",
              },
            ]}
            placeholder="Add notes about your run..."
            placeholderTextColor={isDark ? "#888" : "#999"}
            value={description}
            onChangeText={setDescription}
            editable={!isSubmitting}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        {/* Distance Selector */}
        <View style={styles.section}>
          <Text
            style={[
              styles.label,
              { color: themeColors.text },
            ]}
          >
            Distance (km)
          </Text>
          <View style={styles.distanceGrid}>
            {RUNNING_DISTANCES.map((distance) => (
              <TouchableOpacity
                key={distance}
                style={[
                  styles.distanceButton,
                  {
                    backgroundColor:
                      selectedDistance === distance
                        ? THEME_COLOR
                        : isDark
                        ? "#2a2a2a"
                        : "#f5f5f5",
                    borderColor:
                      selectedDistance === distance
                        ? THEME_COLOR
                        : isDark
                        ? "#444"
                        : "#ddd",
                  },
                ]}
                onPress={() => setSelectedDistance(distance)}
                disabled={isSubmitting}
              >
                <Text
                  style={[
                    styles.distanceButtonText,
                    {
                      color:
                        selectedDistance === distance
                          ? "#fff"
                          : themeColors.text,
                    },
                  ]}
                >
                  {distance}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Map Section */}
        <View style={styles.section}>
          <Text
            style={[
              styles.label,
              { color: themeColors.text },
            ]}
          >
            Select Location
          </Text>
          <View style={styles.mapContainer}>
            <MapView
              ref={mapRef}
              style={styles.map}
              initialRegion={{
                latitude: 60.3913,
                longitude: 5.3221,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
              }}
              onPress={handleMapPress}
            >
              {selectedLocation && (
                <Marker
                  coordinate={selectedLocation}
                  title="Selected Location"
                  pinColor={THEME_COLOR}
                />
              )}
            </MapView>
          </View>
          {selectedLocation && (
            <Text
              style={[
                styles.coordinatesText,
                { color: themeColors.text },
              ]}
            >
              Coordinates: {selectedLocation.latitude.toFixed(4)}, {selectedLocation.longitude.toFixed(4)}
            </Text>
          )}
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[
            styles.submitButton,
            { backgroundColor: THEME_COLOR, opacity: isSubmitting ? 0.7 : 1 },
          ]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>Legg til joggetur</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  scrollContent: {
    paddingTop: 16,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 32,
    marginTop: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    fontWeight: "400",
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  input: {
    borderWidth: 2,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  textArea: {
    minHeight: 100,
    paddingVertical: 12,
  },
  distanceGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    justifyContent: "space-between",
  },
  distanceButton: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 6,
    borderWidth: 2,
    width: "31%",
    alignItems: "center",
    justifyContent: "center",
  },
  distanceButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  mapContainer: {
    height: 250,
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 12,
  },
  map: {
    flex: 1,
  },
  coordinatesText: {
    fontSize: 12,
    fontStyle: "italic",
    marginTop: 8,
  },
  submitButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
    marginBottom: 16,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
