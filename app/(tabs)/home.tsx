import FlexForumIcon from "@/components/icons/flex-forum-icon";
import Post from "@/components/post/Post";
import CircularButton from "@/forms/CircularButton";
import { PostModel, downloadNextPosts } from "@/models/post-model";
import usePostStore from "@/stores/posts";
import useSettingsStore from "@/stores/settings";
import { ColorScheme } from "@/util/colors";
import { FlashList } from "@shopify/flash-list";
import { useMemo, useRef, useState } from "react";
import {
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
import { MY_DATE_FORMAT, UTCNow } from "@/util/dates";
import useUserStore from "@/stores/user";

export default function Page() {
  const router = useRouter();
  const scheme = useSettingsStore((state) => state.colorScheme);
  const calcStyle = useMemo(() => calcStyles(scheme), [scheme]);
  const postIds = usePostStore((s) => s.postIds);
  const getPost = usePostStore((s) => s.getPost);
  // const [postCards, setPostCards] = useState<PostModel[]>([]);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const isLoading = useRef<boolean>(false);
  const windowWidth = Dimensions.get("window").width;
  const addPosts = usePostStore((s) => s.addPosts);
  const addUsersFromPosts = useUserStore((s) => s.addUsersFromPosts);
  const setOldest = usePostStore((s) => s.setOldestDate);
  const oldest = usePostStore((s) => s.oldestDate);

  const handleEndReached = async () => {
    const date =
      postIds.length > 0
        ? getPost(postIds[postIds.length - 1]).created_at
        : UTCNow();
    await fetchPosts(date);
  };

  const createNewPost = () => {
    router.push(ROUTES.newPost);
  };

  const fetchPosts = async (from: Date, append: boolean = true) => {
    if ((oldest !== undefined && from <= oldest) || isLoading.current) return;

    let posts: PostModel[] = [];
    try {
      isLoading.current = true;
      posts = await downloadNextPosts(from);
    } catch (e) {
    } finally {
      isLoading.current = false;
    }

    if (posts.length === 0) {
      setOldest(getPost(postIds[postIds.length - 1]).created_at);
    } else {
      addUsersFromPosts(posts);
      addPosts(posts);
      // if (append) setPostCards([...postCards, ...posts]);
      // else setPostCards(posts);
    }
  };

  const onRefresh = async () => {
    try {
      setOldest(undefined);
      setRefreshing(true);
      await fetchPosts(UTCNow(), false);
    } catch (e) {
    } finally {
      setRefreshing(false);
    }
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
        data={postIds}
        renderItem={({ item }) => (
          <Post key={`post.${item}`} id={item} width={windowWidth} />
        )}
        estimatedItemSize={500}
        onEndReached={handleEndReached}
        onEndReachedThreshold={1}
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
