import axios from "axios";

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

export const signup = (model: SignupViewModel) =>
  axios
    .post("http://192.168.1.6:3001/users/signup", model)
    .then((res) => res.data);
