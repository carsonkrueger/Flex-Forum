import useUserStore from "@/stores/user";
import { useMemo } from "react";
import { View, StyleSheet, Dimensions } from "react-native";

export default function Post() {
  const scheme = useUserStore((state) => state.colorScheme);
  const calcStyle = useMemo(
    () => calcStyles(scheme.quaternary, Dimensions.get("screen").width),
    [scheme],
  );

  return <View style={[styles.image, calcStyle.image]} />;
}

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: "100%",
  },
});

const calcStyles = (color: string, maxWidth: number) =>
  StyleSheet.create({
    image: {
      // backgroundColor: color,
      borderColor: color,
      borderWidth: 1.5,
      maxWidth: maxWidth,
      maxHeight: maxWidth * 1.2,
    },
  });
