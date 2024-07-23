import { ColorScheme, MainColorScheme } from "@/util/colors";
import { create } from "zustand";

type State = {
  colorScheme: ColorScheme;
};

type Action = {
  setColorScheme: (scheme: State["colorScheme"]) => void;
};

const useSettingsStore = create<State & Action>((set) => ({
  colorScheme: MainColorScheme,
  setColorScheme: (scheme) => set(() => ({ colorScheme: scheme })),
}));

export default useSettingsStore;
