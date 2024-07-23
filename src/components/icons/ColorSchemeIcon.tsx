import useSettingsStore from "@/stores/settings";
import { ColorScheme } from "@/util/colors";
import { useEffect, useMemo } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";

export type Props = {
  scheme: ColorScheme;
};

export default function ColorSchemeIcon(props: Props) {
  const scheme = useSettingsStore((state) => state.colorScheme);
  const setScheme = useSettingsStore((state) => state.setColorScheme);
  const calcStyle = useMemo(
    () => calcStyles(props.scheme, scheme),
    [props.scheme, scheme],
  );

  const onClick = () => {
    setScheme(props.scheme);
  };

  return (
    <TouchableOpacity
      onPress={onClick}
      style={[styles.container, calcStyle.container]}
    >
      <View style={[styles.color, calcStyle.colorOne]} />
      <View style={[styles.color, calcStyle.colorTwo]} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 500,
    overflow: "hidden",
    height: 40,
    width: 40,
    borderWidth: 2,
    flexDirection: "row",
  },
  color: {
    flex: 1,
  },
});

const calcStyles = (scheme: ColorScheme, chosenScheme: ColorScheme) =>
  StyleSheet.create({
    container: {
      borderColor: chosenScheme === scheme ? scheme.tertiary : scheme.secondary,
    },
    colorOne: {
      backgroundColor: scheme.primary,
    },
    colorTwo: {
      backgroundColor: scheme.quaternary,
    },
  });
