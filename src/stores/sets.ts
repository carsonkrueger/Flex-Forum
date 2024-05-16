import { Id } from "./workout";
import { create } from "zustand";

export type State = {
  id: Id;
  weight?: number;
  reps?: number;
  prevWeight?: number;
  prevReps?: number;
};

type Action = {
  setWeight: (weight: State["weight"]) => void;
  setReps: (reps: State["reps"]) => void;
  setPrev: (w: State["prevWeight"], r: State["prevReps"]) => void;
};

const useExerciseStore = create<State & Action>((set) => ({
  id: -1,
  setWeight: (weight: State["weight"]) => set(() => ({ weight: weight })),
  setReps: (reps: State["reps"]) => set(() => ({ reps: reps })),
  setPrev: (w: State["prevWeight"], r: State["prevReps"]) =>
    set(() => ({ prevReps: r, prevWeight: w })),
}));

export default useExerciseStore;
