import Input, { InputVariant } from "@/forms/Input";
import Submit, { ButtonVariant } from "@/forms/Submit";
import useSettingsStore from "@/stores/settings";
import { useRouter } from "expo-router";
import { useMemo } from "react";
import { StyleSheet, View, Text, TextInput } from "react-native";
import { useForm, SubmitHandler } from "react-hook-form";
import LoginModel from "@/models/login-model";

export default function Page() {
  const router = useRouter();
  const scheme = useSettingsStore((state) => state.colorScheme);
  const calcStyle = useMemo(
    () => calcStyles(scheme.primary, scheme.quaternary),
    [scheme],
  );

  const { control, handleSubmit } = useForm<LoginModel>();

  return (
    <View style={[styles.container, calcStyle.container]}>
      <Text style={[styles.title, calcStyle.title]}>
        Flex
        {"\n"}
        Forum
      </Text>

      <Input
        inputProps={{
          inputVariant: InputVariant.Outline,
          color: scheme.quaternary,
        }}
        textInputProps={{
          placeholder: "Username",
          placeholderTextColor: scheme.quaternary,
        }}
        controlProps={{
          defaultValue: "",
          name: "username",
          control: control,
        }}
      />

      <Input
        inputProps={{
          inputVariant: InputVariant.Outline,
          color: scheme.quaternary,
        }}
        textInputProps={{
          placeholder: "Password",
          placeholderTextColor: scheme.quaternary,
          secureTextEntry: true,
        }}
        controlProps={{
          defaultValue: "",
          name: "password",
          control: control,
        }}
      />

      <Submit
        btnProps={{
          variant: ButtonVariant.Filled,
          primaryColor: scheme.quaternary,
          secondaryColor: scheme.primary,
          text: "Log in",
        }}
        touchableProps={{ onPress: () => router.replace("/") }}
      />

      <Submit
        btnProps={{
          variant: ButtonVariant.Outline,
          primaryColor: scheme.quaternary,
          secondaryColor: scheme.quaternary,
          text: "Sign up",
        }}
        touchableProps={{ onPress: () => router.replace("/") }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    gap: 15,
    padding: 10,
  },
  title: {
    paddingBottom: 40,
    fontFamily: "PermanentMarker",
    fontSize: 100,
    lineHeight: 105,
    transform: [{ rotate: "-23deg" }],
  },
});

const calcStyles = (bgColor: string, titleColor: string) =>
  StyleSheet.create({
    container: {
      backgroundColor: bgColor,
    },
    title: {
      color: titleColor,
    },
  });
