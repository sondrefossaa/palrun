import { View, Image, Text, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Feed() {
  return (
    <SafeAreaView style={styles.mainContainer}>
      <View style={styles.topContainer}>
        <View style={styles.helloCard}>
          <Image
            style={styles.logo}
            source={require("@/assets/images/Jog-logo-temp.png")}
          />
          <View style={styles.greeting}>
            <Text style={styles.greetingText}>Hello,</Text>
            <Text style={styles.nameText}>Sondre</Text>
          </View>
          <Text style={{ fontSize: 35, marginLeft: 15 }}>👋</Text>
          <Image
            style={styles.avatar}
            source={{
              uri: "https://i.pravatar.cc/150?img=7", // Temp url
            }}
          />
        </View>
      </View>
      <View style={styles.upcommingAndNewRunContainer}>
        <View style={styles.upcommingContainer}>
          <Text style={styles.upcommingText}>Upcoming Runs</Text>
          <View style={styles.upcommingList}>
            <Text style={styles.upcommingListItem}>Run 1</Text>
            <Text style={styles.upcommingListItem}>Run 2</Text>
            <Text style={styles.upcommingListItem}>Run 3</Text>
          </View>
          <TouchableOpacity onPress={() => console.log("Upcoming Runs")}>
            <Text style={styles.upcommingButtonText}>View All</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.newRunContainer}>
          <View>
            <Text style={styles.newRunText}>New Run</Text>
            <TouchableOpacity onPress={() => console.log("New Run")}>
              <View style={styles.plusButtonContainer}>
                <Text style={styles.plusButton}>+</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
const horPadding = 20;
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 10,
  },
  topContainer: {
    paddingHorizontal: horPadding,
  },
  helloCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  logo: {
    width: 50,
    height: 50,
    borderRadius: 30,
    marginRight: 16,
  },
  avatar: {
    right: 10,
    position: "absolute",
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  greeting: {
    flexDirection: "column",
  },
  greetingText: {
    fontSize: 16,
    color: "#666",
  },
  nameText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    marginTop: 4,
  },
});
