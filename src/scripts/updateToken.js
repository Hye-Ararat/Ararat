import axios from "axios";
import Cookies from "js-cookie";
async function updateToken() {
  axios.interceptors.request.use(async (config) => {
    if (Cookies.get("access_token")) return config;
    const new_access_token = await axios.get(
      `https://basalt.hye.gg:2221/auth/refreshAccessToken`
    );
    var FifteenMinutes = new Date(new Date().getTime() + 15 * 60 * 1000);
    Cookies.set("access_token", new_access_token.data.access_token, {
      sameSite: "strict",
      secure: true,
      expires: FifteenMinutes,
    });
  });
}
export default updateToken;
