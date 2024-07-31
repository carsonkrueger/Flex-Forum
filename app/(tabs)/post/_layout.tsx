import useSettingsStore from "@/stores/settings";
import { Slot } from "expo-router";
import { StatusBar, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Layout() {
  const scheme = useSettingsStore((s) => s.colorScheme);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={scheme.primary} />
      <Slot />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "none",
  },
});
