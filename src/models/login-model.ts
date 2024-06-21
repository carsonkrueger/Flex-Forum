import client from "@/util/web-client";

export default interface LoginModel {
  username: string;
  password: string;
}

export interface UserModel {
  username: string;
  first_name: string;
  last_name: string;
}

export const login = (model: LoginModel): Promise<void> =>
  client.post("/users/login", model);
