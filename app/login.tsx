import Submit, { ButtonVariant } from "@/forms/Submit";
import useSettingsStore from "@/stores/settings";
import { useRouter } from "expo-router";
import { useMemo } from "react";
import { StyleSheet, View } from "react-native";

export default function Page() {
  const router = useRouter();
  const scheme = useSettingsStore((state) => state.colorScheme);

  const calcStyle = useMemo(() => calcStyles(scheme.primary), [scheme]);

  return (
    <View style={[styles.container, calcStyle.container]}>
      <Submit
        btnProps={{
          variant: ButtonVariant.Filled,
          primaryColor: scheme.quaternary,
          secondaryColor: scheme.primary,
          text: "Log in",
        }}
        touchableProps={{ onPress: () => router.replace("/") }}
      />

      <Submit
        btnProps={{
          variant: ButtonVariant.Outline,
          primaryColor: scheme.quaternary,
          secondaryColor: scheme.quaternary,
          text: "Sign up",
        }}
        touchableProps={{ onPress: () => router.replace("/") }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    gap: 20,
    padding: 10,
  },
});

const calcStyles = (bgColor: string) =>
  StyleSheet.create({
    container: {
      backgroundColor: bgColor,
    },
  });
