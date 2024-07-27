import {
  Text,
  StyleSheet,
  TouchableOpacity,
  GestureResponderEvent,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ColorScheme } from "@/util/colors";
import { useMemo } from "react";
import useSettingsStore from "@/stores/settings";

export type JustifyType =
  | "flex-start"
  | "flex-end"
  | "center"
  | "space-between"
  | "space-around"
  | "space-evenly"
  | undefined;

export type Props = {
  icon?: JSX.Element;
  useChevron?: boolean;
  text?: string;
  onPress?: (event: GestureResponderEvent) => void;
  children?: JSX.Element;
  justifyContent?: JustifyType;
};

export default function SettingsRow({
  text,
  useChevron = true,
  onPress,
  icon,
  children,
  justifyContent = "space-between",
}: Props) {
  const scheme = useSettingsStore((s) => s.colorScheme);
  const calcStyle = useMemo(
    () => calcStyles(scheme, justifyContent),
    [scheme, justifyContent],
  );
  return (
    <TouchableOpacity
      style={[styles.container, calcStyle.container]}
      onPress={onPress}
      activeOpacity={onPress === undefined ? 1 : 0.6}
    >
      {icon !== undefined && icon}
      {text !== undefined && (
        <Text style={[styles.text, calcStyle.text]}>{text}</Text>
      )}
      {children !== undefined && children}
      {useChevron && (
        <Ionicons size={30} name="chevron-forward" color={scheme.loPrimary} />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
  },
  text: {
    fontSize: 14,
    // fontFamily: "PermanentMarker",
  },
});

const calcStyles = (scheme: ColorScheme, justify: JustifyType) =>
  StyleSheet.create({
    container: {
      backgroundColor: scheme.hiPrimary,
      justifyContent: justify,
    },
    text: {
      color: scheme.loPrimary,
    },
  });
