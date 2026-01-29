import { mainColor } from "@/constants/theme";
import { View, Text, StyleSheet } from "react-native";
export default function RunDisplay() {
  return (
    <View style={styles.mainContainer}>
      <Text>Run Display</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  mainContainer: {
    display: "flex",
    flexDirection: "column",
    left: "50%",
    top: "50%",
    transform: [{ translateX: -100 }, { translateY: -100 }],
    justifyContent: "center",
    borderWidth: 5,
    borderColor: mainColor,
    borderRadius: 10,
    alignItems: "center",
    position: "absolute",
    width: 200,
    height: 200,
    backgroundColor: "white",
  },
});
