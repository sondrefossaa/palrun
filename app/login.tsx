import { View, Text, StyleSheet, Alert } from "react-native";
import { GoogleSigninButton } from "@react-native-google-signin/google-signin";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginScreen() {
  const { signInWithGoogle } = useAuth();

  // REMOVE the useEffect - no redirect logic here

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      Alert.alert("Error", "Sign in failed. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome</Text>
      <Text style={styles.subtitle}>Sign in to continue</Text>

      <GoogleSigninButton
        size={GoogleSigninButton.Size.Wide}
        color={GoogleSigninButton.Color.Dark}
        onPress={handleGoogleSignIn}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 40,
  },
});
