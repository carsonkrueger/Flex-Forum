import { create } from "zustand";

type State = {
  username?: string;
};

type Action = {
  setUsername: (id: State["username"]) => void;
};

const useUserStore = create<State & Action>((set) => ({
  userId: undefined,
  setUsername: (username) => set(() => ({ username: username })),
}));

export default useUserStore;
