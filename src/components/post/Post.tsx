import useUserStore from "@/stores/user";
import { useMemo } from "react";
import { Text, View, StyleSheet } from "react-native";
import PostImage from "./PostImage";

export default function Post() {
  const scheme = useUserStore((state) => state.colorScheme);
  const calcStyle = useMemo(() => calcStyles(), [scheme]);

  return (
    <View style={[styles.container, calcStyle.container]}>
      <Text style={styles.header}>Post</Text>
      <PostImage />
      <Text style={styles.header}>Post end</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    maxHeight: 550,
    // flex: 1,
  },
  header: {},
});

const calcStyles = () =>
  StyleSheet.create({
    container: {},
  });
