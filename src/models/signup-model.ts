import client from "@/util/web-client";

export interface SignupModel {
  username: string;
  password: string;
  first_name: string;
  last_name: string;
  email: string;
}

export default interface SignupViewModel {
  username: string;
  password: string;
  repeat_password: string;
  first_name: string;
  last_name: string;
  email: string;
}

export const signup = (model: SignupViewModel): Promise<void> =>
  client.post(`/users/signup`, model);
