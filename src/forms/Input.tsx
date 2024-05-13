import { ComponentProps } from "react";
import { TextInput } from "react-native";

export enum InputVariant {
  Outline,
  Floating,
}

export type TouchableProps = ComponentProps<typeof TextInput>;

export type Props = {
  color: string;
  text: string;
};

export default function Input(props: TouchableProps & Props) {
  return <TextInput {...props} />;
}

// const
