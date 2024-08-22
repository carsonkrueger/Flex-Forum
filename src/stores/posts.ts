import { PostModel } from "@/models/post-model";
import { Id } from "./workout";
import { create } from "zustand";

type State = { posts: { [id: Id]: PostModel }; oldestDate?: Date };

type Action = {
  addPosts: (posts: PostModel[]) => void;
  addPost: (post: PostModel) => void;
  getPost: (id: Id) => PostModel;
};

const usePostStore = create<State & Action>((set, get) => ({
  posts: {},
  oldestDate: undefined,

  addPosts: (posts: PostModel[]) => {
    const temp = { ...get().posts };
    posts.map((p) => (temp[p.id] = p));
    set((s) => ({ posts: { ...s.posts, ...temp } }));
  },

  addPost: (post: PostModel) =>
    set((s) => ({ posts: { ...s.posts, [post.id]: post } })),

  getPost: (id: Id) => get().posts[id],
}));

export default usePostStore;
