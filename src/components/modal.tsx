import { ComponentProps } from "react";
import { TouchableWithoutFeedback, View } from "react-native";

export type TouchableWithoutFeedbackProps = ComponentProps<
  typeof TouchableWithoutFeedback
>;

export type Props = {
  opacity?: number;
  zIndex?: number;
  hidden: boolean;
};

export default function Modal(props: Props & TouchableWithoutFeedbackProps) {
  if (props.hidden) return null;
  return (
    <TouchableWithoutFeedback {...props}>
      <View
        style={{
          position: "absolute",
          backgroundColor: "black",
          opacity: props.opacity ?? 0.25,
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          elevation: props.zIndex ?? 10,
          zIndex: props.zIndex ?? 10,
        }}
      />
    </TouchableWithoutFeedback>
  );
}
