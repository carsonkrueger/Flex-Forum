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
import * as ImagePicker from "expo-image-picker";

export default function Page() {
  const scheme = useSettingsStore((s) => s.colorScheme);
  const calcStyle = useMemo(() => calcStyles(scheme), [scheme]);
  const [uris, setUris] = useState<(string | null)[]>([null, null, null]);

  const pickImage = async (idx: number) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 5],
      allowsMultipleSelection: false,
      base64: true,
    });
    if (result.assets != null) {
      setUris((s) => {
        let newUris = [...s];
        newUris[idx] = `data:image/jpeg;base64,${result.assets[0].base64}`;
        return newUris;
      });
    }
  };

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
              onPress={() => pickImage(idx)}
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
      <Submit />
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
    aspectRatio: 4 / 5,
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
