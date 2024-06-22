import Post from "@/components/post/Post";
import { PostModel, downloadNextFivePosts } from "@/models/post-model";
import useSettingsStore from "@/stores/settings";
import { FlashList } from "@shopify/flash-list";
import { useMemo, useState } from "react";
import { Text, StyleSheet, View, Dimensions } from "react-native";

export default function Page() {
  const scheme = useSettingsStore((state) => state.colorScheme);
  const calcStyle = useMemo(() => calcStyles(scheme.primary), [scheme]);
  const [postModels, setPostModels] = useState<PostModel[]>([]);
  const windowWidth = Dimensions.get("window").width;
  const lastDate: string = "2024-06-06T19:49:01.727 -0000";

  const handleEndReached = async () => {
    let posts = await downloadNextFivePosts(lastDate);
    setPostModels(posts);
  };

  return (
    <View style={[styles.container, calcStyle.container]}>
      <Text>home</Text>
      <FlashList
        data={postModels}
        renderItem={({ item }) => <Post postModel={item} width={windowWidth} />}
        estimatedItemSize={500}
        onEndReached={handleEndReached}
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
