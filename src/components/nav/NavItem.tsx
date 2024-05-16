import { TouchableProps } from "@/forms/Submit";
import useSettingsStore from "@/stores/settings";
import { ReactNode, useMemo } from "react";
import { TouchableOpacity, StyleSheet, Text } from "react-native";

export type Props = {
  text?: string;
  icon?: ReactNode;
};

export default function NavItem(props: Props & TouchableProps) {
  const scheme = useSettingsStore((s) => s.colorScheme);
  const calcStyle = useMemo(() => calcStyles(scheme.primary), [scheme]);

  return (
    <TouchableOpacity style={styles.container} {...props}>
      {props.icon && props.icon}
      {props.text && <Text style={calcStyle.text}>{props.text}</Text>}
    </TouchableOpacity>
  );
}

const calcStyles = (color: string) =>
  StyleSheet.create({
    text: {
      color: color,
    },
  });

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
});
