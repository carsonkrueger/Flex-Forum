import { create } from "zustand";

type State = {
  userId?: number;
};

type Action = {
  setUserId: (id: State["userId"]) => void;
};

const useUserStore = create<State & Action>((set) => ({
  userId: undefined,
  setUserId: (id) => set(() => ({ userId: id })),
}));

export default useUserStore;
