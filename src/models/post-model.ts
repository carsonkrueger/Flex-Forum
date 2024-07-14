import client from "@/util/web-client";

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

export const downloadNextPosts = (after: string): Promise<PostModel[]> =>
  client.get(`/content/posts/${after}`).then((res) => res.data);
