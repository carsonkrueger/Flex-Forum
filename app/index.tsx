import Input, { InputVariant } from "@/forms/Input";
import Submit, { ButtonVariant } from "@/forms/Submit";
import useUserStore from "@/stores/user";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import { useForm } from "react-hook-form";
import LoginModel, { login } from "@/models/login-model";
import { routes } from "@/util/routes";

export default function Page() {
  const router = useRouter();
  const scheme = useUserStore((state) => state.colorScheme);
  const setUserId = useUserStore((state) => state.setUserId);
  const calcStyle = useMemo(
    () =>
      calcStyles(
        scheme.primary,
        scheme.primary,
        scheme.quaternary,
        scheme.secondary,
      ),
    [scheme],
  );
  const [isQueryLoading, setIsQueryLoading] = useState<boolean>(false);

  const {
    control,
    handleSubmit,
    getValues,
    formState: { isLoading: isFormLoading, errors },
  } = useForm<LoginModel>({ mode: "all" });

  const onSubmit = async (data: LoginModel) => {
    setIsQueryLoading(true);
    try {
      let id = await login(data);
      setUserId(id);
      router.replace(routes.home);
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
          onPress: () => router.push(routes.signup),
          disabled: isAnyLoading(),
        }}
      />

      <Text style={calcStyle.forgotPassword}>Forgot Password?</Text>
      {errors.username && (
        <Text style={calcStyle.errorText}>{errors.username?.message}</Text>
      )}
      {errors.password && (
        <Text style={calcStyle.errorText}>{errors.password?.message}</Text>
      )}
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
    height: 180,
    paddingTop: 27,
    marginBottom: 50,
    fontFamily: "PermanentMarker",
    fontSize: 90,
    lineHeight: 80,
    transform: [{ rotate: "-15deg" }],
  },
});

const calcStyles = (
  bgColor: string,
  titleColor: string,
  titleBgColor: string,
  errorColor: string,
) =>
  StyleSheet.create({
    container: {
      backgroundColor: bgColor,
    },
    title: {
      color: titleColor,
      backgroundColor: titleBgColor,
    },
    errorText: {
      color: errorColor,
    },
    forgotPassword: {
      color: titleBgColor,
      fontSize: 11,
      textDecorationLine: "underline",
      textAlign: "right",
    },
  });
