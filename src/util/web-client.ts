import Axios from "axios";

import { wrapper } from "axios-cookiejar-support";
import { CookieJar } from "tough-cookie";

export const base_url = "http://192.168.1.8:3001";

const jar = new CookieJar();
const client = wrapper(
  Axios.create({ baseURL: base_url, jar: jar, withCredentials: true }),
);

export const printCookieJar = () => {
  console.log(client.defaults.headers);
  // console.log(
  //   jar?.getCookies(base_url, (err, cookies) => {
  //     console.log(`cookies: ${cookies}`);
  //   }),
  // );
};

export default client;
