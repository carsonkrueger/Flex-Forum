import Input, { InputVariant } from "@/forms/Input";
import Submit, { ButtonVariant } from "@/forms/Submit";
import useSettingsStore from "@/stores/settings";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import { useForm } from "react-hook-form";
import SignupViewModel, { signup } from "@/models/signup-model";

export default function Page() {
  const router = useRouter();
  const scheme = useSettingsStore((state) => state.colorScheme);
  const calcStyle = useMemo(
    () => calcStyles(scheme.primary, scheme.quaternary, scheme.secondary),
    [scheme],
  );
  const [isQueryLoading, setIsQueryLoading] = useState<boolean>(false);

  const {
    control,
    handleSubmit,
    getValues,
    formState: { isLoading: isFormLoading, errors },
  } = useForm<SignupViewModel>({ mode: "all" });

  const onSubmit = async (data: SignupViewModel) => {
    setIsQueryLoading(true);
    try {
      await signup(data);
      router.back();
    } catch {
      console.error("err");
    }
    setIsQueryLoading(false);
  };

  const isAnyLoading = () => isFormLoading || isQueryLoading;

  return (
    <View style={[styles.container, calcStyle.container]}>
      <Text style={[styles.title, calcStyle.title]}>Sign Up</Text>

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
          placeholder: "Email",
          placeholderTextColor: scheme.quaternary,
        }}
        controlProps={{
          defaultValue: "",
          name: "email",
          control: control,
          rules: {
            required: { message: "Email required", value: true },
            minLength: {
              value: 5,
              message: "Email should be at least 5 characters",
            },
            maxLength: {
              value: 255,
              message: "Email at most 255 characters",
            },
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Invalid email",
            },
            validate: (v) => v === getValues("email"),
          },
        }}
      />

      <Input
        inputProps={{
          inputVariant: InputVariant.Outline,
          color: scheme.quaternary,
        }}
        textInputProps={{
          placeholder: "First Name",
          placeholderTextColor: scheme.quaternary,
        }}
        controlProps={{
          name: "first_name",
          control: control,
          rules: {
            required: { message: "First name required", value: true },
            minLength: {
              value: 4,
              message: "First name should be at least 4 characters",
            },
            maxLength: {
              value: 32,
              message: "First name at most 32 characters",
            },
            validate: (v) => v === getValues("first_name"),
          },
        }}
      />

      <Input
        inputProps={{
          inputVariant: InputVariant.Outline,
          color: scheme.quaternary,
        }}
        textInputProps={{
          placeholder: "Last Name",
          placeholderTextColor: scheme.quaternary,
        }}
        controlProps={{
          name: "last_name",
          control: control,
          rules: {
            required: { message: "Last name required", value: true },
            minLength: {
              value: 4,
              message: "Last name should be at least 4 characters",
            },
            maxLength: {
              value: 32,
              message: "Last name at most 32 characters",
            },
            validate: (v) => v === getValues("last_name"),
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

      <Input
        inputProps={{
          inputVariant: InputVariant.Outline,
          color: scheme.quaternary,
        }}
        textInputProps={{
          placeholder: "Repeat Password",
          placeholderTextColor: scheme.quaternary,
          secureTextEntry: true,
        }}
        controlProps={{
          name: "repeat_password",
          control: control,
          rules: {
            required: { value: true, message: "Repeat Password required" },
            validate: (v) =>
              v === getValues("password") || "Passwords do not match",
          },
        }}
      />

      <Submit
        btnProps={{
          variant: ButtonVariant.Filled,
          primaryColor: scheme.quaternary,
          secondaryColor: scheme.primary,
          text: "Sign up",
        }}
        touchableProps={{
          onPress: handleSubmit(onSubmit),
          disabled: isAnyLoading(),
        }}
      />

      {/* {/* <Text style={calcStyle.errorText}>{errors.username?.message}</Text> */}
      {/* <Text style={calcStyle.errorText}></Text> */}
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
    paddingTop: 100,
  },
  title: {
    alignContent: "center",
    textAlign: "center",
    width: "160%",
    fontFamily: "PermanentMarker",
    fontSize: 70,
    lineHeight: 90,
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
