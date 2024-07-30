import Post from "@/components/post/Post";
import { PostModel } from "@/models/post-model";
import usePostStore from "@/stores/posts";
import useSettingsStore from "@/stores/settings";
import { ColorScheme } from "@/util/colors";
import { useLocalSearchParams } from "expo-router";
import { useMemo } from "react";
import { Dimensions, View, StyleSheet } from "react-native";

export default function Page() {
  const id = parseInt(useLocalSearchParams<{ id: string }>().id!);
  const post = usePostStore((s) => s.posts[id]);
  const scheme = useSettingsStore((s) => s.colorScheme);
  const windowWidth = Dimensions.get("window").width;
  const calcStyle = useMemo(() => calcStyles(scheme), [scheme]);

  return (
    <View style={[calcStyle.container]}>
      <Post
        postModel={post}
        width={windowWidth}
        showChat={false}
        clickable={false}
      />
    </View>
  );
}

const calcStyles = (scheme: ColorScheme) =>
  StyleSheet.create({
    container: {
      backgroundColor: scheme.primary,
      flex: 1,
    },
  });
