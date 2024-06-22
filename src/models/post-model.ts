import client from "@/util/web-client";

export interface PostModel {
  username: string;
  num_images: number;
  description: string;
  created_at: Date;
}

export const downloadPost = (createdAt: {
  created_at: string;
}): Promise<PostModel[]> =>
  client.get(`/content/posts`).then((res) => res.data);
