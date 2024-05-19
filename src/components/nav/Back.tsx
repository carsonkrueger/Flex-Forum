import useSettingsStore from "@/stores/settings";
import { useRouter } from "expo-router";
import React, { useMemo } from "react";
import {
  TouchableOpacity,
  Text,
  TouchableOpacityProps,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ColorScheme } from "@/util/colors";

export type Props = {
  text: string;
};

export default function Back(props: Props & TouchableOpacityProps) {
  const router = useRouter();
  const scheme = useSettingsStore((s) => s.colorScheme);
  const calcStyles = useMemo(() => styles(scheme), []);

  // this will get overriden if onPress is passed down as a prop
  const onBackPress = () => {
    router.back();
  };

  return (
    <TouchableOpacity
      style={calcStyles.container}
      onPress={onBackPress}
      {...props}
    >
      <Ionicons name="chevron-back" size={30} color={scheme.quaternary} />
      <Text style={calcStyles.text}>Login</Text>
    </TouchableOpacity>
  );
}

const styles = (scheme: ColorScheme) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
    },
    text: {
      color: scheme.quaternary,
      fontSize: 16,
    },
  });
