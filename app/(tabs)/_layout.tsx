import useSettingsStore from "@/stores/settings";
import { Slot, Stack, router, usePathname, useRouter } from "expo-router";
import { useMemo } from "react";
import { View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
// import useAuth from "@/hooks/useAuth";
import NavItem from "@/components/nav/NavItem";
import { Route, routes } from "@/util/routes";
import { Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import useUserStore from "@/stores/user";
import { StatusBar } from "expo-status-bar";
import { SQLiteProvider } from "expo-sqlite";
import { DATABASE_NAME } from "@/db/db";
import { migrateAll } from "@/db/migrate";

export default function Layout() {
  // useAuth();
  const scheme = useSettingsStore((state) => state.colorScheme);
  const calcStyle = useMemo(
    () => calcStyles(scheme.secondary, scheme.quaternary),
    [scheme],
  );
  const iconColor = scheme.tertiary;
  const setUserId = useUserStore((s) => s.setUsername);
  const router = useRouter();
  const pathname = usePathname();

  const navigateTo = (route: string) => {
    // if (pathname === route) return;
    if (pathname === routes.home && route !== routes.home) router.push(route);
    else if (route === routes.user) {
      router.dismissAll();
      router.replace(routes.login);
    } else router.navigate(route);
  };

  return (
    <SafeAreaView style={styles.container}>
      <SQLiteProvider databaseName={DATABASE_NAME} onInit={migrateAll}>
        <StatusBar backgroundColor={scheme.primary} />
        {/* <Slot initialRouteName={routes.home} /> */}
        <Stack
          screenOptions={{ headerShown: false, animation: "fade_from_bottom" }}
        >
          <Stack.Screen name="home" />
          <Stack.Screen name="workout/[id]" />
          <Stack.Screen name="workout/templates" />
        </Stack>
        <View style={[styles.navContainer, calcStyle.navContainer]}>
          <NavItem
            icon={<Ionicons name="home" size={30} color={iconColor} />}
            onPress={() => navigateTo(routes.home)}
          />

          <NavItem
            icon={<Ionicons name="search" size={30} color={iconColor} />}
            onPress={() => navigateTo(routes.home)}
          />

          <View style={styles.navCenterContainer}>
            <NavItem
              style={[styles.navCenter, calcStyle.navCenter]}
              onPress={() => navigateTo(routes.templates)}
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
            icon={
              <Ionicons name="settings-sharp" size={30} color={iconColor} />
            }
            onPress={() => navigateTo(routes.home)}
          />

          <NavItem
            icon={<Ionicons name="person" size={30} color={iconColor} />}
            onPress={() => {
              setUserId(undefined);
              navigateTo(routes.user);
            }}
          />
        </View>
      </SQLiteProvider>
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
