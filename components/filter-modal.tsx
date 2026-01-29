import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { mainColor } from "@/constants/theme";
import { Filter } from "@/types";

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  currentFilters: Filter | null;
  onApply: (filters: Filter) => void;
}

const filterOptions = [
  {
    id: "distance",
    label: "Distance",
    options: [
      { label: "All", value: "all" },
      { label: "< 5km", value: "short" },
      { label: "5-10km", value: "medium" },
      { label: "> 10km", value: "long" },
    ],
  },
  {
    id: "time",
    label: "Time of Day",
    options: [
      { label: "Any", value: "any" },
      { label: "Morning", value: "morning" },
      { label: "Afternoon", value: "afternoon" },
      { label: "Evening", value: "evening" },
    ],
  },
  {
    id: "proximity",
    label: "Proximity",
    options: [
      { label: "Any", value: -1 },
      { label: "1km", value: 1 },
      { label: "2km", value: 2 },
      { label: "3km", value: 3 },
      { label: "5km", value: 5 },
    ],
  },
];

export default function FilterModal({
  visible,
  onClose,
  currentFilters,
  onApply,
}: FilterModalProps) {
  const [tempFilters, setTempFilters] = useState<any>({});

  useEffect(() => {
    if (visible) {
      setTempFilters(currentFilters || {});
    }
  }, [visible, currentFilters]);

  const handleSelect = (category: string, value: any) => {
    setTempFilters((prev: any) => ({
      ...prev,
      [category]: value,
    }));
  };

  const handleApply = () => {
    onApply(tempFilters);
    onClose();
  };

  const handleClear = () => {
    setTempFilters({});
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Filter Runs</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}
          >
            {filterOptions.map((section) => (
              <View key={section.id} style={styles.section}>
                <Text style={styles.sectionTitle}>{section.label}</Text>
                <View style={styles.optionsContainer}>
                  {section.options.map((option) => {
                    const isSelected =
                      tempFilters[section.id] === option.value ||
                      (!tempFilters[section.id] &&
                        (option.value === "all" ||
                          option.value === "any" ||
                          option.value === -1));

                    return (
                      <TouchableOpacity
                        key={String(option.value)}
                        style={[
                          styles.optionChip,
                          isSelected && styles.optionChipSelected,
                        ]}
                        onPress={() => handleSelect(section.id, option.value)}
                      >
                        <Text
                          style={[
                            styles.optionText,
                            isSelected && styles.optionTextSelected,
                          ]}
                        >
                          {option.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            ))}
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
              <Text style={styles.clearButtonText}>Clear All</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
              <Text style={styles.applyButtonText}>Show Runs</Text>
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
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
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
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1a1a1a",
  },
  closeButton: {
    padding: 4,
  },
  content: {
    flexShrink: 1,
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  optionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  optionChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#f5f5f5",
    borderWidth: 1,
    borderColor: "#eee",
  },
  optionChipSelected: {
    backgroundColor: mainColor,
    borderColor: mainColor,
  },
  optionText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  optionTextSelected: {
    color: "white",
    fontWeight: "600",
  },
  footer: {
    flexDirection: "row",
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    gap: 16,
  },
  clearButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    alignItems: "center",
    justifyContent: "center",
  },
  clearButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
  },
  applyButton: {
    flex: 2,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: mainColor,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: mainColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
  },
});
