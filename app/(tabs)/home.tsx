import Post from "@/components/post/Post";
import PostImage from "@/components/post/PostImage";
import useUserStore from "@/stores/user";
import { FlashList } from "@shopify/flash-list";
import { useMemo } from "react";
import { Text, StyleSheet } from "react-native";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Page() {
  const scheme = useUserStore((state) => state.colorScheme);
  const calcStyle = useMemo(() => calcStyles(scheme.primary), [scheme]);
  const data = [1, 2, 3, 4, 5, 6, 7, 8];

  return (
    <SafeAreaView style={[styles.container, calcStyle.container]}>
      <Text>home</Text>
      <FlashList
        data={data}
        renderItem={() => <Post />}
        estimatedItemSize={500}
      />
    </SafeAreaView>
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
