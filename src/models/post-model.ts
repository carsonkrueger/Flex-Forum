import { MY_DATE_FORMAT } from "@/util/dates";
import client from "@/util/web-client";
import { format, parse } from "date-fns";

export type PostType = "workout" | "images";

export interface PostModel {
  id: number;
  username: string;
  num_images: number;
  post_type: PostType;
  description: string | null;
  created_at: Date;
  num_likes: number;
  is_liked: boolean;
}

interface PrivatePostModel {
  id: number;
  username: string;
  num_images: number;
  post_type: PostType;
  description: string | null;
  created_at: string;
  num_likes: number;
  is_liked: boolean;
}

export const downloadNextPosts = async (from: Date): Promise<PostModel[]> => {
  const date = format(from, MY_DATE_FORMAT);
  let posts: PostModel[] = [];
  let post = await client.get<PrivatePostModel[]>(`/content/posts/${date}`);
  for (let i = 0; i < post.data.length; ++i) {
    posts.push({
      ...post.data[i],
      created_at: parse(post.data[i].created_at, MY_DATE_FORMAT, new Date()),
    });
  }
  return posts;
};
