import Post from "@/components/post/Post";
import { PostModel, downloadNextPosts } from "@/models/post-model";
import useSettingsStore from "@/stores/settings";
import { FlashList } from "@shopify/flash-list";
import { useMemo, useState } from "react";
import { Text, StyleSheet, View, Dimensions } from "react-native";

export default function Page() {
  const scheme = useSettingsStore((state) => state.colorScheme);
  const calcStyle = useMemo(() => calcStyles(scheme.primary), [scheme]);
  const [postCards, setPostCards] = useState<PostModel[]>([]);
  const windowWidth = Dimensions.get("window").width;
  const lastDate: string = "2024-07-23T19:49:01.727 -0000";

  const handleEndReached = async () => {
    let posts = await downloadNextPosts(lastDate);
    setPostCards(posts);
  };

  return (
    <View style={[styles.container, calcStyle.container]}>
      <Text>home</Text>
      <FlashList
        data={postCards}
        renderItem={({ item }) => (
          <Post key={`post.${item.id}`} postModel={item} width={windowWidth} />
        )}
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
