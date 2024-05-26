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
  inProgress: Id[];
  workouts: { [id: Id]: Workout };
};

type Action = {
  setWorkout: (w: Workout) => void;
  createWorkout: () => Id;
  setName: (name: Workout["name"], id: Workout["id"]) => void;
  addExercise: (id: Id, exerciseId: Id) => void;
  removeExercise: (id: Id, exerciseId: Id) => void;
  toggleLocked: (id: Id) => void;
  setSheetId: (id?: Id) => void;
  moveUp: (id: Id, exerciseId: Id) => void;
  moveDown: (id: Id, exerciseId: Id) => void;
  startWorkout: (id: Id) => void;
  finishWorkout: (id: Id) => void;
};

const useWorkoutStore = create<State & Action>((set, get) => ({
  nextId: 0,
  sheetId: undefined,
  workouts: {},
  inProgress: [],

  setWorkout: (w: Workout) =>
    set((s) => ({ workouts: { ...s.workouts[w.id], [w.id]: w } })),

  createWorkout: () => {
    let id = get().nextId;
    let w: Workout = {
      id: id,
      exerciseIds: [],
      isLocked: false,
      name: "New Workout",
    };
    set((s) => ({ workouts: { ...s.workouts, [id]: w }, nextId: id + 1 }));
    return id;
  },

  setName: (name: Workout["name"], id: Workout["id"]) =>
    set((s) => ({
      workouts: { ...s.workouts[id], [id]: { ...s.workouts[id], name: name } },
    })),

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

  startWorkout: (id: Id) => set((s) => ({ inProgress: [...s.inProgress, id] })),

  finishWorkout: (id: Id) =>
    set((s) => ({ inProgress: s.inProgress.filter((i) => i !== id) })),
}));

export default useWorkoutStore;
