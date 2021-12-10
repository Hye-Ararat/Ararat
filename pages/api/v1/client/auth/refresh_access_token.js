import { verify, sign } from "jsonwebtoken";
import { connectToDatabase } from "../../../../../util/mongodb";
import { ObjectId } from "mongodb";
export default async function handler(req, res) {
	const { method } = req;
	switch (method) {
		case "POST":
			if (!req.body.refresh_token)
				return res
					.status(400)
					.json({ status: "error", data: "Refresh token is required" });
			try {
				var refresh_token = verify(
					req.body.refresh_token,
					process.env.ENC_KEY
				);
			} catch (error){
				console.log(error)
				res.setHeader('Set-Cookie', `refresh_token=; Path=/; Expires=${new Date(0).toUTCString()}`);
				return res.status(403).send("Unauthorized");
			}
			if (!refresh_token) {
			res.setHeader('Set-Cookie', `refresh_token=; Path=/; Expires=${new Date(0).toUTCString()}`);
				return res.status(403).send("Unauthorized");
			}
			var { db } = await connectToDatabase();
			try {
				var user_data = await db.collection("users").findOne({
					_id: ObjectId(refresh_token.user),
				});
			} catch {
				res
					.status(500)
					.json({
						status: "error",
						data: "An error occured whiel generating the access token",
					});
			}
			if (!user_data)
				return res.status(403).json({ status: "error", data: "Unauthorized" });
			let user = {
				id: user_data._id,
				username: user_data.username,
				last_name: user_data.lastname,
				first_name: user_data.firstname,
				admin: user_data.admin,
				email: user_data.email,
				preferences: user_data.preferences,
				phone_number: user_data.phone_number,
			};
			let access_token = sign(user, process.env.ENC_KEY, {
				algorithm: "HS256",
				expiresIn: "15m",
			});
			return res.json({
				status: "success",
				data: {
					access_token: access_token,
				},
			});
			break;
		default:
			return res
				.status(405)
				.json({ status: "error", data: "Method not allowed" });
	}
}
