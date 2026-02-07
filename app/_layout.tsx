import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { useRouter, useSegments } from "expo-router";
import "react-native-reanimated";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";

export const unstable_settings = {
  anchor: "(tabs)",
};

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const segments = useSegments();
  const router = useRouter();
  const { isLoggedIn, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === "(tabs)";
    const inLoginScreen = segments[0] === "login" || segments.length === 0;

    console.log("Redirect check:", {
      isLoggedIn,
      inAuthGroup,
      inLoginScreen,
      segments: segments.join("/"),
    });

    if (!isLoggedIn && inAuthGroup) {
      // User not logged in but trying to access protected route
      console.log("→ Redirecting to /login");
      router.replace("/login");
    } else if (isLoggedIn && inLoginScreen) {
      // User is logged in but on login screen
      console.log("→ Redirecting to /(tabs)");
      router.replace("/(tabs)");
    }
  }, [isLoggedIn, segments, isLoading]);

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="modal"
          options={{ presentation: "modal", title: "Modal" }}
        />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}
