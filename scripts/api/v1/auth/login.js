import axios from "axios";
import nookies from "nookies";
function login(email, password) {
  return new Promise(async (resolve, reject) => {
    try {
      var auth_response = await axios.post(`/api/v1/client/auth/login`, {
        email: email,
        password: password
      });
    } catch (error) {
      if (error.response.status == 401) return reject(String(error.response.data.data));
      else return reject("An error occured while sending the request.");
    }
    auth_response = auth_response.data;
    nookies.set(null, "access_token", auth_response.access_token, {
      expires: new Date(new Date().getTime() + 15 * 60 * 1000),
      path: "/"
    });
    nookies.set(null, "refresh_token", auth_response.refresh_token, {
      expires: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
      path: "/"
    });
    return resolve("Success");
  });
}
export default login;
