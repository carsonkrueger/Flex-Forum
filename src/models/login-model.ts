import axios from "axios";

export default interface LoginModel {
  username: string;
  password: string;
}

export interface UserModel {
  username: string;
  first_name: string;
  last_name: string;
}

export const login = (model: LoginModel) =>
  // fetch("http://192.168.1.6:3001/users/login", {method: "Post", });
  axios
    .post("http://192.168.1.6:3001/users/login", model)
    .then((res) => res.data);
// axios.post("/users/login", model, {
//   timeout: 2000,
//   httpAgent: true,
//   baseURL: "192.168.1.6:3001",
// });
