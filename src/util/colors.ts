export interface ColorScheme {
  primary: string;
  secondary: string;
  tertiary: string;
  quaternary: string;
}

const LightColorScheme: ColorScheme = {
  primary: "#FFF",
  secondary: "#4d5359", //#4d5359 #33E1ED
  tertiary: "#33E1ED",
  quaternary: "#33E1ED",
};

const DarkColorScheme: ColorScheme = {
  primary: "#343b42",
  secondary: "#4d5359",
  tertiary: "#EEE",
  quaternary: "#eb6e65",
};

export { LightColorScheme, DarkColorScheme };
