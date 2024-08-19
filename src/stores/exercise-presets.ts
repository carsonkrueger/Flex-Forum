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
  alphabetical: ExercisePreset[];
  updatePresets: () => Promise<void>;
};

type Action = {
  setPresets: (presets: ExercisePreset[]) => void;
  getPreset: (id: Id) => ExercisePreset | undefined;
};

const useExercisePresetStore = create<State & Action>((set, get) => ({
  presets: [],
  alphabetical: [],

  updatePresets: async () => {
    let presets = (await client.get<ExercisePreset[]>("/exercise-presets"))
      .data;
    get().setPresets(presets);
  },

  setPresets: (presets: ExercisePreset[]) =>
    set((s) => ({
      presets: presets.sort((a, b) => a.id - b.id),
      alphabetical: [...presets].sort((a, b) => a.name.localeCompare(b.name)),
    })),

  getPreset: (id: Id) => get().presets[id],
}));

export default useExercisePresetStore;
