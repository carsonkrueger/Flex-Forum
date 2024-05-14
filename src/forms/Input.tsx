import { ComponentProps, useMemo } from "react";
import { TextInput, StyleSheet } from "react-native";
import {
  FieldValues,
  Path,
  UseControllerProps,
  useController,
  Controller,
} from "react-hook-form";

export enum InputVariant {
  Outline,
  Floating,
}

export type TextInputProps = ComponentProps<typeof TextInput>;

export type InputProps = {
  inputVariant: InputVariant;
  color: string;
};

export type Props<T extends FieldValues> = {
  inputProps: InputProps;
  textInputProps?: TextInputProps;
  controlProps: UseControllerProps<T, Path<T>>;
};

export default function Input<T extends FieldValues>(props: Props<T>) {
  const inputStyle = useMemo(
    () => inputVariantStyle(props.inputProps),
    [props.inputProps],
  );

  // const { field } = useController<T>({
  //   control: props.controlProps.control,
  //   name: props.controlProps.name,
  //   defaultValue: props.controlProps.defaultValue,
  // });

  return (
    <Controller
      control={props.controlProps.control}
      name={props.controlProps.name}
      defaultValue={props.controlProps.defaultValue}
      rules={props.controlProps.rules}
      render={({ field }) => (
        <TextInput
          onBlur={field.onBlur}
          value={field.value}
          onChangeText={field.onChange}
          style={[styles.inputBase, inputStyle.inputVariant]}
          {...props.textInputProps}
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  inputBase: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    paddingHorizontal: 12,
    maxWidth: 300,
    minWidth: 150,
    width: "80%",
    height: 38,
    fontSize: 15,
  },
});

const inputVariantStyle = ({ color, inputVariant }: InputProps) =>
  StyleSheet.create({
    inputVariant: {
      color: inputVariant == InputVariant.Outline ? color : undefined,
      borderColor: inputVariant == InputVariant.Outline ? color : undefined,
      borderWidth: inputVariant == InputVariant.Outline ? 1.5 : undefined,
      shadowRadius: inputVariant == InputVariant.Floating ? 20 : undefined,
    },
  });
