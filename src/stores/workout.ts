import { create } from "zustand";

export type Id = number;

export type Workout = {
  id: Id;
  name: string;
  lastPerformed?: Date;
  exerciseIds: Id[];
};

type State = {
  showModal: boolean;
  nextId: Id;
  isLocked: boolean;
  workouts: { [id: Id]: Workout };
};

type Action = {
  setWorkout: (w: Workout) => void;
  setName: (name: Workout["name"], id: Workout["id"]) => void;
  addExercise: (id: Id, exerciseId: Id) => void;
  toggleModal: () => void;
  toggleLocked: () => void;
};

const useWorkoutStore = create<State & Action>((set) => ({
  showModal: false,
  nextId: 0,
  isLocked: false,
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

  toggleModal: () => set((s) => ({ showModal: !s.showModal })),
  toggleLocked: () => set((s) => ({ isLocked: !s.isLocked })),
}));

export default useWorkoutStore;
