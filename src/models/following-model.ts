import client from "@/util/web-client";

export const followUser = (username: String) =>
  client.post(`/content/follow/${username}`);

export const unfollowUser = (username: String) =>
  client.delete(`/content/follow/${username}`);
