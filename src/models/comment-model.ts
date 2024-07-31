import client from "@/util/web-client";

export default interface CommentModel {
  username: string;
  description: string;
  created_at: Date;
}

export const getNewerComments = async (
  post_id: number,
  from: Date | undefined,
): Promise<CommentModel[]> =>
  (await client.get<CommentModel[]>(`/posts/${post_id}?from=${from}`)).data;
