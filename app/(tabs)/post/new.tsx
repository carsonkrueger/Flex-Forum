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
import { uploadImages } from "@/models/content-model";
import { useRouter } from "expo-router";

export default function Page() {
  const router = useRouter();
  const scheme = useSettingsStore((s) => s.colorScheme);
  const calcStyle = useMemo(() => calcStyles(scheme), [scheme]);
  const [assets, setUris] = useState<(ImagePicker.ImagePickerAsset | null)[]>([
    null,
    null,
    null,
  ]);
  const [desc, setDesc] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const pickImage = async (idx: number) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      allowsMultipleSelection: false,
      base64: true,
    });
    if (result.assets != null && !result.canceled) {
      setUris((s) => {
        let newUris = [...s];
        newUris[idx] = result.assets[0];
        return newUris;
      });
    }
  };

  const onSubmit = async () => {
    try {
      setIsLoading(true);
      if (assets.every((e) => e === null)) return;

      let form = new FormData();
      form.append("description", desc);

      const newAssets = [...assets].sort();

      for (let i = 0; i < newAssets.length; i++) {
        if (newAssets[i] === null) break;
        const fakeBlob = {
          uri: newAssets[i]!.uri,
          name: newAssets[i]!.fileName,
          type: newAssets[i]!.mimeType,
        };
        form.append(`image${i + 1}`, fakeBlob as any);
      }

      let res = await uploadImages(form);
      router.back();
    } finally {
      setIsLoading(false);
    }
  };

  const setDescription = (text: string) => {
    setDesc(text);
  };

  return (
    <View style={[styles.container, calcStyle.container]}>
      <View style={[styles.headerContainer]}>
        <Text style={[calcStyle.whiteText, styles.headerText]}>New Post</Text>
        <TouchableOpacity onPress={onSubmit} disabled={isLoading}>
          <Text style={[calcStyle.quaternaryText, styles.headerText]}>
            Upload
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.imgContainer}>
        {assets.map((u, idx) => (
          <TouchableOpacity
            style={[styles.img, calcStyle.img]}
            key={`img.${idx}`}
            onPress={() => pickImage(idx)}
            disabled={isLoading}
          >
            {u !== null && u.base64 !== undefined && u.base64 !== null ? (
              <Image
                style={[styles.img]}
                source={{ uri: `data:${u.mimeType};base64,${u.base64}` }}
                key={`img.${idx}`}
              />
            ) : (
              <Ionicons name="add-outline" size={50} color={scheme.hiPrimary} />
            )}
          </TouchableOpacity>
        ))}
      </View>
      <TextInput
        placeholder="Write a caption..."
        placeholderTextColor={scheme.secondary}
        style={[styles.caption, calcStyle.whiteText]}
        multiline={true}
        onChangeText={setDescription}
      />
      {/* <Submit
        btnProps={{
          primaryColor: scheme.quaternary,
          text: "Upload",
          variant: ButtonVariant.Filled,
          secondaryColor: scheme.primary,
        }}
        touchableProps={{ onPress: onSubmit }}
      /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  headerText: {
    fontSize: 16,
    fontFamily: "Oswald",
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
    whiteText: {
      color: scheme.tertiary,
    },
    quaternaryText: {
      color: scheme.quaternary,
    },
  });
