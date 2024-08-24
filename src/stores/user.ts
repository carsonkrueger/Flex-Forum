import { PostModel } from "@/models/post-model";
import client from "@/util/web-client";
import { create } from "zustand";

export type User = {
  username: string;
  postIds: number[];
  isFollowing: boolean;
};

type State = {
  username?: string;
  users: { [username: string]: User };
};

type Action = {
  setUsername: (id: State["username"]) => void;
  logOut: () => void;
  addUser: (user: User) => void;
  addUsersFromPosts: (posts: PostModel[]) => void;
  getUser: (username: string) => User | undefined;
  setIsFollowing: (username: string, isFollowing: boolean) => void;
};

const useUserStore = create<State & Action>((set, get) => ({
  users: {},

  setUsername: (username) => set(() => ({ username: username })),

  logOut: () => {
    client.defaults.jar?.removeAllCookiesSync();
    get().setUsername(undefined);
  },

  addUser: (user: User) => {
    const username = user.username;
    let postIds: number[] = [];
    let foundUser = get().getUser(username);
    let isFollowing = user.isFollowing;
    if (foundUser !== undefined) {
      let filtered = user.postIds.filter((p) => foundUser.postIds.includes(p));
      if (filtered.length > 0) postIds = foundUser.postIds.concat(filtered);
    }
    set((s) => ({
      users: { ...s.users, [username]: { username, postIds, isFollowing } },
    }));
  },

  addUsersFromPosts: (posts: PostModel[]) => {
    let users: { [username: string]: User } = {};
    for (let i = 0; i < posts.length; i++) {
      let user = get().getUser(posts[i].username);
      if (user !== undefined && !user.postIds.includes(posts[i].id)) {
        user.postIds.push(posts[i].id);
      } else {
        user = {
          postIds: [posts[i].id],
          username: posts[i].username,
          isFollowing: posts[i].is_following,
        };
      }
      users[user.username] = user;
    }
    set((s) => ({ users: { ...s.users, ...users } }));
  },

  getUser: (username: string) => get().users[username],

  setIsFollowing: (username: string, isFollowing: boolean) =>
    set((s) => ({
      users: { ...s.users, [username]: { ...s.users[username], isFollowing } },
    })),
}));

export default useUserStore;
