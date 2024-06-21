import client from "@/util/web-client";

export default interface ImageModel {
  username: string;
  post_id: number;
  image_id: number;
}

export const download_image = (model: ImageModel) =>
  client.get(
    `/content/images/${model.username}/${model.post_id}/${model.image_id}`,
    { responseType: "blob", timeout: 3000 },
  );
