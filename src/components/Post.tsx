import useUserStore from "@/stores/user";
import { useMemo } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";

export default function Post() {
  const scheme = useUserStore((state) => state.colorScheme);
  const calcStyle = useMemo(
    () =>
      calcStyles(
        scheme.quaternary,
        Dimensions.get("window").width,
        Dimensions.get("screen").width,
      ),
    [scheme],
  );

  return (
    <View style={[styles.container, calcStyle.container]}>
      <Text>post</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderWidth: 1.5,
    borderRadius: 15,
    aspectRatio: 1,
    maxWidth: 400,
    maxHeight: 400,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
});

const calcStyles = (color: string, height: number, maxWidth: number) =>
  StyleSheet.create({
    container: {
      borderColor: color,
      height: height,
      maxWidth: maxWidth,
    },
  });
