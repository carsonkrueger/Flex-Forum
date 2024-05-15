import Post from "@/components/Post";
import useUserStore from "@/stores/user";
import { useMemo } from "react";
import { Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Page() {
  const scheme = useUserStore((state) => state.colorScheme);
  const calcStyle = useMemo(() => calcStyles(scheme.primary), [scheme]);

  return (
    <SafeAreaView style={[styles.container, calcStyle.container]}>
      <Text>home</Text>

      <Post />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    gap: 15,
  },
});

const calcStyles = (bgColor: string) =>
  StyleSheet.create({
    container: {
      backgroundColor: bgColor,
    },
  });
