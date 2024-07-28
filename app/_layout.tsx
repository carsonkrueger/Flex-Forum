import useSettingsStore from "@/stores/settings";
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
    Oswald: require("../assets/fonts/Oswald-VariableFont_wght.ttf"),
  });
  const scheme = useSettingsStore((state) => state.colorScheme);

  useEffect(() => {
    NavigationBar.setBackgroundColorAsync(scheme.primary);
  }, [scheme]);

  if (!fontsLoaded)
    return <Text style={{ backgroundColor: scheme.primary }}>Loading</Text>;

  return (
    <QueryClientProvider client={queryClient}>
      <StatusBar backgroundColor={scheme.primary} />
      <Stack screenOptions={{ headerShown: false, animation: "ios" }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="signup" />
      </Stack>
    </QueryClientProvider>
  );
}
