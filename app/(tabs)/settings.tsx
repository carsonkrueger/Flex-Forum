import Group from "@/components/general/Group";
import SettingsRow from "@/components/general/SettingsRow";
import ColorSchemeIcon from "@/components/icons/ColorSchemeIcon";
import useSettingsStore from "@/stores/settings";
import useUserStore from "@/stores/user";
import { Feather } from "@expo/vector-icons";
import {
  allColorSchemes,
  ColorScheme,
  DarkBlueColorScheme,
  MainColorScheme,
} from "@/util/colors";
import { ROUTES } from "@/util/routes";
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
    router.replace(ROUTES.login);
  };

  return (
    <View style={[styles.container, calcStyle.container]}>
      <Group headerText="Preferences">
        <>
          <SettingsRow useChevron={false} justifyContent={"flex-start"}>
            <>
              {/* <ColorSchemeIcon scheme={MainColorScheme} />
              <ColorSchemeIcon scheme={DarkBlueColorScheme} /> */}
              {allColorSchemes.map((sch, i) => (
                <ColorSchemeIcon scheme={sch} key={`scheme.${i}`} />
              ))}
            </>
          </SettingsRow>
        </>
      </Group>
      <Group headerText="Account">
        <SettingsRow
          text="Logout"
          onPress={logOut}
          icon={<Feather name="log-out" size={25} color={scheme.quaternary} />}
        />
      </Group>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
    flex: 1,
    gap: 15,
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
