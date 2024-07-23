import useSettingsStore from "@/stores/settings";
import { ColorScheme } from "@/util/colors";
import { useMemo } from "react";
import { View, Text, StyleSheet } from "react-native";

export type Props = {
  headerText: string;
  children?: React.ReactElement;
  row?: boolean;
};

export default function Group(props: Props) {
  const scheme = useSettingsStore((s) => s.colorScheme);
  const calcStyle = useMemo(
    () => calcStyles(scheme, props.row ?? false),
    [scheme, props.row],
  );

  return (
    <View style={[styles.container, calcStyle.container]}>
      <Text style={[styles.headerText, calcStyle.headerText]}>
        {props.headerText}
      </Text>
      <View style={[styles.children, calcStyle.children]}>
        {props.children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 5,
    gap: 8,
  },
  children: {
    gap: 10,
  },
  headerText: {
    fontSize: 22,
    textAlign: "center",
    fontFamily: "PermanentMarker",
  },
});

const calcStyles = (scheme: ColorScheme, row: boolean) =>
  StyleSheet.create({
    container: {
      backgroundColor: scheme.primary,
    },
    children: {
      flexDirection: row ? "row" : "column",
    },
    headerText: {
      color: scheme.loPrimary,
    },
  });
