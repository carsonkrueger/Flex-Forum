import Group from "@/components/general/Group";
import ColorSchemeIcon from "@/components/icons/ColorSchemeIcon";
import useSettingsStore from "@/stores/settings";
import useUserStore from "@/stores/user";
import {
  ColorScheme,
  DarkBlueColorScheme,
  MainColorScheme,
} from "@/util/colors";
import { routes } from "@/util/routes";
import { useRouter } from "expo-router";
import { useMemo, useRef } from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";

export default function Page() {
  const router = useRouter();
  const scheme = useSettingsStore((s) => s.colorScheme);
  const calcStyle = useMemo(() => calcStyles(scheme), [scheme]);
  const resetUser = useUserStore((s) => s.logOut);

  const logOut = () => {
    resetUser();
    router.dismissAll();
    router.replace(routes.login);
  };

  return (
    <View style={[styles.container, calcStyle.container]}>
      <Group headerText="Color Scheme" row={true}>
        <>
          <ColorSchemeIcon scheme={MainColorScheme} />
          <ColorSchemeIcon scheme={DarkBlueColorScheme} />
        </>
      </Group>
      <TouchableOpacity onPress={logOut}>
        <Text>Log Out</Text>
      </TouchableOpacity>
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
