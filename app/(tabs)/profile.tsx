import { useAuth } from "@/contexts/AuthContext";
import { Text, View, Image, StyleSheet } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useThemeColor } from "@/hooks/use-theme-color";

export default function Profile() {
  const { user } = useAuth();

  // Create dynamic styles using the hook
  const dynamicStyles = useDynamicStyles();

  return (
    <SafeAreaProvider>
      <View style={dynamicStyles.mainContainer}>
        <View style={dynamicStyles.topContainer}>
          <View style={dynamicStyles.topLeftContainer}>
            <Text style={dynamicStyles.greetingText}>
              Hello {user.user_metadata.name.split(" ")[0]}
            </Text>
          </View>
          <View style={dynamicStyles.topRightContainer}>
            <Image
              source={{ uri: user.user_metadata.avatar_url }}
              style={dynamicStyles.profilePicture}
            />
          </View>
        </View>
      </View>
    </SafeAreaProvider>
  );
}

// Custom hook that uses useThemeColor
function useDynamicStyles() {
  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const tintColor = useThemeColor({}, "tint");

  const styles = StyleSheet.create({
    mainContainer: {
      backgroundColor: backgroundColor,
      flex: 1,
    },
    topContainer: {
      flexDirection: "row",
      paddingHorizontal: 20,
      paddingTop: 30,
      justifyContent: "space-between",
      alignItems: "center",
      height: 50,
    },
    topRightContainer: {},
    topLeftContainer: {},

    greetingText: {
      color: textColor,
      fontSize: 16,
      fontWeight: "bold",
    },
    profilePicture: {
      borderRadius: 90,
      width: 50,
      height: 50,
      borderWidth: 2,
      borderColor: tintColor,
    },
  });

  return styles;
}
