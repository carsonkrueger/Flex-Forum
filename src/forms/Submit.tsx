import React, { ComponentProps, useMemo } from "react";
import { StyleSheet, TouchableOpacity, Text } from "react-native";

export enum ButtonVariant {
  Outline,
  FloatingFilled,
  Filled,
}

export type TouchableProps = ComponentProps<typeof TouchableOpacity>;

export type BtnProps = {
  variant: ButtonVariant;
  primaryColor: string;
  secondaryColor?: string;
  text: string;
};

export type Props = {
  touchableProps?: TouchableProps;
  btnProps: BtnProps;
};

export default function Button(props: Props) {
  const calcStyles = useMemo(
    () => btnVariantStyle({ ...props.btnProps }),
    [props.btnProps],
  );

  return (
    <TouchableOpacity
      activeOpacity={0.5}
      style={[styles.btnBase, calcStyles.btnVariant]}
      {...props.touchableProps}
    >
      <Text style={[styles.textBase, calcStyles.textStyle]}>
        {props.btnProps.text}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btnBase: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    maxWidth: 300,
    minWidth: 150,
    height: 40,
    width: "80%",
  },
  textBase: {
    fontSize: 15,
  },
});

const btnVariantStyle = ({
  variant: v,
  primaryColor: pc,
  secondaryColor: sc,
}: BtnProps) =>
  StyleSheet.create({
    btnVariant: {
      borderColor: v == ButtonVariant.Outline ? pc : undefined,
      borderWidth: v == ButtonVariant.Outline ? 1.5 : undefined,
      backgroundColor:
        v == ButtonVariant.FloatingFilled || v == ButtonVariant.Filled
          ? pc
          : undefined,
    },
    textStyle: {
      color: v == ButtonVariant.Outline ? pc : sc,
    },
  });
