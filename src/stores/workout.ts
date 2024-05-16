import { create } from "zustand";

export type Id = number;

type State = {
  id: number;
  name: string;
  lastPerformed?: Date;
  exerciseIds: Id[];
};

type Action = {
  setName: (name: State["name"]) => void;
};

const useWorkoutStore = create<State & Action>((set) => ({
  id: -1,
  name: "",
  exerciseIds: [],
  setName: (name: State["name"]) => set(() => ({ name: name })),
}));

export default useWorkoutStore;
