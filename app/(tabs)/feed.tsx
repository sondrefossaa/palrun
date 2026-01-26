import { useEffect, useState } from "react";
import { Run, Filter } from "@/types"
import { supabase } from "@/utils/supabase";
import MapView, { Marker, Region } from "react-native-maps";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Dropdown } from 'react-native-element-dropdown';
import { Picker } from '@react-native-picker/picker';
const test_region: Region = {
  latitude: 60.391262,
  longitude: 5.322054,
  latitudeDelta: 1,
  longitudeDelta: 1,
};

const filterOptions = [
  {
    id: 'distance',
    label: 'Distance',
    options: [
      { label: 'All Distances', value: 'all' },
      { label: 'Short (<5km)', value: 'short' },
      { label: 'Medium (5-10km)', value: 'medium' },
      { label: 'Long (>10km)', value: 'long' },
    ],
  },
  {
    id: 'time',
    label: 'Time of Day',
    options: [
      { label: 'Any Time', value: 'any' },
      { label: 'Morning', value: 'morning' },
      { label: 'Afternoon', value: 'afternoon' },
      { label: 'Evening', value: 'evening' },
    ],
  },
  {
    id: 'proximity',
    label: 'Proximity',
    options: [
      { label: '1km', value: 1 },
      { label: '2km', value: 2 },
      { label: '3km', value: 3 },
      { label: '5km', value: 5 },
      { label: 'any', value: -1 }
    ],
  },
];
export default function Feed() {
  const [runs, setRuns] = useState<Run[]>([]);
  const [filter, setFilter] = useState<Filter | null>(null);
  // Get runs
  useEffect(() => {
    const fetchRuns = async () => {
      const { data, error } = await supabase.rpc('runs_nearby', {
        lat: test_region.latitude,
        lng: test_region.longitude,
        radius_m: 5000,
      });
      setRuns(data);
      // Handle data/error here
    };

    fetchRuns();
  }, [filter]);
  return (
    <>
      <Text style={styles.title}>Find runs</Text>
      <ScrollView style={runStyles.runsContainer} contentContainerStyle={runStyles.scrollContent} >
        {runs.map(run => (
          <View style={runStyles.runContainer}
            key={run.id}>
            <Text style={runStyles.title}
            >
              {run.title}
            </Text>
          </View>
        ))}
      </ScrollView>
      <View style={styles.filterContainer}>
        {filterOptions.map((config) => (
          <View key={config.id} style={styles.filterSection}>
            <Text style={styles.filterLabel}>{config.label}</Text>
            <Dropdown
              style={styles.filterItem}
              data={config.options}
              placeholderStyle={styles.dropPlaceholder}
              selectedTextStyle={styles.selectedTextStyle}
              labelField="label"
              valueField="value"
              placeholder={`Select ${config.label}`}
              value={'change'}
              dropdownPosition="top"
              onChange={(item) =>
                setFilter(prev => ({ ...prev, [config.id]: item.value }))
              }
            />
          </View>
        ))}
      </View>

    </>
  );
};
const runStyles = StyleSheet.create({
  runContainer: {
    backgroundColor: '#da7756',
    padding: 20,
    borderRadius: 30,
  },
  runsContainer: {
    flex: 1,
  },
  title: {
    color: "black",
  },
  scrollContent: {
    paddingBottom: 100,
  }
})
const styles = StyleSheet.create({
  title: {
    color: "white",
    backgroundColor: "#da7756",
    paddingTop: 50,
    fontSize: 50,
  },
  filterContainer: {
    position: "absolute",
    bottom: 0,
    flexDirection: 'row',
    backgroundColor: '#da7756',
    paddingVertical: 10,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  filterSection: {
    color: "white",
    flex: 1,
    marginHorizontal: 4,
  },
  filterLabel: {
    color: "white",
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
    textAlign: 'center',
  },
  filterItem: {
    color: 'white',
    backgroundColor: '#da7756',
    height: 60,
    borderRadius: 6,
    paddingHorizontal: 8,
    borderWidth: 0,
  },
  dropPlaceholder: {
    color: "white",
  },
  selectedTextStyle: {
    color: "white",
  },
});

