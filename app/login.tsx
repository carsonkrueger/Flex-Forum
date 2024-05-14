import Input, { InputVariant } from "@/forms/Input";
import Submit, { ButtonVariant } from "@/forms/Submit";
import useUserStore from "@/stores/user";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import { useForm } from "react-hook-form";
import LoginModel, { login } from "@/models/login-model";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export default function Page() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const scheme = useUserStore((state) => state.colorScheme);
  const userId = useUserStore((state) => state.userId);
  const setUserId = useUserStore((state) => state.setUserId);
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
  } = useForm<LoginModel>({ mode: "all" });

  // let loginFormData = {
  //   username: "",
  //   password: "",
  // };

  const onSubmit = async (data: LoginModel) => {
    setIsQueryLoading(true);
    try {
      let id = await login(data);
      setUserId(id);
      router.replace("/");
    } catch {
      console.error("err");
    }
    setIsQueryLoading(false);
  };

  const isAnyLoading = () => isFormLoading || isQueryLoading;

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
          disabled: isAnyLoading(),
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
          disabled: isAnyLoading(),
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
    paddingTop: 100,
  },
  title: {
    alignContent: "center",
    textAlign: "center",
    backgroundColor: "white",
    width: "160%",
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
