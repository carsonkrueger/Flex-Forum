import Group from "@/components/general/Group";
import ColorSchemeIcon from "@/components/icons/ColorSchemeIcon";
import useSettingsStore from "@/stores/settings";
import {
  ColorScheme,
  DarkBlueColorScheme,
  MainColorScheme,
} from "@/util/colors";
import { useMemo, useRef } from "react";
import { View, StyleSheet } from "react-native";

export default function Page() {
  const scheme = useSettingsStore((s) => s.colorScheme);
  const calcStyle = useMemo(() => calcStyles(scheme), [scheme]);

  return (
    <View style={[styles.container, calcStyle.container]}>
      <Group headerText="Color Scheme" row={true}>
        <>
          <ColorSchemeIcon scheme={MainColorScheme} />
          <ColorSchemeIcon scheme={DarkBlueColorScheme} />
        </>
      </Group>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
    flex: 1,
    gap: 10,
  },
  headerText: {
    fontFamily: "PermanentMarker",
  },
});

const calcStyles = (scheme: ColorScheme) =>
  StyleSheet.create({
    container: {
      backgroundColor: scheme.primary,
    },
    headerText: {
      color: scheme.loPrimary,
    },
  });
