import { connectToDatabase } from "../../../../../util/mongodb";
import bcrypt from "bcrypt";
const { sign } = require("jsonwebtoken");

export default async function handler(req, res) {
	const {
		method,
		query: { id },
	} = req;
	switch (method) {
		case "POST": {
			let { db } = await connectToDatabase();
			var node = {
				name: req.body.name,
				address: {
					hostname: req.body.address.hostname,
					port: req.body.port,
				},
				access_token: access_token,
			};
			try {
				var node_insert = await db.collection("nodes").insertOne(node);
			} catch (error) {
				console.log(error);
				return res.status(500).send({
					status: "error",
					data: "An error occured while creating the node",
				});
			}
			node.id = node_insert.insertedId;
			var access_token_jwt = sign(node, process.env.ACCESS_TOKEN_SECRET, {
				algorithm: "HS256"
			});
			var access_token_identifier = access_token_jwt.substr(0, access_token_jwt.indexOf("."))
			var access_token = access_token_identifier + "::" + access_token_jwt;
			try {
				var salt = await bcrypt.genSalt(10);
				var hashed_key = await bcrypt.hash(access_token, salt);
			} catch (error) {
				console.log(error)
				return res.status(500).send({
					status: "error",
					data: "An error occured while creating the node",
				});
			}
			try {
			db.collection("nodes").updateOne({
				_id: node_insert.insertedId,
			}, {
				$set: {access_token: access_token_identifier + "::" + hashed_key}
			})
		} catch (error) {
			console.log(error)
			return res.status(500).send({
				status: "error",
				data: "An error occured while creating the node"
			})
		}
		return res.json({
			status: "success",
			data: {
				access_token: access_token,
			}
		})

			break;
		}
		default: {
			res.status(400).send({
				status: "error",
				data: "Method not allowed",
			});
		}
	}
}
