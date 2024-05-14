import { ColorScheme, DarkColorScheme } from "@/util/colors";
import { create } from "zustand";

type State = {
  userId?: number;
  colorScheme: ColorScheme;
};

type Action = {
  setIsDarkMode: (scheme: State["colorScheme"]) => void;
  setUserId: (id: State["userId"]) => void;
};

const useUserStore = create<State & Action>((set) => ({
  userId: undefined,
  colorScheme: DarkColorScheme,
  setIsDarkMode: (scheme) => set(() => ({ colorScheme: scheme })),
  setUserId: (id) => set(() => ({ userId: id })),
}));

export default useUserStore;
