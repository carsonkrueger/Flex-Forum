import Post from "@/components/post/Post";
import useSettingsStore from "@/stores/settings";
import { FlashList } from "@shopify/flash-list";
import { useMemo } from "react";
import { Text, StyleSheet, View, Dimensions } from "react-native";

export default function Page() {
  const scheme = useSettingsStore((state) => state.colorScheme);
  const calcStyle = useMemo(() => calcStyles(scheme.primary), [scheme]);
  const data = [1, 2, 3, 4, 5, 6, 7, 8];
  const windowWidth = Dimensions.get("window").width;
  // const data = [1];

  return (
    <View style={[styles.container, calcStyle.container]}>
      <Text>home</Text>
      <FlashList
        data={data}
        renderItem={() => <Post width={windowWidth} />}
        estimatedItemSize={500}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

const calcStyles = (bgColor: string) =>
  StyleSheet.create({
    container: {
      backgroundColor: bgColor,
    },
  });
