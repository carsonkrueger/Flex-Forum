import useSettingsStore from "@/stores/settings";
import { useMemo, useRef, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  NativeScrollEvent,
  NativeSyntheticEvent,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import PostImage from "./PostImage";
import ImageModel from "@/models/image-model";
import { ColorScheme } from "@/util/colors";
import { PostModel } from "@/models/post-model";

export type Props = {
  postModel: PostModel;
  width: number;
};

export default function Post({ postModel, width }: Props) {
  const scheme = useSettingsStore((state) => state.colorScheme);
  const [curId_OneRelative, setCurId_OneRelative] = useState<number>(1);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const imageModels = useRef<ImageModel[]>(initImageModels(postModel));
  const calcStyle = useMemo(() => calcStyles(scheme), [scheme]);
  const iconSize = useRef<number>(35);

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

  function initImageModels(postModel: PostModel): ImageModel[] {
    return arrayRange(1, postModel.num_images, 1).map((v) => ({
      image_id: v,
      post_id: postModel.id,
      username: postModel.username,
    }));
  }

  return (
    <View style={[styles.container, calcStyle.container]}>
      <View style={[styles.headerContainer]}>
        <View style={[styles.profileIcon, calcStyle.profileIcon]} />
        <Text style={[styles.headerText, calcStyle.headerText]}>
          {postModel.username}
        </Text>
      </View>

      <View style={{ height: width }}>
        <ScrollView
          horizontal={true}
          snapToInterval={width}
          onScroll={handleScroll}
        >
          {imageModels.current.map((model) => (
            <PostImage
              width={width}
              key={`${postModel.id}.${model.image_id}`}
              imageModel={model}
            />
          ))}
        </ScrollView>
        {/* Dot indices */}
        {imageModels.current.length > 1 && (
          <View style={styles.dotsContainer}>
            {imageModels.current.map((_, idx) => (
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

      <View style={[styles.bottomContainer, calcStyle.bottomContainer]}>
        <View style={[styles.iconsBar]}>
          <TouchableOpacity>
            <Ionicons
              name={isLiked ? "heart-sharp" : "heart-outline"}
              size={iconSize.current}
              color={scheme.quaternary}
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons
              name={"chatbubble-outline"}
              size={iconSize.current}
              color={scheme.quaternary}
            />
          </TouchableOpacity>
        </View>
        <Text style={[styles.comments, calcStyle.comments]}>
          {postModel.description}
        </Text>
      </View>
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
  comments: {
    width: "100%",
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
    comments: {
      color: scheme.loTertiary,
    },
    bottomContainer: {},
  });
