import Input, { InputVariant } from "@/forms/Input";
import Submit, { ButtonVariant } from "@/forms/Submit";
import useUserStore from "@/stores/user";
import useSettingsStore from "@/stores/settings";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import { useForm } from "react-hook-form";
import LoginModel, { login } from "@/models/login-model";
import { routes } from "@/util/routes";
import useExercisePresetStore from "@/stores/exercise-presets";

export default function Page() {
  const router = useRouter();
  const scheme = useSettingsStore((state) => state.colorScheme);
  const setUsername = useUserStore((state) => state.setUsername);
  const username = useUserStore((state) => state.username);
  const errMsgColor = scheme.loQuaternary;
  const updatePresets = useExercisePresetStore((s) => s.updatePresets);

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
      await login(data);
      setUsername(data.username);
      router.replace(routes.home);
    } catch (e) {
      console.error("err", e);
    }
    setIsQueryLoading(false);
  };

  const isAnyLoading = () => isFormLoading || isQueryLoading;

  useEffect(() => {
    if (username !== undefined) {
      router.replace(routes.home);
    }
    updatePresets();
  }, []);

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
          errorMessage: errors.username?.message,
          errorMessageTextColor: errMsgColor,
        }}
        textInputProps={{
          placeholder: "Username",
          placeholderTextColor: scheme.loQuaternary,
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
          errorMessage: errors.password?.message,
          errorMessageTextColor: errMsgColor,
        }}
        textInputProps={{
          placeholder: "Password",
          placeholderTextColor: scheme.loQuaternary,
          secureTextEntry: true,
          autoCapitalize: "none",
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    gap: 17,
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
