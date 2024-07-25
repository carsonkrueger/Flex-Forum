import client from "@/util/web-client";
import { create } from "zustand";

type State = {
  username?: string;
};

type Action = {
  setUsername: (id: State["username"]) => void;
  logOut: () => void;
};

const useUserStore = create<State & Action>((set, get) => ({
  userId: undefined,
  setUsername: (username) => set(() => ({ username: username })),
  logOut: () => {
    client.defaults.jar?.removeAllCookiesSync();
    get().setUsername(undefined);
  },
}));

export default useUserStore;
