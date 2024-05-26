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
  sheetId?: Id;
  workouts: { [id: Id]: Workout };
};

type Action = {
  setWorkout: (w: Workout) => void;
  setName: (name: Workout["name"], id: Workout["id"]) => void;
  addExercise: (id: Id, exerciseId: Id) => void;
  removeExercise: (id: Id, exerciseId: Id) => void;
  toggleLocked: (id: Id) => void;
  setSheetId: (id?: Id) => void;
  moveUp: (id: Id, exerciseId: Id) => void;
  moveDown: (id: Id, exerciseId: Id) => void;
};

const useWorkoutStore = create<State & Action>((set, get) => ({
  nextId: 0,
  sheetId: undefined,
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

  setSheetId: (id?: Id) => set((s) => ({ sheetId: id })),

  moveUp: (id: Id, exerciseId: Id) => {
    let ids = [...get().workouts[id].exerciseIds];
    let index = ids.findIndex((i) => i === exerciseId);
    let upIndex = index - 1;
    if (upIndex < 0 || index == -1) {
      return;
    }
    [ids[index], ids[upIndex]] = [ids[upIndex], ids[index]]; // swap

    set((s) => ({
      workouts: {
        ...s.workouts,
        [id]: { ...s.workouts[id], exerciseIds: ids },
      },
    }));
  },

  moveDown: (id: Id, exerciseId: Id) => {
    let ids = [...get().workouts[id].exerciseIds];
    let index = ids.findIndex((i) => i === exerciseId);
    let downIndex = index + 1;
    if (downIndex >= ids.length || index == -1) {
      return;
    }
    [ids[index], ids[downIndex]] = [ids[downIndex], ids[index]]; // swap

    set((s) => ({
      workouts: {
        ...s.workouts,
        [id]: { ...s.workouts[id], exerciseIds: ids },
      },
    }));
  },
}));

export default useWorkoutStore;
