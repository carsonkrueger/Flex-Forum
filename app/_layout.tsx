import useSettingsStore from "@/stores/settings";
import { Slot, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import * as NavigationBar from "expo-navigation-bar";

export default function Layout() {
  const scheme = useSettingsStore((state) => state.colorScheme);

  useEffect(() => {
    NavigationBar.setBackgroundColorAsync(scheme.primary);
  }, [scheme]);

  return (
    <>
      <StatusBar />
      <Stack initialRouteName="login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
      </Stack>
    </>
  );
}
