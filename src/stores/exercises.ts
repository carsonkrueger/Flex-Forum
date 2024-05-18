import { create } from "zustand";
import { Id } from "./workout";

export type Exercise = {
  id: Id;
  name: string;
  timerDuration?: number;
  setIds: Id[];
};

type State = { nextId: Id; exercises: { [id: Id]: Exercise } };

type Action = {
  setExercise: (e: Exercise) => void;
  createExercise: () => Id;
  setName: (id: Id, name: string) => void;
  setTimerDuration: (id: Id, duration: number) => void;
  addSet: (id: Id, setId: Id) => void;
};

const useExerciseStore = create<State & Action>((set, get) => ({
  nextId: 0,
  exercises: {},

  setExercise: (ex: Exercise) =>
    set((s) => ({ exercises: { ...s.exercises, [ex.id]: ex } })),

  setName: (id: Id, name: string) =>
    set((s) => ({
      exercises: { ...s.exercises, [id]: { ...s.exercises[id], name: name } },
    })),

  setTimerDuration: (id: Id, duration: number) =>
    set((s) => ({
      exercises: {
        ...s.exercises,
        [id]: { ...s.exercises[id], timerDuration: duration },
      },
    })),

  addSet: (id: Id, setId: Id) =>
    set((s) => ({
      exercises: {
        ...s.exercises,
        [id]: {
          ...s.exercises[id],
          setIds: [...s.exercises[id].setIds, setId],
        },
      },
    })),

  createExercise: () => {
    let prevId = get().nextId;
    set((s) => ({
      nextId: s.nextId + 1,
      exercises: {
        ...s.exercises,
        [s.nextId]: { id: s.nextId, name: "", setIds: [] },
      },
    }));
    return prevId;
  },
}));

export default useExerciseStore;
