import client from "@/util/web-client";

export const likePost = (post_id: number) =>
  client.post(`/content/like/${post_id}`);

export const unlikePost = (post_id: number) =>
  client.delete(`/content/like/${post_id}`);
