import useUserStore from "@/stores/user";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { Text } from "react-native";
import * as NavigationBar from "expo-navigation-bar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";

const queryClient = new QueryClient();

export default function Layout() {
  const [fontsLoaded] = useFonts({
    PermanentMarker: require("../assets/fonts/PermanentMarker-Regular.ttf"),
  });
  const scheme = useUserStore((state) => state.colorScheme);

  useEffect(() => {
    NavigationBar.setBackgroundColorAsync(scheme.primary);
  }, [scheme]);

  if (!fontsLoaded)
    return <Text style={{ backgroundColor: scheme.primary }}>Loading</Text>;

  return (
    <QueryClientProvider client={queryClient}>
      <StatusBar />
      <Stack screenOptions={{ headerShown: false, animation: "ios" }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="signup" />
      </Stack>
    </QueryClientProvider>
  );
}
