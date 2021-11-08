import { decode, sign } from "jsonwebtoken";
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
				var refresh_token = decode(
					req.body.refresh_token,
					process.env.REFRESH_TOKEN_SECRET
				);
			} catch {
				return res.status(403).json({ status: "error", data: "Unauthorized" });
			}
			if (!refresh_token)
				return res.status(403).json({ status: "error", data: "Unauthorized" });
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
			let access_token = sign(user, process.env.ACCESS_TOKEN_SECRET, {
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
