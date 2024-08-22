import FlexForumIcon from "@/components/icons/flex-forum-icon";
import Post from "@/components/post/Post";
import CircularButton from "@/forms/CircularButton";
import { PostModel, downloadNextPosts } from "@/models/post-model";
import usePostStore from "@/stores/posts";
import useSettingsStore from "@/stores/settings";
import { ColorScheme } from "@/util/colors";
import { FlashList } from "@shopify/flash-list";
import { useMemo, useState } from "react";
import {
  Image,
  Text,
  StyleSheet,
  View,
  Dimensions,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SizeVariant } from "@/util/variants";
import { useRouter } from "expo-router";
import { ROUTES } from "@/util/routes";
import { parse } from "date-fns";
import { MY_DATE_FORMAT, UTCNow } from "@/util/dates";

export default function Page() {
  const router = useRouter();
  const scheme = useSettingsStore((state) => state.colorScheme);
  const calcStyle = useMemo(() => calcStyles(scheme), [scheme]);
  const [postCards, setPostCards] = useState<PostModel[]>([]);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const windowWidth = Dimensions.get("window").width;
  const lastDate = UTCNow();
  const addPosts = usePostStore((s) => s.addPosts);

  const handleEndReached = async () => {
    const date =
      postCards.length > 0
        ? postCards[postCards.length - 1].created_at
        : lastDate;
    let posts = await downloadNextPosts(date);
    addPosts(posts);
    setPostCards([...postCards, ...posts]);
  };

  const createNewPost = () => {
    router.push(ROUTES.newPost);
  };

  const onRefresh = async () => {
    setPostCards([]);
    let posts = await downloadNextPosts(lastDate);
    addPosts(posts);
    setPostCards([...posts]);
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
        // onRefresh={onRefresh}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
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
