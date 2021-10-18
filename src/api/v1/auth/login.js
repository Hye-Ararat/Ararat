import axios from "axios";
import Cookies from "js-cookie";
function login(email, password) {
  return new Promise((resolve, reject) => {
    axios
      .post(`${process.env.REACT_APP_BASALT_URL}/api/v1/client/auth/login`, {
        email: email,
        password: password,
      })
      .then((auth_response) => {
        let auth_data = auth_response.data;
        if (auth_data.status == "error") return reject(Error(auth_data.data));
        var FifteenMinutes = new Date(new Date().getTime() + 15 * 60 * 1000);
        try {
          Cookies.set("access_token", auth_data.data.access_token, {
            sameSite: "strict",
            secure: true,
            expires: FifteenMinutes,
          });
        } catch (error) {
          return reject(
            Error("An error occured while setting the access token cookie")
          );
        }
        try {
          Cookies.set("refresh_token", auth_data.data.refresh_token, {
            sameSite: "strict",
            secure: true,
            expires: FifteenMinutes,
          });
        } catch (error) {
          Cookies.remove("access_token");
          return reject(
            Error("An error occured while setting the refresh token cookie")
          );
        }
        return resolve("Success");
      })
      .catch(() => {
        return reject(Error("An error occured while sending the request"));
      });
  });
}
export default login;
