import { SetRow } from "@/db/row-models/set-model";
import { Id } from "./workout";
import { create } from "zustand";

export type Set = {
  id: Id;
  weight?: number;
  reps?: number;
  prevWeight?: number;
  prevReps?: number;
  finished: boolean;
};

type State = { nextId: Id; sets: { [id: Id]: Set } };

type Action = {
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

const useSetStore = create<State & Action>((set, get) => ({
  nextId: 0,
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
      const newSets = { ...s.sets };
      delete newSets[id];
      return { sets: newSets };
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

export default useSetStore;
