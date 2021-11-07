import { connectToDatabase } from "../../../../../../../util/mongodb";
import bcrypt from "brcyptjs";
import { sign } from "jsonwebtoken";
export default async function handler(req, res) {
	const {
		params: { id },
	} = req;
	let { db } = await connectToDatabase();
	var access_token_jwt = sign(
		{
			server_id: id,
			type: "monitor_access_token"
		},
		process.env.ACCESS_TOKEN_SECRET,
		{
			expiresIn: "15m",
			algorithm: "HS256",
		}
	);
	var access_token_identifier = access_token_jwt.substr(
		0,
		access_token_jwt.indexOf(".")
	);
	var access_token = access_token_identifier + ":::" + access_token_jwt;
	try {
		var salt = await bcrypt.genSalt(10);
		var hash = await bcrypt.hash(access_token, salt);
	} catch (error) {
		return res.status(500).send({
			status: "error",
			data: "An error occured while creeating the access token credentials",
		});
	}
	try {
		db.collection("sessions").insertOne({
			type: "monitor_access_token",
			access_token: hash,
			server_id: id,
		});
	} catch (error) {
		return res.status(500).send({
			status: "error",
			data: "An error occured while creating the access token credentials",
		});
	}
	return res.json({
		status: "success",
		data: {
			access_token: access_token,
		},
	});
}
