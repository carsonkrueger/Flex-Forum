import client from "@/util/web-client";
import { create } from "zustand";
import { Id } from "./workout";

export type ExercisePreset = {
  id: Id;
  name: string;
  description?: string;
};

type State = {
  presets: ExercisePreset[];
  updatePresets: () => Promise<void>;
};

type Action = {
  setPresets: (presets: ExercisePreset[]) => void;
};

const useExercisePresetStore = create<State & Action>((set, get) => ({
  presets: [],

  updatePresets: async () => {
    let presets = (await client.get<ExercisePreset[]>("/exercise-presets"))
      .data;
    get().setPresets(presets);
  },

  setPresets: (presets: ExercisePreset[]) => set((s) => ({ presets: presets })),
}));

export default useExercisePresetStore;
