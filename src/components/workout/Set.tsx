import useSetStore from "@/stores/sets";
import useSettingsStore from "@/stores/settings";
import { Id } from "@/stores/workout";
import { ColorScheme } from "@/util/colors";
import { useMemo } from "react";
import { Text, View, StyleSheet } from "react-native";

export type Props = {
  id: Id;
};

export default function Set({ id }: Props) {
  const scheme = useSettingsStore((state) => state.colorScheme);
  const calcStyle = useMemo(() => calcStyles(scheme), [scheme]);
  const set = useSetStore((s) => s.sets[id]);

  return (
    <View style={[styles.container, calcStyle.container]}>
      <Text>{set.id}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
  },
});

const calcStyles = (scheme: ColorScheme) =>
  StyleSheet.create({
    container: {
      backgroundColor: scheme.quaternary,
    },
    text: {
      color: scheme.primary,
    },
  });
