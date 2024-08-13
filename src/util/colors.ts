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

const MainColorScheme: ColorScheme = {
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
  loQuaternary: "#bf564e",
} as const;

const DarkBlueColorScheme: ColorScheme = {
  hiPrimary: "#3d434a",
  primary: "#343b42",
  loPrimary: "#272d33",
  hiSecondary: "#53595e",
  secondary: "#4d5359",
  loSecondary: "#3b4045",
  hiTertiary: "#FFF",
  tertiary: "#DDD",
  loTertiary: "#BBB",
  hiQuaternary: "#3d76ba",
  quaternary: "#3268a8",
  loQuaternary: "#224b7d",
} as const;

const DarkColorScheme: ColorScheme = {
  hiPrimary: "#141a4a",
  primary: "#10153d",
  loPrimary: "#090c24",
  hiSecondary: "#1f244a",
  secondary: "#1c2045",
  loSecondary: "#12162e",
  hiTertiary: "#FFF",
  tertiary: "#DDD",
  loTertiary: "#BBB",
  hiQuaternary: "#edd311",
  quaternary: "#e0c812",
  loQuaternary: "#c2ad13",
} as const;

const allColorSchemes = [
  MainColorScheme,
  DarkColorScheme,
  DarkBlueColorScheme,
] as const;

export {
  MainColorScheme,
  DarkBlueColorScheme,
  DarkColorScheme,
  allColorSchemes,
};
