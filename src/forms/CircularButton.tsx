import { SizeVariant } from "@/util/variants";
import {
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
} from "react-native";

export type Props = {
  backgroundColor: string;
  size?: SizeVariant;
};

export default function CircularButton(props: TouchableOpacityProps & Props) {
  const calcStyle = calcStyles(
    props.backgroundColor,
    props.size ?? SizeVariant.MD,
  );
  return (
    <TouchableOpacity
      {...props}
      style={[calcStyle.container, styles.container, props.style]}
    >
      {props.children}
    </TouchableOpacity>
  );
}

const calcStyles = (bgColor: string, size: SizeVariant) =>
  StyleSheet.create({
    container: {
      backgroundColor: bgColor,
      width: sizeCalc(size),
      height: sizeCalc(size),
      justifyContent: "center",
      alignItems: "center",
    },
  });

const styles = StyleSheet.create({
  container: {
    borderRadius: 100,
  },
});

const sizeCalc = (size: SizeVariant): number => {
  switch (size) {
    case SizeVariant.XS:
      return 15;
    case SizeVariant.SM:
      return 20;
    case SizeVariant.MD:
      return 25;
    case SizeVariant.LG:
      return 30;
    case SizeVariant.XL:
      return 35;
    case SizeVariant.XL2:
      return 40;
    case SizeVariant.XL3:
      return 45;
    case SizeVariant.XL4:
      return 50;
  }
};
