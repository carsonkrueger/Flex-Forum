import Template from "@/components/workout/Template";
import useSettingsStore from "@/stores/settings";
import { ColorScheme } from "@/util/colors";
import { useMemo } from "react";
import { Text, View, StyleSheet } from "react-native";

export default function Page() {
  const scheme = useSettingsStore((state) => state.colorScheme);
  const calcStyle = useMemo(() => calcStyles(scheme), [scheme]);
  return (
    <View style={[styles.container, calcStyle.container]}>
      <Text style={[styles.headerText, calcStyle.headerText]}>My Workouts</Text>
      <Template id={0} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    gap: 8,
  },
  headerText: {
    fontFamily: "PermanentMarker",
    fontSize: 25,
  },
});

const calcStyles = (scheme: ColorScheme) =>
  StyleSheet.create({
    container: {
      backgroundColor: scheme.primary,
    },
    headerText: {
      color: scheme.tertiary,
    },
  });
