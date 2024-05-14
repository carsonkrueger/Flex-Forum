import Input, { InputVariant } from "@/forms/Input";
import Submit, { ButtonVariant } from "@/forms/Submit";
import useSettingsStore from "@/stores/settings";
import { useRouter } from "expo-router";
import { useMemo } from "react";
import { StyleSheet, View, Text } from "react-native";
import { useForm } from "react-hook-form";
import LoginModel from "@/models/login-model";

export default function Page() {
  const router = useRouter();
  const scheme = useSettingsStore((state) => state.colorScheme);
  const calcStyle = useMemo(
    () => calcStyles(scheme.primary, scheme.quaternary, scheme.secondary),
    [scheme],
  );

  const {
    control,
    handleSubmit,
    getValues,
    formState: { isLoading, errors },
  } = useForm<LoginModel>({ mode: "all" });
  const onSubmit = (data: LoginModel) => alert(JSON.stringify(data));

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
          rules: {
            required: { message: "Username required", value: true },
            minLength: {
              value: 4,
              message: "Username should be at least 4 characters",
            },
            maxLength: {
              value: 32,
              message: "Username at most 32 characters",
            },
            validate: (v) => v === getValues("username"),
          },
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
          name: "password",
          control: control,
          rules: {
            required: { value: true, message: "Password required" },
            minLength: {
              value: 8,
              message: "Password should be at least 8 characters",
            },
            maxLength: {
              value: 32,
              message: "Password length at most 32 characters",
            },
            validate: (v) => v === getValues("password"),
          },
        }}
      />

      <Submit
        btnProps={{
          variant: ButtonVariant.Filled,
          primaryColor: scheme.quaternary,
          secondaryColor: scheme.primary,
          text: "Log in",
        }}
        touchableProps={{
          onPress: handleSubmit(onSubmit),
          disabled: isLoading,
        }}
      />

      <Submit
        btnProps={{
          variant: ButtonVariant.Outline,
          primaryColor: scheme.quaternary,
          secondaryColor: scheme.quaternary,
          text: "Sign up",
        }}
        touchableProps={{
          onPress: () => router.replace("/"),
          disabled: isLoading,
        }}
      />

      <Text style={calcStyle.forgotPassword}>Forgot Password?</Text>
      <Text style={calcStyle.errorText}>{errors.username?.message}</Text>
      <Text style={calcStyle.errorText}>{errors.password?.message}</Text>
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
    alignContent: "center",
    textAlign: "center",
    backgroundColor: "white",
    width: 600,
    height: 200,
    paddingTop: 30,
    marginBottom: 50,
    fontFamily: "PermanentMarker",
    fontSize: 100,
    lineHeight: 90,
    transform: [{ rotate: "-23deg" }],
  },
});

const calcStyles = (bgColor: string, titleColor: string, errorColor: string) =>
  StyleSheet.create({
    container: {
      backgroundColor: bgColor,
    },
    title: {
      color: titleColor,
    },
    errorText: {
      color: errorColor,
    },
    forgotPassword: {
      color: titleColor,
      fontSize: 11,
      textDecorationLine: "underline",
      textAlign: "right",
    },
  });
