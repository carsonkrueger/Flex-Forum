import FlexForumIcon from "@/components/icons/flex-forum-icon";
import Post from "@/components/post/Post";
import CircularButton from "@/forms/CircularButton";
import { PostModel, downloadNextPosts } from "@/models/post-model";
import usePostStore from "@/stores/posts";
import useSettingsStore from "@/stores/settings";
import { ColorScheme } from "@/util/colors";
import { FlashList } from "@shopify/flash-list";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Image, Text, StyleSheet, View, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SizeVariant } from "@/util/variants";
import { useRouter } from "expo-router";

export default function Page() {
  const router = useRouter();
  const scheme = useSettingsStore((state) => state.colorScheme);
  const calcStyle = useMemo(() => calcStyles(scheme), [scheme]);
  const [postCards, setPostCards] = useState<PostModel[]>([]);
  const windowWidth = Dimensions.get("window").width;
  const lastDate: string = "2024-07-30T19:49:01.727 -0000";
  const addPosts = usePostStore((s) => s.addPosts);

  const handleEndReached = async () => {
    let posts = await downloadNextPosts(lastDate);
    addPosts(posts);
    setPostCards(posts);
  };

  const createNewPost = () => {
    router.push("post/new");
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
      <CircularButton
        backgroundColor={scheme.quaternary}
        size={SizeVariant.XL}
        style={styles.newPost}
        onPress={createNewPost}
      >
        <Ionicons name="add-outline" size={25} color={scheme.hiPrimary} />
      </CircularButton>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
    // height: 500,
    // minHeight: "100%",
    // minWidth: "100%",
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
  newPost: {
    justifyContent: "center",
    alignContent: "center",
    position: "absolute",
    right: 10,
    bottom: 60,
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
