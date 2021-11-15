import axios from "axios";
import nookies from "nookies";

async function SignUp(name, surname, username, email, password) {
	return new Promise(async (resolve, reject) => {
		try {
			var auth_response = await axios.post(
				`/api/v1/client/auth/login`,
				{
                    name: name,
                    surname: surname,
                    username: username,
					email: email,
					password: password,
				}
			);
		} catch (error) {
			return reject(Error("An error occured while sending the request"));
		}
        auth_response = auth_response.data;
	});
}
export default SignUp;