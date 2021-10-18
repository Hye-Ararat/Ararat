import axios from "axios";
import Cookies from "js-cookie";
function login(email, password) {
  return new Promise((resolve, reject) => {
    const auth_response = axios.post(`https://basalt.hye.gg:2221/auth/login`, {
      username: email,
      password: password,
    }).data;
    if (auth_response.status == "error") reject(Error(auth_response.data));
    var FifteenMinutes = new Date(new Date().getTime() + 15 * 60 * 1000);
    try {
      Cookies.set("access_token", auth_response.access_token, {
        sameSite: "strict",
        secure: true,
        expires: FifteenMinutes,
      });
    } catch (error) {
      reject(Error("An error occured while setting the access token cookie"));
    }
    try {
      Cookies.set("refresh_token", auth_response.refresh_token, {
        sameSite: "strict",
        secure: true,
        expires: FifteenMinutes,
      });
    } catch (error) {
      Cookies.remove("access_token");
      reject(Error("An error occured while setting the refresh token cookie"));
    }
    resolve("Success");
  });
}
export default login;
