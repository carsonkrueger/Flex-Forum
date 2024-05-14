import Button, { ButtonVariant } from "@/forms/Submit";
import useUserStore from "@/stores/user";
import { useFonts } from "expo-font";
import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";

export default function Page() {
  const [fontsLoaded, fontsError] = useFonts({
    PermanentMarker: require("../assets/fonts/PermanentMarker-Regular.ttf"),
  });

  const router = useRouter();
  const scheme = useUserStore((state) => state.colorScheme);
  return (
    <View style={styles.container}>
      <Button
        btnProps={{
          variant: ButtonVariant.Outline,
          primaryColor: scheme.quaternary,
          secondaryColor: scheme.quaternary,
          text: "Login",
        }}
        touchableProps={{ onPress: () => router.replace("/login") }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 24,
  },
});
