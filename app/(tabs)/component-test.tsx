import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import RunDisplay from "@/components/run/run-display";
import { supabase } from "@/lib/supabase";
import { Run } from "@/types/index";

export default function ComponentTest() {
  const [run, setRun] = useState<Run | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchRunById = useCallback(async () => {
    setLoading(true);
    setErrorMessage(null);

    const { data, error: runError } = await supabase
      .from("runs")
      .select(
        `
        id,
        title,
        lat,
        lng,
        description,
        distance,
        pace,
        created_by,
        start_time
      `,
      )
      .eq("id", "73ad1dff-2063-4c9e-b7fc-3e8b7c102d0a")
      .limit(1);

    if (runError) {
      setErrorMessage(runError.message);
      setLoading(false);
      return;
    }

    const raw = data?.[0];
    if (!raw) {
      setErrorMessage("Run not found.");
      setLoading(false);
      return;
    }

    if (raw.lat == null || raw.lng == null || raw.created_by == null) {
      setErrorMessage("Run is missing required fields.");
      setLoading(false);
      return;
    }

    const mappedRun: Run = {
      id: raw.id,
      title: raw.title ?? "Untitled run",
      lat: raw.lat,
      lng: raw.lng,
      description: raw.description ?? undefined,
      distance: raw.distance != null ? String(raw.distance) : undefined,
      pace: raw.pace != null ? Number(raw.pace) : undefined,
      created_by: raw.created_by,
      startTime: raw.start_time
        ? new Date(raw.start_time).getTime()
        : undefined,
    };

    setRun(mappedRun);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchRunById();
  }, [fetchRunById]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Run 73ad1dff</Text>
        <TouchableOpacity style={styles.refreshButton} onPress={fetchRunById}>
          <Text style={styles.refreshText}>Reload</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#2e8b57" />
          <Text style={styles.statusText}>Loading run…</Text>
        </View>
      ) : errorMessage ? (
        <View style={styles.centered}>
          <Text style={styles.errorText}>{errorMessage}</Text>
        </View>
      ) : run ? (
        <RunDisplay run={run} />
      ) : (
        <View style={styles.centered}>
          <Text style={styles.statusText}>No run available.</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
    gap: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0f172a",
  },
  refreshButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#2e8b57",
  },
  refreshText: {
    color: "#2e8b57",
    fontWeight: "600",
  },
  centered: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 24,
  },
  statusText: {
    marginTop: 8,
    color: "#64748b",
  },
  errorText: {
    color: "#b91c1c",
    fontWeight: "600",
    textAlign: "center",
  },
});
