import useSettingsStore from "@/stores/settings";
import { useEffect, useMemo, useState } from "react";
import { Text, View, StyleSheet, Image } from "react-native";
import PostImage from "./PostImage";
import ImageModel, { download_image } from "@/models/image-model";

export default function Post() {
  const scheme = useSettingsStore((state) => state.colorScheme);
  const calcStyle = useMemo(() => calcStyles(), [scheme]);
  const [imgSrc, setImgSrc] = useState<string | undefined>("");

  useEffect(() => {
    let model: ImageModel = {
      username: "username",
      post_id: 1000,
      image_id: 2,
    };
    let di = async () => {
      let { data } = await download_image(model);
      let fr = new FileReader();
      fr.readAsDataURL(data);
      fr.onloadend = () => {
        setImgSrc(fr.result as string);
      };
    };
    di();
  }, []);

  return (
    <View style={[styles.container, calcStyle.container]}>
      <Text style={styles.header}>Post</Text>
      {imgSrc && (
        <Image
          style={{ width: "100%", height: 300 }}
          source={{ uri: imgSrc }}
        />
      )}
      {/* <PostImage /> */}
      <Text style={styles.header}>Post end</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    maxHeight: 550,
    // flex: 1,
  },
  header: {},
});

const calcStyles = () =>
  StyleSheet.create({
    container: {},
  });
