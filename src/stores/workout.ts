import { ExerciseRow } from "@/db/row-models/exercise-model";
import { SetRow } from "@/db/row-models/set-model";
import { WorkoutSessionRow } from "@/db/row-models/workout-model";
import { create } from "zustand";

export type Id = number;

export type Workout = {
  id: Id;
  templateId?: Id;
  name: string;
  isLocked: boolean;
  lastPerformed?: Date;
  exerciseIds: Id[];
};

export type Exercise = {
  id: Id;
  presetId?: Id;
  name: string;
  timerDuration?: number;
  setIds: Id[];
};

export type Set = {
  id: Id;
  weight?: number;
  reps?: number;
  prevWeight?: number;
  prevReps?: number;
  finished: boolean;
};

type State = {
  nextId: Id;
  exerciseSheetId?: Id;
  selectSheetId?: Id;
  templateSheetId?: Id;
  templateOffset: number;
  inProgress: Id[];
  loaded: Id[];
  workouts: { [id: Id]: Workout };
  //exercises
  exercises: { [id: Id]: Exercise };
  // sets
  sets: { [id: Id]: Set };
};

type Action = {
  setWorkout: (w: Workout) => void;
  getWorkout: (id: Id) => Workout;
  setTemplateId: (id: Id, templateId: Id) => void;
  createWorkout: (templateId?: Id) => Id;
  deleteWorkout: (id: Id) => void;
  loadFromRow: (row: WorkoutSessionRow) => Id;
  setName: (name: Workout["name"], id: Workout["id"]) => void;
  addExercise: (id: Id, exerciseId: Id) => void;
  removeExercise: (id: Id, exerciseId: Id) => void;
  toggleLocked: (id: Id) => void;
  setExerciseSheetId: (id?: Id) => void;
  setSelectSheetId: (id?: Id) => void;
  setTemplateSheetId: (id?: Id) => void;
  moveUp: (id: Id, exerciseId: Id) => void;
  moveDown: (id: Id, exerciseId: Id) => void;
  isInProgress: (id: Id) => boolean;
  addInProgress: (id: Id) => void;
  removeInProgress: (id: Id) => void;
  addLoadedIfNotExists: (id: Id) => void;
  removeLoaded: (id: Id) => void;
  setPerformed: (date: Date, id: Id) => void;
  setTemplateOffset: (offset: number) => void;
  // exercises
  setExercise: (e: Exercise) => void;
  getExercise: (id: Id) => Exercise;
  createExercise: () => Id;
  createFromRow: (row: ExerciseRow) => Id;
  deleteExercise: (id: Id) => void;
  setExerciseId: (id: Id, exerciseId: Id) => void;
  setTimerDuration: (id: Id, duration?: number) => void;
  addSet: (id: Id, setId: Id) => void;
  popSet: (id: Id) => Id | undefined;
  setExerciseName: (id: Id, name: string) => void;
  // sets
  getSet: (id: Id) => Set;
  createSet: () => Id;
  createFromSetRow: (row: SetRow) => Id;
  deleteSet: (id: Id) => void;
  setWeight: (weight: Set["weight"], id: Set["id"]) => void;
  setReps: (reps: Set["reps"], id: Set["id"]) => void;
  setPrev: (w: Set["prevWeight"], r: Set["prevReps"], id: Set["id"]) => void;
  toggleFinished: (id: Id) => void;
  resetSet: (id: Id) => void;
};

const useWorkoutStore = create<State & Action>((set, get) => ({
  nextId: 0,
  nextTemplateId: 0,
  templateOffset: 0,
  exerciseSheetId: undefined,
  selectSheetId: undefined,
  templateSheetId: undefined,
  workouts: {},
  inProgress: [],
  loaded: [],

  setWorkout: (w: Workout) =>
    set((s) => ({ workouts: { ...s.workouts[w.id], [w.id]: w } })),

  getWorkout: (id: Id) => get().workouts[id],

  setTemplateId: (id: Id, templateId: Id) =>
    set((s) => ({
      workouts: {
        ...s.workouts,
        [id]: { ...s.workouts[id], templateId: templateId },
      },
    })),

  createWorkout: (templateId?: Id) => {
    let id = get().nextId;
    let w: Workout = {
      id: id,
      templateId: templateId,
      exerciseIds: [],
      isLocked: false,
      name: "New Workout",
    };
    set((s) => ({ workouts: { ...s.workouts, [id]: w }, nextId: id + 1 }));
    return id;
  },

  deleteWorkout: (id: Id) =>
    set((s) => {
      const { [id]: _, ...objs } = s.workouts;
      return { workouts: objs };
    }),

  loadFromRow: (row: WorkoutSessionRow) => {
    let id = get().createWorkout(row.templateId);
    get().setName(row.name, id);
    get().setPerformed(row.performed, id);
    get().addLoadedIfNotExists(id);
    return id;
  },

  setName: (name: Workout["name"], id: Workout["id"]) =>
    set((s) => ({
      workouts: { ...s.workouts, [id]: { ...s.workouts[id], name: name } },
    })),

  isInProgress: (id: Id) => get().inProgress.includes(id),

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
  setTemplateSheetId: (id?: Id) => set((s) => ({ templateSheetId: id })),

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

  // exercises
  exercises: {},

  setExercise: (ex: Exercise) =>
    set((s) => ({ exercises: { ...s.exercises, [ex.id]: ex } })),

  getExercise: (id: Id) => get().exercises[id],

  setExerciseId: (id: Id, exerciseId: Id) =>
    set((s) => ({
      exercises: {
        ...s.exercises,
        [id]: { ...s.exercises[id], presetId: exerciseId },
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

  setExerciseName: (id: Id, name: string) => {
    set((s) => {
      return {
        exercises: { ...s.exercises, [id]: { ...s.exercises[id], name: name } },
      };
    });
  },

  // sets
  sets: {},

  getSet: (id: Id) => get().sets[id],

  createSet: () => {
    let prevId = get().nextId;
    set((s) => ({
      nextId: s.nextId + 1,
      sets: { ...s.sets, [s.nextId]: { id: s.nextId, finished: false } },
    }));
    return prevId;
  },

  createFromSetRow: (row: SetRow) => {
    let id = get().createSet();
    get().setPrev(row.weight, row.reps, id);
    return id;
  },

  deleteSet: (id: Id) =>
    set((s) => {
      const { [id]: _, ...objs } = s.sets;
      return { sets: objs };
    }),

  setWeight: (weight: Set["weight"], id: Set["id"]) =>
    set((s) => ({
      sets: { ...s.sets, [id]: { ...s.sets[id], weight: weight } },
    })),

  setReps: (reps: Set["reps"], id: Set["id"]) =>
    set((s) => ({ sets: { ...s.sets, [id]: { ...s.sets[id], reps: reps } } })),

  setPrev: (w: Set["prevWeight"], r: Set["prevReps"], id: Set["id"]) =>
    set((s) => ({
      sets: { ...s.sets, [id]: { ...s.sets[id], prevWeight: w, prevReps: r } },
    })),

  toggleFinished: (id: Id) =>
    set((s) => ({
      sets: {
        ...s.sets,
        [id]: { ...s.sets[id], finished: !s.sets[id].finished },
      },
    })),

  resetSet: (id: Id) => {
    let theSet = get().getSet(id);
    set((s) => ({
      sets: {
        ...s.sets,
        [id]: {
          id: theSet.id,
          reps: undefined,
          weight: undefined,
          prevReps: theSet.reps,
          prevWeight: theSet.weight,
          finished: false,
        },
      },
    }));
  },
}));

export default useWorkoutStore;
