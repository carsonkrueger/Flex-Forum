import { WorkoutRow } from "@/db/models/workout-model";
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
  exerciseSheetId?: Id;
  selectSheetId?: Id;
  templateOffset: number;
  inProgress: Id[];
  loaded: Id[];
  workouts: { [id: Id]: Workout };
};

type Action = {
  setWorkout: (w: Workout) => void;
  getWorkout: (id: Id) => Workout;
  createWorkout: () => Id;
  loadFromRow: (row: WorkoutRow) => Id;
  setName: (name: Workout["name"], id: Workout["id"]) => void;
  addExercise: (id: Id, exerciseId: Id) => void;
  removeExercise: (id: Id, exerciseId: Id) => void;
  toggleLocked: (id: Id) => void;
  setExerciseSheetId: (id?: Id) => void;
  setSelectSheetId: (id?: Id) => void;
  moveUp: (id: Id, exerciseId: Id) => void;
  moveDown: (id: Id, exerciseId: Id) => void;
  addInProgress: (id: Id) => void;
  removeInProgress: (id: Id) => void;
  addLoadedIfNotExists: (id: Id) => void;
  removeLoaded: (id: Id) => void;
  setPerformed: (date: Date, id: Id) => void;
  setTemplateOffset: (offset: number) => void;
};

const useWorkoutStore = create<State & Action>((set, get) => ({
  nextId: 0,
  templateOffset: 0,
  exerciseSheetId: undefined,
  selectSheetId: undefined,
  workouts: {},
  inProgress: [],
  loaded: [],

  setWorkout: (w: Workout) =>
    set((s) => ({ workouts: { ...s.workouts[w.id], [w.id]: w } })),

  getWorkout: (id: Id) => get().workouts[id],

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

  loadFromRow: (row: WorkoutRow) => {
    let id = get().createWorkout();
    get().setName(row.name, id);
    get().setPerformed(row.performed, id);
    get().addLoadedIfNotExists(id);
    return id;
  },

  setName: (name: Workout["name"], id: Workout["id"]) =>
    set((s) => ({
      workouts: { ...s.workouts, [id]: { ...s.workouts[id], name: name } },
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

  setExerciseSheetId: (id?: Id) => set((s) => ({ exerciseSheetId: id })),
  setSelectSheetId: (id?: Id) => set((s) => ({ selectSheetId: id })),

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

  addInProgress: (id: Id) =>
    set((s) => ({ inProgress: [id, ...s.inProgress] })),

  removeInProgress: (id: Id) => {
    // filter seems to be not working
    const index = get().inProgress.findIndex((i) => i == id);
    let copy = [...get().inProgress];
    copy.splice(index, 1);
    set(() => ({ inProgress: copy }));
  },

  addLoadedIfNotExists: (id: Id) => {
    if (get().loaded.includes(id)) {
      return;
    }
    set((s) => ({ loaded: [...s.loaded, id] }));
  },

  removeLoaded: (id: Id) =>
    set((s) => ({ loaded: s.loaded.filter((i) => i !== id) })),

  setPerformed: (date: Date, id: Id) =>
    set((s) => ({
      workouts: {
        ...s.workouts,
        [id]: { ...s.workouts[id], lastPerformed: date },
      },
    })),

  setTemplateOffset: (offset: number) =>
    set((s) => ({ templateOffset: offset })),
}));

export default useWorkoutStore;
