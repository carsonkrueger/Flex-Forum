import useSettingsStore from "@/stores/settings";
import { StatusBar } from "react-native";

export default function Layout() {
  const scheme = useSettingsStore((s) => s.colorScheme);
  return <StatusBar backgroundColor={scheme.primary} />;
}
