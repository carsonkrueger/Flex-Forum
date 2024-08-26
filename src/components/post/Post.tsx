import useSettingsStore from "@/stores/settings";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  NativeScrollEvent,
  NativeSyntheticEvent,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import PostImage from "./PostImage";
import ContentModel from "@/models/content-model";
import { ColorScheme } from "@/util/colors";
import { PostModel } from "@/models/post-model";
import PostWorkout from "./PostWorkout";
import { useRouter } from "expo-router";
import { ROUTES } from "@/util/routes";
import { followUser, unfollowUser } from "@/models/following-model";
import useUserStore from "@/stores/user";
import usePostStore from "@/stores/posts";
import { Id } from "@/stores/workout";

export type Props = {
  id: Id;
  width: number;
  clickable?: boolean;
};

export default function Post({ id, width, clickable = true }: Props) {
  const scheme = useSettingsStore((state) => state.colorScheme);
  const router = useRouter();
  const [curId_OneRelative, setCurId_OneRelative] = useState<number>(1);
  const post = usePostStore((s) => s.posts[id]);
  const toggleLiked = usePostStore((s) => s.toggleLiked);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const username = useUserStore((s) => s.username);
  const isSelfPost = useMemo(
    () => username?.toLowerCase() === post.username.toLowerCase(),
    [username],
  );
  const isFollowing = useUserStore(
    (s) => s.users[post.username]?.isFollowing ?? false,
  );
  const toggleFollowing = useUserStore((s) => s.toggleFollowing);
  const imageModels = useRef<ContentModel[]>(initImageModels(post));
  const calcStyle = useMemo(
    () => calcStyles(scheme, isFollowing),
    [scheme, isFollowing],
  );
  const iconSize = useRef<number>(35);
  let lastPress: number | null = Date.now();

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const idx = Math.round(offsetX / width) + 1;
    setCurId_OneRelative(idx);
  };

  function arrayRange(start: number, stop: number, step: number): number[] {
    return Array.from(
      { length: (stop - start) / step + 1 },
      (_, index) => start + index * step,
    );
  }

  function initImageModels(post: PostModel): ContentModel[] {
    return arrayRange(1, post.num_images, 1).map((v) => ({
      post_id: post.id,
      username: post.username,
      content_id: v,
      post_type: post.post_type,
    }));
  }

  const onLikeClicked = async () => {
    if (isLoading) return;
    toggleLiked(post.id);
  };

  const onFollowClicked = async () => {
    if (isLoading) return;
    toggleFollowing(post.username);
  };

  const onChatClicked = () => {
    router.navigate(ROUTES.post(post.id));
  };

  const onHeaderClicked = () => {
    router.navigate(ROUTES.user(post.username));
  };

  const onPostPress = () => {
    const now = Date.now();
    console.log(`${now} - ${lastPress}`);
    if (lastPress !== null && now - 500 <= lastPress) {
      onLikeClicked();
      lastPress = null;
    } else {
      lastPress = now;
    }
  };

  useEffect(() => {
    setIsLoading(false);
  }, []);

  return (
    <TouchableWithoutFeedback
      style={[styles.container, calcStyle.container]}
      onPress={onPostPress}
    >
      <>
        <View style={[styles.headerContainer]}>
          <TouchableWithoutFeedback onPress={onHeaderClicked}>
            <View style={[styles.leftHeaderContainer]}>
              <View style={[styles.profileIcon, calcStyle.profileIcon]} />
              <Text style={[styles.headerText, calcStyle.headerText]}>
                {post.username}
              </Text>
            </View>
          </TouchableWithoutFeedback>
          {!isSelfPost && (
            <TouchableOpacity onPress={onFollowClicked}>
              <Text style={[styles.headerText, calcStyle.followText]}>
                {isFollowing ? "Unfollow" : "Follow"}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Images */}
        {post.post_type === "images" && (
          <View
            style={{
              height: width,
            }}
          >
            {post.post_type == "images" && (
              <>
                <ScrollView
                  horizontal={true}
                  snapToInterval={width}
                  showsHorizontalScrollIndicator={false}
                  onScroll={handleScroll}
                >
                  {imageModels.current.map((model) => (
                    <PostImage
                      key={`img.${post.id}.${model.content_id}`}
                      contentModel={model}
                      curImgIdx={curId_OneRelative}
                      width={width}
                    />
                  ))}
                </ScrollView>
                {/* Dot indices */}
                {imageModels.current.length > 1 && (
                  <View style={styles.dotsContainer}>
                    {imageModels.current.map((_, idx) => (
                      <View
                        key={`dot.${post.id}.${idx}`}
                        style={[
                          styles.dot,
                          calcStyle.dot,
                          curId_OneRelative === idx + 1
                            ? calcStyle.selectedDot
                            : undefined,
                        ]}
                      />
                    ))}
                  </View>
                )}
              </>
            )}
          </View>
        )}

        {/* Workout */}
        {post.post_type === "workout" && (
          <View style={{ width: width }}>
            {post.post_type == "workout" && (
              <PostWorkout
                contentModel={{
                  content_id: 1,
                  post_id: post.id,
                  username: post.username,
                  post_type: post.post_type,
                }}
                width={width}
              />
            )}
          </View>
        )}

        <View style={[styles.bottomContainer, calcStyle.bottomContainer]}>
          {/* Like/chat Icons */}
          <View style={[styles.iconsBar]}>
            <TouchableOpacity
              style={styles.like}
              disabled={isLoading}
              onPress={onLikeClicked}
            >
              <Ionicons
                name={post.is_liked ? "heart-sharp" : "heart-outline"}
                size={iconSize.current}
                color={scheme.quaternary}
              />
              <Text style={[styles.numLikes, calcStyle.numLikes]}>
                {post.num_likes}
              </Text>
            </TouchableOpacity>
            {clickable && (
              <TouchableOpacity disabled={isLoading} onPress={onChatClicked}>
                <Ionicons
                  name={"chatbubble-outline"}
                  size={iconSize.current}
                  color={scheme.loTertiary}
                />
              </TouchableOpacity>
            )}
          </View>
          {/* description */}
          <Text style={[styles.description, calcStyle.description]}>
            {post.description}
          </Text>
        </View>
      </>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 5,
    alignItems: "center",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    padding: 8,
    gap: 8,
  },
  leftHeaderContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    // justifyContent: "flex-start",
  },
  headerText: {
    fontFamily: "Oswald",
  },
  profileIcon: {
    borderWidth: 1,
    borderRadius: 100,
    height: 45,
    width: 45,
  },
  bottomContainer: {
    padding: 8,
    width: "100%",
    flexDirection: "column",
  },
  iconsBar: {
    width: "100%",
    flexDirection: "row",
    gap: 12,
  },
  description: {
    width: "100%",
    fontFamily: "Oswald",
    fontSize: 13,
    overflow: "hidden",
    // maxHeight: 65,
  },
  dotsContainer: {
    position: "absolute",
    bottom: 5,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    gap: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderWidth: 1,
    borderRadius: 100,
  },
  like: {
    flexDirection: "column",
    alignItems: "center",
  },
  numLikes: {
    fontFamily: "Oswald",
    fontSize: 9,
  },
});

const calcStyles = (scheme: ColorScheme, isFollowing: boolean) =>
  StyleSheet.create({
    container: {},
    profileIcon: {
      borderColor: scheme.tertiary,
    },
    headerText: {
      color: scheme.tertiary,
    },
    followText: {
      color: isFollowing ? scheme.hiSecondary : scheme.quaternary,
    },
    dot: {
      borderColor: scheme.loTertiary,
    },
    selectedDot: {
      backgroundColor: scheme.loTertiary,
    },
    description: {
      color: scheme.loTertiary,
    },
    bottomContainer: {},
    numLikes: {
      color: scheme.tertiary,
    },
  });
