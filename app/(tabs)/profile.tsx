import { useAuth } from "@/contexts/AuthContext";
import {
  Text,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";
import { useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useThemeColor } from "@/hooks/use-theme-color";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
export default function Profile() {
  const { user } = useAuth();
  const [canEditDesc, setCanEditDesc] = useState(false);
  // Create dynamic styles using the hook
  const dynamicStyles = useDynamicStyles();

  return (
    <SafeAreaProvider>
      <ScrollView>
        <View style={dynamicStyles.mainContainer}>
          <View style={dynamicStyles.topContainer}>
            <View style={dynamicStyles.topLeftContainer}>
              <Text style={dynamicStyles.greetingText}>
                {"Hello "}
                <Text style={dynamicStyles.nameText}>
                  {user.user_metadata.name.split(" ")[0]}
                </Text>
              </Text>
            </View>
            <View style={dynamicStyles.topRightContainer}>
              <Image
                source={{ uri: user.user_metadata.avatar_url }}
                style={dynamicStyles.profilePicture}
              />
            </View>
          </View>
          {/*<View>
            <Text>
              undertitle
            </Text>
          </View>*/}
          <View style={dynamicStyles.highlightsContainer}>
            <View style={dynamicStyles.highlight}>
              <MaterialCommunityIcons
                name="map-marker-distance"
                size={24}
                color="green"
              />
              <Text style={dynamicStyles.highlightValue}>5k</Text>
            </View>
            <View style={dynamicStyles.highlight}>
              <MaterialIcons name="speed" size={24} color="black" />
              <Text style={dynamicStyles.highlightValue}>5min/km</Text>
            </View>
            <View style={dynamicStyles.highlight}>
              <Text style={dynamicStyles.highlightValue}>casual</Text>
            </View>
          </View>
          <View style={dynamicStyles.midContainer}>
            <View style={dynamicStyles.descriptionContainer}>
              <TouchableOpacity style={dynamicStyles.editButton}>
                <FontAwesome6 name="pen" size={24} color="black" />
              </TouchableOpacity>
              <Text style={dynamicStyles.descriptionTitle}>
                <AntDesign name="exclamation-circle" size={24} color="black" />{" "}
                About me
              </Text>
              <TextInput
                style={dynamicStyles.descriptionText}
                editable={canEditDesc}
                placeholder="Write a short description about yourself"
              >
                {user.user_metadata.description}
              </TextInput>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaProvider>
  );
}

// Custom hook that uses useThemeColor
function useDynamicStyles() {
  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const tintColor = useThemeColor({}, "tint");

  const styles = StyleSheet.create({
    highlightsContainer: {
      backgroundColor: backgroundColor,
      height: 100,
      borderColor: "black",
      borderWidth: 1,
      borderRadius: 10,
      flexDirection: "row",
    },
    highlight: {
      flex: 1,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      borderRightWidth: 1,
      borderRightColor: "black",
    },
    highlightTitle: {
      maxWidth: 100,
      textAlign: "center",
      color: textColor,
      fontSize: 16,
      fontWeight: "bold",
    },
    highlightValue: {
      color: textColor,
      fontSize: 16,
    },
    editButton: {
      position: "absolute",
      right: 10,
      top: 10,
    },
    midContainer: {
      backgroundColor: backgroundColor,
      //TODO: change this to be dependant on text size
      flex: 0.5,
      marginTop: 50,
      borderColor: "black",
      borderWidth: 1,
      borderRadius: 10,
      padding: 10,
      flexDirection: "column",
    },
    descriptionTitle: {
      color: textColor,
      fontSize: 16,
      alignSelf: "stretch",
      fontWeight: "bold",
    },
    descriptionText: {
      color: textColor,
      fontSize: 16,
    },
    descriptionContainer: {
      backgroundColor: "red",
      flex: 1,
    },

    mainContainer: {
      backgroundColor: backgroundColor,
      flex: 1,
    },

    greetingText: {
      color: textColor,
      fontSize: 16,
      fontWeight: "bold",
    },
    nameText: {
      color: "green",
      fontSize: 16,
      fontWeight: "bold",
    },
    topContainer: {
      borderColor: tintColor,
      borderWidth: 1,
      borderRadius: 10,
      padding: 10,
      flexDirection: "row",
      paddingHorizontal: 20,
      marginTop: 30,
      marginHorizontal: 15,
      justifyContent: "space-between",
      alignItems: "center",
      height: 80,
    },
    topRightContainer: {},
    topLeftContainer: {},

    profilePicture: {
      borderRadius: 10,
      width: 50,
      height: 50,
      borderWidth: 2,
      borderColor: tintColor,
    },
  });

  return styles;
}
