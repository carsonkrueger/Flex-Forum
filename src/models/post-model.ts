import client from "@/util/web-client";

export interface PostModel {
  id: number;
  username: string;
  num_images: number;
  description: string;
  created_at: Date;
}

export const downloadNextFivePosts = (after: string): Promise<PostModel[]> =>
  client.get(`/content/posts/${after}`).then((res) => res.data);
