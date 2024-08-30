import { PostModel } from "@/models/post-model";
import { Id } from "./workout";
import { create } from "zustand";
import { likePost, unlikePost } from "@/models/like-model";

type State = {
  postIds: Id[];
  posts: { [id: Id]: PostModel };
  oldestDate?: Date;
};

type Action = {
  addPosts: (posts: PostModel[]) => void;
  setPosts: (posts: PostModel[]) => void;
  addPost: (post: PostModel) => void;
  getPost: (id: Id) => PostModel;
  setOldestDate: (date: State["oldestDate"]) => void;
  toggleLiked: (id: Id) => Promise<void>;
};

const usePostStore = create<State & Action>((set, get) => ({
  posts: {},
  oldestDate: undefined,
  postIds: [],

  addPosts: (posts: PostModel[]) => {
    const temp = { ...get().posts };
    posts.map((p) => (temp[p.id] = p));
    const newIds = posts.map((p) => p.id);
    set((s) => ({
      posts: { ...s.posts, ...temp },
      postIds: [...s.postIds, ...newIds],
    }));
  },

  setPosts: (posts: PostModel[]) => {
    const temp = { ...get().posts };
    posts.map((p) => (temp[p.id] = p));
    const newIds = posts.map((p) => p.id);
    set((s) => ({
      posts: temp,
      postIds: newIds,
    }));
  },

  addPost: (post: PostModel) =>
    set((s) => ({ posts: { ...s.posts, [post.id]: post } })),

  getPost: (id: Id) => get().posts[id],

  setOldestDate: (date: State["oldestDate"]) =>
    set((s) => ({ oldestDate: date })),

  toggleLiked: async (id: Id) => {
    const post = get().getPost(id);
    const postModelId = post.id;

    set((s) => ({
      posts: {
        ...s.posts,
        [id]: {
          ...s.posts[id],
          is_liked: !post.is_liked,
          num_likes: post.is_liked ? post.num_likes - 1 : post.num_likes + 1,
        },
      },
    }));

    if (post.is_liked) await likePost(postModelId);
    else await unlikePost(postModelId);
  },
}));

export default usePostStore;
