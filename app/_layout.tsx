import useUserStore from "@/stores/user";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import * as NavigationBar from "expo-navigation-bar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function Layout() {
  const scheme = useUserStore((state) => state.colorScheme);

  useEffect(() => {
    NavigationBar.setBackgroundColorAsync(scheme.primary);
  }, [scheme]);

  return (
    <QueryClientProvider client={queryClient}>
      <StatusBar />
      <Stack initialRouteName="login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
      </Stack>
    </QueryClientProvider>
  );
}
