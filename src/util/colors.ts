export interface ColorScheme {
  hiPrimary: string;
  primary: string;
  loPrimary: string;
  hiSecondary: string;
  secondary: string;
  loSecondary: string;
  hiTertiary: string;
  tertiary: string;
  loTertiary: string;
  hiQuaternary: string;
  quaternary: string;
  loQuaternary: string;
}

// const LightColorScheme: ColorScheme = {
//   hiPrimary: "#FFF",
//   primary: "#DDD",
//   loPrimary: "#BBB",
//   hiSecondary: "",
//   secondary: "#4d5359", //#4d5359 #33E1ED
//   tertiary: "#33E1ED",
//   quaternary: "#33E1ED",
// };

const DarkColorScheme: ColorScheme = {
  hiPrimary: "#3d434a",
  primary: "#343b42",
  loPrimary: "#272d33",
  hiSecondary: "#53595e",
  secondary: "#4d5359",
  loSecondary: "#3b4045",
  hiTertiary: "#FFF",
  tertiary: "#DDD",
  loTertiary: "#BBB",
  hiQuaternary: "#f57971",
  quaternary: "#eb6e65",
  loQuaternary: "#d66058",
};

export { DarkColorScheme };
