import FlexForumIcon from "@/components/icons/flex-forum-icon";
import Post from "@/components/post/Post";
import { PostModel, downloadNextPosts } from "@/models/post-model";
import useSettingsStore from "@/stores/settings";
import { ColorScheme } from "@/util/colors";
import { FlashList } from "@shopify/flash-list";
import { useMemo, useState } from "react";
import { Image, Text, StyleSheet, View, Dimensions } from "react-native";

export default function Page() {
  const scheme = useSettingsStore((state) => state.colorScheme);
  const calcStyle = useMemo(() => calcStyles(scheme), [scheme]);
  const [postCards, setPostCards] = useState<PostModel[]>([]);
  const windowWidth = Dimensions.get("window").width;
  const lastDate: string = "2024-07-30T19:49:01.727 -0000";

  const handleEndReached = async () => {
    let posts = await downloadNextPosts(lastDate);
    setPostCards(posts);
  };

  return (
    <View style={[styles.container, calcStyle.container]}>
      <View style={styles.header}>
        <FlexForumIcon fill={scheme.quaternary} />
        <Text style={[styles.headerText, calcStyle.headerText]}>
          Flex Forum
        </Text>
      </View>
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
  header: {
    flexDirection: "row",
    gap: 10,
    paddingVertical: 7,
    paddingHorizontal: 10,
  },
  headerText: {
    fontFamily: "PermanentMarker",
    fontSize: 15,
  },
});

const calcStyles = (scheme: ColorScheme) =>
  StyleSheet.create({
    container: {
      backgroundColor: scheme.primary,
    },
    headerText: {
      color: scheme.quaternary,
    },
  });
