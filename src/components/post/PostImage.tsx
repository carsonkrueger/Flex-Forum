import ContentModel, { downloadContent } from "@/models/content-model";
import useSettingsStore from "@/stores/settings";
import { ColorScheme } from "@/util/colors";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useRef, useState } from "react";
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
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const calcStyle = useMemo(
    () => calcStyles(width, aspectRatio, scheme),
    [scheme],
  );

  const fetchImage = async () => {
    return await downloadContent<Blob>(contentModel, "blob");
  };

  const query = useQuery({
    queryKey: [`img.${contentModel.post_id}.${contentModel.content_id}`],
    queryFn: fetchImage,
  });

  useEffect(() => {
    if (imgSrc != null || !query.data) return;

    let fr = new FileReader();
    fr.onloadend = () => {
      setImgSrc(fr.result as string);
    };
    fr.readAsDataURL(query.data);
  }, [query.data]);

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
