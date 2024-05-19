import { ComponentProps, useMemo } from "react";
import { Text, TextInput, StyleSheet, View } from "react-native";
import {
  FieldValues,
  Path,
  UseControllerProps,
  useController,
} from "react-hook-form";

export enum InputVariant {
  Outline,
  Floating,
}

export type TextInputProps = ComponentProps<typeof TextInput>;

export type InputProps = {
  inputVariant: InputVariant;
  color: string;
  errorMessage?: string;
  errorMessageTextColor?: string;
};

export type Props<T extends FieldValues> = {
  inputProps: InputProps;
  textInputProps?: TextInputProps;
  controlProps: UseControllerProps<T, Path<T>>;
};

export default function Input<T extends FieldValues>(props: Props<T>) {
  const inputStyle = useMemo(
    () => calcStyles(props.inputProps),
    [props.inputProps],
  );

  const { field } = useController<T>({
    control: props.controlProps.control,
    name: props.controlProps.name,
    defaultValue: props.controlProps.defaultValue,
    rules: props.controlProps.rules,
  });

  return (
    <View style={styles.container}>
      <Text style={[styles.errorMessage, inputStyle.errorMessage]}>
        {props.inputProps.errorMessage}
      </Text>
      <TextInput
        onBlur={field.onBlur}
        value={field.value}
        onChangeText={field.onChange}
        style={[styles.inputBase, inputStyle.inputVariant]}
        {...props.textInputProps}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    maxWidth: 300,
    minWidth: 150,
    width: "80%",
    height: 38,
  },
  errorMessage: {
    position: "absolute",
    bottom: "100%",
    paddingLeft: 12,
    fontSize: 11,
  },
  inputBase: {
    borderRadius: 20,
    paddingHorizontal: 12,
    fontSize: 15,
    height: "100%",
    width: "100%",
  },
});

const calcStyles = ({
  color,
  inputVariant,
  errorMessageTextColor,
}: InputProps) =>
  StyleSheet.create({
    inputVariant: {
      color: inputVariant == InputVariant.Outline ? color : undefined,
      borderColor: inputVariant == InputVariant.Outline ? color : undefined,
      borderWidth: inputVariant == InputVariant.Outline ? 1.5 : undefined,
      shadowRadius: inputVariant == InputVariant.Floating ? 20 : undefined,
    },
    errorMessage: {
      color: errorMessageTextColor,
    },
  });
