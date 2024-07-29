import { ComponentProps } from "react";
import { ColorValue, TouchableWithoutFeedback, View } from "react-native";

export type TouchableWithoutFeedbackProps = ComponentProps<
  typeof TouchableWithoutFeedback
>;

export type Props = {
  opacity?: number;
  zIndex?: number;
  hidden: boolean;
  bgColor?: ColorValue;
  children?: JSX.Element;
};

export default function Modal(props: Props & TouchableWithoutFeedbackProps) {
  if (props.hidden) return null;
  return (
    <TouchableWithoutFeedback {...props}>
      <View
        style={{
          position: "absolute",
          backgroundColor: props.bgColor ?? "black",
          opacity: props.opacity ?? 0.25,
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: props.zIndex ?? 10,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {props.children !== undefined && props.children}
      </View>
    </TouchableWithoutFeedback>
  );
}
