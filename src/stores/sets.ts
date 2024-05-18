import { Id } from "./workout";
import { create } from "zustand";

export type Set = {
  id: Id;
  weight?: number;
  reps?: number;
  prevWeight?: number;
  prevReps?: number;
};

type State = { nextId: Id; sets: { [id: Id]: Set } };

type Action = {
  createSet: () => Id;
  setWeight: (weight: Set["weight"], id: Set["id"]) => void;
  setReps: (reps: Set["reps"], id: Set["id"]) => void;
  setPrev: (w: Set["prevWeight"], r: Set["prevReps"], id: Set["id"]) => void;
};

const useSetStore = create<State & Action>((set, get) => ({
  nextId: 0,
  sets: {},

  createSet: () => {
    let prevId = get().nextId;
    set((s) => ({
      nextId: s.nextId + 1,
      sets: { ...s.sets, [s.nextId]: { id: s.nextId } },
    }));
    return prevId;
  },

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
}));

export default useSetStore;
