import CommentModel from "@/models/comment-model";
import useSettingsStore from "@/stores/settings";
import { ColorScheme } from "@/util/colors";
import { useMemo } from "react";
import { View, Text, StyleSheet } from "react-native";

export type Props = {
  commentModel: CommentModel;
};

export default function Comment({ commentModel }: Props) {
  const scheme = useSettingsStore((s) => s.colorScheme);
  const calcStyle = useMemo(() => calcStyles(scheme), []);
  return (
    <View style={styles.container}>
      <Text style={[styles.username, calcStyle.username]}>
        {commentModel.username}:
      </Text>
      <Text style={[styles.description, calcStyle.description]}>
        {commentModel.description}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 15,
  },
  username: {
    fontFamily: "Oswald",
    fontSize: 14,
  },
  description: {
    fontFamily: "Oswald",
    fontSize: 13,
  },
});

const calcStyles = (scheme: ColorScheme) => ({
  username: {
    color: scheme.tertiary,
  },
  description: {
    color: scheme.loTertiary,
  },
});
