import { create } from "zustand";

export type Id = number;

export type Workout = {
  id: Id;
  name: string;
  isLocked: boolean;
  lastPerformed?: Date;
  exerciseIds: Id[];
};

type State = {
  nextId: Id;
  sheetIndex?: Id;
  workouts: { [id: Id]: Workout };
};

type Action = {
  setWorkout: (w: Workout) => void;
  setName: (name: Workout["name"], id: Workout["id"]) => void;
  addExercise: (id: Id, exerciseId: Id) => void;
  removeExercise: (id: Id, exerciseId: Id) => void;
  toggleLocked: (id: Id) => void;
  setSheetIndex: (id?: Id) => void;
};

const useWorkoutStore = create<State & Action>((set, get) => ({
  nextId: 0,
  sheetIndex: undefined,
  workouts: {},

  setWorkout: (w: Workout) =>
    set((s) => ({ workouts: { ...s.workouts[w.id], [w.id]: w } })),

  setName: (name: Workout["name"], id: Workout["id"]) =>
    set((s) => ({ workouts: { ...s.workouts[id], [id]: { name: name } } })),

  addExercise: (id: Id, exerciseId: Id) =>
    set((s) => ({
      workouts: {
        ...s.workouts,
        [id]: {
          ...s.workouts[id],
          exerciseIds: [...s.workouts[id].exerciseIds, exerciseId],
        },
      },
    })),

  removeExercise: (id: Id, exerciseId: Id) =>
    set((s) => ({
      workouts: {
        ...s.workouts,
        [id]: {
          ...s.workouts[id],
          exerciseIds: get().workouts[id].exerciseIds.filter(
            (i) => i !== exerciseId,
          ),
        },
      },
    })),

  toggleLocked: (id: Id) =>
    set((s) => ({
      workouts: {
        ...s.workouts,
        [id]: { ...s.workouts[id], isLocked: !s.workouts[id].isLocked },
      },
    })),

  setSheetIndex: (id?: Id) => set((s) => ({ sheetIndex: id })),
}));

export default useWorkoutStore;
