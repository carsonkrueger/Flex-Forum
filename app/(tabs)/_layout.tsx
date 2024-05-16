import useSettingsStore from "@/stores/settings";
import { Slot, router } from "expo-router";
import { useEffect, useMemo } from "react";
import { View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import useAuth from "@/hooks/useAuth";
import NavItem from "@/components/nav/NavItem";
import { routes } from "@/util/routes";
import { Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import useUserStore from "@/stores/user";

export default function Layout() {
  // useAuth();
  const scheme = useSettingsStore((state) => state.colorScheme);
  const setUserId = useUserStore((state) => state.setUserId);
  const calcStyle = useMemo(
    () => calcStyles(scheme.secondary, scheme.quaternary),
    [scheme],
  );
  const iconColor = scheme.quaternary;

  return (
    <SafeAreaView style={styles.container}>
      <Slot initialRouteName={routes.home} />
      <View style={[styles.navContainer, calcStyle.navContainer]}>
        <NavItem
          icon={<Ionicons name="home" size={30} color={iconColor} />}
          onPress={() => router.navigate(routes.home)}
        />

        <NavItem
          icon={<Ionicons name="search" size={30} color={iconColor} />}
          onPress={() => router.navigate(routes.home)}
        />

        <View style={styles.navCenterContainer}>
          <NavItem
            style={[styles.navCenter, calcStyle.navCenter]}
            onPress={() => router.navigate(routes.workout)}
            icon={
              <MaterialCommunityIcons
                name="weight-lifter"
                size={30}
                color={scheme.primary}
              />
            }
            activeOpacity={1}
          />
        </View>

        <NavItem
          icon={<Ionicons name="settings-sharp" size={30} color={iconColor} />}
          onPress={() => router.navigate(routes.home)}
        />

        <NavItem
          icon={<Ionicons name="person" size={30} color={iconColor} />}
          onPress={() => router.navigate(routes.login)}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "none",
  },
  navContainer: {
    alignSelf: "center",
    borderRadius: 25,
    maxWidth: "97%",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: "100%",
    height: 50,
    position: "absolute",
    bottom: 6,
  },
  navCenterContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 6,
  },
  navCenter: {
    borderRadius: 100,
    position: "absolute",
    bottom: -4,
    padding: 12,
  },
});

const calcStyles = (navBgColor: string, centerbgColor: string) =>
  StyleSheet.create({
    navContainer: {
      backgroundColor: navBgColor,
    },
    navCenter: {
      backgroundColor: centerbgColor,
    },
  });
