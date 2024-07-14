import ContentModel, { downloadContent } from "@/models/content-model";
import useSettingsStore from "@/stores/settings";
import { ColorScheme } from "@/util/colors";
import { useEffect, useMemo, useState } from "react";
import { View, StyleSheet, Image } from "react-native";

export type Props = {
  contentModel: ContentModel;
  curImgIdx: number;
  width: number;
  aspectRatio?: number;
};

export default function PostImage({
  contentModel,
  curImgIdx,
  width,
  aspectRatio = 1,
}: Props) {
  const scheme = useSettingsStore((state) => state.colorScheme);
  const calcStyle = useMemo(
    () => calcStyles(width, aspectRatio, scheme),
    [scheme],
  );
  const [imgSrc, setImgSrc] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (
      isLoading ||
      imgSrc !== undefined ||
      contentModel.content_id > curImgIdx + 1
    )
      return;
    setIsLoading(true);
    downloadContent<Blob>(contentModel).then((data) => {
      let fr = new FileReader();
      fr.readAsDataURL(data);
      fr.onloadend = () => {
        setImgSrc(fr.result as string);
      };
    });
  }, [curImgIdx]);

  return (
    <>
      {imgSrc ? (
        <Image style={calcStyle.image} source={{ uri: imgSrc }} />
      ) : (
        <View style={calcStyle.skeleton} />
      )}
    </>
  );
}

const calcStyles = (width: number, aspectRatio: number, scheme: ColorScheme) =>
  StyleSheet.create({
    image: {
      width: width,
      height: width * aspectRatio,
      aspectRatio: aspectRatio,
    },
    skeleton: {
      width: width,
      height: width * aspectRatio,
      backgroundColor: scheme.hiPrimary,
    },
  });
