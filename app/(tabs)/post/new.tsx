import PostImage from "@/components/post/PostImage";
import { Ionicons } from "@expo/vector-icons";
import useSettingsStore from "@/stores/settings";
import { ColorScheme } from "@/util/colors";
import { useMemo, useState } from "react";
import {
  Image,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";

export default function Page() {
  const scheme = useSettingsStore((s) => s.colorScheme);
  const calcStyle = useMemo(() => calcStyles(scheme), [scheme]);
  const [uris, setUris] = useState<(string | null)[]>([null, null, null]);

  return (
    <View style={[styles.container, calcStyle.container]}>
      <Text>New Post</Text>
      <View style={styles.imgContainer}>
        {uris.map((u, idx) =>
          u !== null ? (
            <Image
              style={[styles.img]}
              source={{ uri: u }}
              key={`img.${idx}`}
            />
          ) : (
            <TouchableOpacity
              style={[styles.img, calcStyle.img]}
              key={`img.${idx}`}
            >
              <Ionicons name="add-outline" size={50} color={scheme.hiPrimary} />
            </TouchableOpacity>
          ),
        )}
      </View>
      <TextInput
        placeholder="Write a caption..."
        placeholderTextColor={scheme.secondary}
        style={[styles.caption, calcStyle.caption]}
        multiline={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imgContainer: {
    flexDirection: "row",
    gap: 1,
  },
  img: {
    flex: 1,
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  caption: {
    fontSize: 15,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
});

const calcStyles = (scheme: ColorScheme) =>
  StyleSheet.create({
    container: {
      backgroundColor: scheme.primary,
    },
    img: {
      backgroundColor: scheme.loPrimary,
    },
    caption: {
      color: scheme.tertiary,
    },
  });
