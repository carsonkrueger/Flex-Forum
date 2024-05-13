import { ColorScheme, DarkColorScheme } from "@/util/colors";
import { create } from "zustand";

type State = {
  colorScheme: ColorScheme;
};

type Action = {
  setIsDarkMode: (scheme: State["colorScheme"]) => void;
};

const useSettingsStore = create<State & Action>((set) => ({
  colorScheme: DarkColorScheme,
  setIsDarkMode: (scheme) => set(() => ({ colorScheme: scheme })),
}));

export default useSettingsStore;
