import useSettingsStore from "@/stores/settings";
import { useEffect, useMemo, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from "react-native";
import PostImage from "./PostImage";
import ImageModel from "@/models/image-model";
import { ColorScheme } from "@/util/colors";
import {
  PostModel,
  downloadPost as downloadFivePosts,
} from "@/models/post-model";
import { FormatDate } from "@/util/dates";

export type Props = {
  width: number;
};

export default function Post({ width }: Props) {
  const scheme = useSettingsStore((state) => state.colorScheme);
  const [postModel, setPostModel] = useState<PostModel | undefined>();
  const [curId_OneRelative, setCurId_OneRelative] = useState<number>(1);
  const calcStyle = useMemo(() => calcStyles(scheme), [scheme]);
  const data: ImageModel[] = [
    { image_id: 1, post_id: 1000, username: "username" },
    { image_id: 2, post_id: 1000, username: "username" },
  ];

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const idx = Math.round(offsetX / width) + 1;
    setCurId_OneRelative(idx);
  };

  useEffect(() => {
    downloadFivePosts({ created_at: "2024-06-06T19:49:01.727 -0000" }).then(
      (model) => console.log(model),
    );
  }, []);

  return (
    <View style={[styles.container, calcStyle.container]}>
      <View style={[styles.headerContainer]}>
        <View style={[styles.profileIcon, calcStyle.profileIcon]} />
        <Text style={[styles.headerText, calcStyle.headerText]}>Post</Text>
      </View>

      <View style={{ height: width }}>
        <ScrollView
          horizontal={true}
          snapToInterval={width}
          onScroll={handleScroll}
        >
          {data.map((model) => (
            <PostImage
              width={width}
              key={`${model.post_id}.${model.image_id}`}
              imageModel={model}
            />
          ))}
        </ScrollView>
        {/* Dot indices */}
        {data.length > 1 && (
          <View style={styles.dotsContainer}>
            {data.map((_, idx) => (
              <View
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
      </View>

      <Text style={styles.headerText}>Post {"\n"} end</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    maxHeight: 550,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    padding: 8,
    gap: 8,
  },
  headerText: {},
  profileIcon: {
    borderWidth: 1,
    borderRadius: 100,
    height: 45,
    width: 45,
  },
  comments: { backgroundColor: "#FFFFFF" },
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
});

const calcStyles = (scheme: ColorScheme) =>
  StyleSheet.create({
    container: {},
    profileIcon: {
      borderColor: scheme.tertiary,
    },
    headerText: {
      color: scheme.tertiary,
    },
    dot: {
      borderColor: scheme.loTertiary,
    },
    selectedDot: {
      backgroundColor: scheme.loTertiary,
    },
  });
