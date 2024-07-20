import { create } from "zustand";
import { Id } from "./workout";
import { ExerciseRow } from "@/db/models/exercise-model";

export type Exercise = {
  id: Id;
  exerciseId?: Id;
  name: string;
  timerDuration?: number;
  setIds: Id[];
};

type State = { nextId: Id; exercises: { [id: Id]: Exercise } };

type Action = {
  setExercise: (e: Exercise) => void;
  getExercise: (id: Id) => Exercise;
  createExercise: () => Id;
  createFromRow: (row: ExerciseRow) => Id;
  deleteExercise: (id: Id) => void;
  setExerciseId: (id: Id, exerciseId: Id) => void;
  setTimerDuration: (id: Id, duration?: number) => void;
  addSet: (id: Id, setId: Id) => void;
  popSet: (id: Id) => Id | undefined;
  setName: (id: Id, name: string) => void;
};

const useExerciseStore = create<State & Action>((set, get) => ({
  nextId: 0,
  exercises: {},

  setExercise: (ex: Exercise) =>
    set((s) => ({ exercises: { ...s.exercises, [ex.id]: ex } })),

  getExercise: (id: Id) => get().exercises[id],

  setExerciseId: (id: Id, exerciseId: Id) =>
    set((s) => ({
      exercises: {
        ...s.exercises,
        [id]: { ...s.exercises[id], exerciseId: exerciseId },
      },
    })),

  setTimerDuration: (id: Id, duration?: number) =>
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

  popSet: (id: Id) => {
    let len = get().exercises[id].setIds.length;
    let lastSetId = len > 0 ? get().exercises[id].setIds[len - 1] : undefined;
    set((s) => ({
      exercises: {
        ...s.exercises,
        [id]: {
          ...s.exercises[id],
          setIds: s.exercises[id].setIds.slice(0, -1),
        },
      },
    }));
    return lastSetId;
  },

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

  createFromRow: (row: ExerciseRow) => {
    let id = get().createExercise();
    get().setExerciseId(id, row.exercisePresetId);
    get().setTimerDuration(id, row.timer);
    return id;
  },

  deleteExercise: (id: Id) => {
    set((s) => {
      const exercises = { ...s.exercises };
      delete exercises[id];
      return { exercises: exercises };
    });
  },

  setName: (id: Id, name: string) => {
    set((s) => {
      return {
        exercises: { ...s.exercises, [id]: { ...s.exercises[id], name: name } },
      };
    });
  },
}));

export default useExerciseStore;
