import axios from "axios";
import nookies from "nookies";
function login(email, password) {
	return new Promise(async (resolve, reject) => {
		try {
			var auth_response = await axios.post(
				`/api/v1/client/auth/login`,
				{
					email: email,
					password: password,
				}
			);
		} catch (error) {
			return reject(Error("An error occured while sending the request"));
		}
		auth_response = auth_response.data;
		if (auth_response.status == "success") {
			nookies.set(null, "access_token", auth_response.data.access_token, {
				expires: new Date(new Date().getTime() + 15 * 60 * 1000),
				path: "/",
			});
			nookies.set(null, "refresh_token", auth_response.data.refresh_token, {
				expires: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
				path: "/",
			});
			return resolve("Success");
		} else {
			return reject(Error(auth_response.data));
		}
	});
}
export default login;
