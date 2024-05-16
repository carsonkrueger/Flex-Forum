import { create } from "zustand";
import { Id } from "./workout";

type State = {
  id: Id;
  name: string;
  setIds: Id[];
};

type Action = {
  setName: (name: State["name"]) => void;
};

const useExerciseStore = create<State & Action>((set) => ({
  id: -1,
  name: "",
  setIds: [],
  setName: (name: State["name"]) => set(() => ({ name: name })),
}));

export default useExerciseStore;
