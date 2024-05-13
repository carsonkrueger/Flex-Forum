import { Slot, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export const unstable_settings = {
  initialRouteName: "login"
}

export default function Layout() {
  return (
    <>
      <StatusBar />
      <Stack initialRouteName="login" screenOptions={{headerShown: false}} >
        <Stack.Screen name="index"  />
        <Stack.Screen name="login" />
      </Stack>
    </>
  );
}
