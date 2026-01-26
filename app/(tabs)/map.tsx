import { StyleSheet, View, ActivityIndicator } from "react-native";
import MapView, { Marker, Region } from "react-native-maps";
import { useEffect, useRef, useState } from "react";
import * as Location from "expo-location";
import { supabase } from "../../utils/supabase";

interface Run {
  id: string;
  title: string;
  lat: number;
  lng: number;
  distance_m: number;
}

function regionToRadiusMeters(region: Region) {
  return (region.latitudeDelta / 2) * 111_000;
}

export default function Map() {
  const [userLoc, setUserLoc] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const [runs, setRuns] = useState<Run[]>([]);
  const loadingRef = useRef(false);

  // --- Get GPS ---
  useEffect(() => {
    (async () => {
      try {
        const { status } =
          await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") return;

        const loc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });

        setUserLoc({
          lat: loc.coords.latitude,
          lng: loc.coords.longitude,
        });
      } catch (e) {
        console.error("Location error:", e);
      }
    })();
  }, []);

  // --- Load runs ---
  const loadRuns = async (region: Region) => {
    if (loadingRef.current) return;
    loadingRef.current = true;

    const radius = regionToRadiusMeters(region) * 1.5;

    const { data, error } = await supabase.rpc("runs_nearby", {
      lat: region.latitude,
      lng: region.longitude,
      radius_m: Math.round(radius),
    });

    if (!error && data) setRuns(data);
    if (error) console.error(error.message);

    loadingRef.current = false;
  };

  if (!userLoc) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={StyleSheet.absoluteFillObject}
        showsUserLocation
        initialRegion={{
          latitude: userLoc.lat,
          longitude: userLoc.lng,
          latitudeDelta: 0.03,
          longitudeDelta: 0.03,
        }}
        onRegionChangeComplete={loadRuns}
      >
        {runs.map((run) => (
          <Marker
            key={run.id}
            coordinate={{ latitude: run.lat, longitude: run.lng }}
            title={run.title}
            description={`${Math.round(run.distance_m)} m away`}
          />
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});
