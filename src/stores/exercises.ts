import { create } from "zustand";
import { Id } from "./workout";

export type Exercise = {
  id: Id;
  exerciseId?: Id;
  // name: string;
  timerDuration?: number;
  setIds: Id[];
};

type State = { nextId: Id; exercises: { [id: Id]: Exercise } };

type Action = {
  setExercise: (e: Exercise) => void;
  createExercise: () => Id;
  setExerciseId: (id: Id, exerciseId: Id) => void;
  setTimerDuration: (id: Id, duration: number) => void;
  addSet: (id: Id, setId: Id) => void;
  removeSet: (id: Id) => void;
};

const useExerciseStore = create<State & Action>((set, get) => ({
  nextId: 0,
  exercises: {},

  setExercise: (ex: Exercise) =>
    set((s) => ({ exercises: { ...s.exercises, [ex.id]: ex } })),

  setExerciseId: (id: Id, exerciseId: Id) =>
    set((s) => ({
      exercises: {
        ...s.exercises,
        [id]: { ...s.exercises[id], exerciseId: exerciseId },
      },
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

  removeSet: (id: Id) =>
    set((s) => ({
      exercises: {
        ...s.exercises,
        [id]: {
          ...s.exercises[id],
          setIds: s.exercises[id].setIds.slice(0, -1),
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
