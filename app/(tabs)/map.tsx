import { StyleSheet, View } from "react-native";
import MapView, { Marker, Region } from "react-native-maps";
import { useState, useEffect, useRef } from "react";
import { supabase } from "../../utils/supabase";

interface Run {
  id: number;
  title: string;
  lat: number;
  lng: number;
}
//  TODO: rewrite all
export default function Map() {
  const [runs, setRuns] = useState<Run[]>([]);
  const isLoadingRef = useRef(false);
  const lastRegionRef = useRef<Region | null>(null);

  // Simple load function without caching
  const loadRuns = async (region: Region) => {
    if (isLoadingRef.current) return;

    // Only load if region changed significantly
    if (lastRegionRef.current &&
      Math.abs(lastRegionRef.current.latitude - region.latitude) < 0.001 &&
      Math.abs(lastRegionRef.current.longitude - region.longitude) < 0.001) {
      return;
    }

    lastRegionRef.current = region;
    isLoadingRef.current = true;

    try {
      const latDelta = region.latitudeDelta;
      const lngDelta = region.longitudeDelta;

      const { data, error } = await supabase
        .from("runs")
        .select("*")
        .gte("lat", region.latitude - latDelta)
        .lte("lat", region.latitude + latDelta)
        .gte("lng", region.longitude - lngDelta)
        .lte("lng", region.longitude + lngDelta)
        .limit(100);

      if (!error && data) {
        setRuns(data as Run[]);
      }
    } catch (err) {
      console.error("Error loading runs:", err);
    } finally {
      isLoadingRef.current = false;
    }
  };

  // Use timeout instead of debounce
  const timeoutRef = useRef<NodeJS.Timeout>();

  const handleRegionChangeComplete = (region: Region) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      loadRuns(region);
    }, 1000);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <View style={styles.container}>
      <MapView
        style={StyleSheet.absoluteFillObject}
        initialRegion={{
          latitude: 60.3913,
          longitude: 5.3221,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        onRegionChangeComplete={handleRegionChangeComplete}
      >
        {runs.map((run) => (
          <Marker
            key={run.id}
            coordinate={{ latitude: run.lat, longitude: run.lng }}
            title={run.title}
          />
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
