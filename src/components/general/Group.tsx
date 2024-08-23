import useSettingsStore from "@/stores/settings";
import { ColorScheme } from "@/util/colors";
import { useMemo } from "react";
import { View, Text, StyleSheet } from "react-native";

export type Props = {
  headerText: string;
  children?: React.ReactElement;
  row?: boolean;
  useDivider?: boolean;
};

export default function Group({ useDivider = true, ...props }: Props) {
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
      {useDivider !== undefined && useDivider && (
        <View style={[styles.divider, calcStyle.divider]} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 5,
    gap: 8,
    borderRadius: 15,
  },
  children: {
    gap: 10,
  },
  headerText: {
    fontSize: 22,
    // textAlign: "center",
    paddingHorizontal: 10,
    fontFamily: "Oswald",
  },
  divider: {
    marginTop: 8,
    width: "95%",
    height: 1.5,
    alignSelf: "center",
    borderRadius: 20,
  },
});

const calcStyles = (scheme: ColorScheme, row: boolean) =>
  StyleSheet.create({
    container: {
      // backgroundColor: scheme.hiPrimary,
    },
    children: {
      flexDirection: row ? "row" : "column",
    },
    headerText: {
      color: scheme.quaternary,
    },
    divider: {
      backgroundColor: scheme.loPrimary,
    },
  });
