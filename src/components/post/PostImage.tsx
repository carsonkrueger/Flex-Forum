import ImageModel, { downloadImage } from "@/models/image-model";
import useSettingsStore from "@/stores/settings";
import { useEffect, useMemo, useState } from "react";
import { View, StyleSheet, Dimensions, Image, Text } from "react-native";

export type Props = {
  imageModel: ImageModel;
  width: number;
  aspectRatio?: number;
};

export default function Post({ imageModel, width, aspectRatio = 1 }: Props) {
  const scheme = useSettingsStore((state) => state.colorScheme);
  const calcStyle = useMemo(
    () => calcStyles(scheme.quaternary, Dimensions.get("screen").width),
    [scheme],
  );
  const [imgSrc, setImgSrc] = useState<string | undefined>("");

  useEffect(() => {
    downloadImage(imageModel).then(({ data }) => {
      let fr = new FileReader();
      fr.readAsDataURL(data);
      fr.onloadend = () => {
        setImgSrc(fr.result as string);
      };
    });
  }, []);

  return (
    <>
      {imgSrc ? (
        <Image
          style={{
            width: width,
            height: width * aspectRatio,
            aspectRatio: aspectRatio,
          }}
          source={{ uri: imgSrc }}
        />
      ) : (
        <Text>skeleton</Text>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: "100%",
  },
});

const calcStyles = (color: string, maxWidth: number) =>
  StyleSheet.create({
    image: {
      // backgroundColor: color,
      borderColor: color,
      borderWidth: 1.5,
      maxWidth: maxWidth,
      maxHeight: maxWidth * 1.2,
    },
  });
