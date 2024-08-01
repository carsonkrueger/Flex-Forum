import { downloadProfilePicture } from "@/models/content-model";
import useSettingsStore from "@/stores/settings";
import { ColorScheme } from "@/util/colors";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { View, StyleSheet, Image } from "react-native";

export type Props = {
  username: string;
  size?: number;
};

export default function ProfilePicture({ username, size = 50 }: Props) {
  const scheme = useSettingsStore((s) => s.colorScheme);
  const calcStyle = useMemo(() => calcStyles(scheme, size), [scheme, size]);
  const [imgSrc, setImgSrc] = useState<string | null>(null);

  const getProfilePicture = async () => await downloadProfilePicture(username);

  const query = useQuery({
    queryFn: getProfilePicture,
    queryKey: [`profile.${username}`],
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
    <View style={[styles.container, calcStyle.container]}>
      {imgSrc && <Image source={{ uri: imgSrc }} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 999,
    borderWidth: 1,
  },
});

const calcStyles = (scheme: ColorScheme, size: number) =>
  StyleSheet.create({
    container: {
      width: size,
      height: size,
      borderColor: scheme.tertiary,
    },
  });
