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
  workouts: { [id: Id]: Workout };
};

type Action = {
  setWorkout: (w: Workout) => void;
  setName: (name: Workout["name"], id: Workout["id"]) => void;
  addExercise: (id: Id, exerciseId: Id) => void;
  toggleLocked: (id: Id) => void;
};

const useWorkoutStore = create<State & Action>((set) => ({
  nextId: 0,
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

  toggleLocked: (id: Id) =>
    set((s) => ({
      workouts: {
        ...s.workouts,
        [id]: { ...s.workouts[id], isLocked: !s.workouts[id].isLocked },
      },
    })),
}));

export default useWorkoutStore;
