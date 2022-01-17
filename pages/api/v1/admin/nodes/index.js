import { connectToDatabase } from "../../../../../util/mongodb";
import crypto from "crypto"
const { sign } = require("jsonwebtoken");

export default async function handler(req, res) {
	const {
		method,
		query: { id },
	} = req;
	switch (method) {
		case "POST": {
			let { db } = await connectToDatabase();
			try {
				var node = {
					name: req.body.name,
					address: {
						hostname: req.body.address.hostname,
						port: req.body.address.port,
						ssl: req.body.address.ssl
					},
					limits: {
						memory: req.body.limits.memory,
						cpu: req.body.limits.cpu,
						disk: req.body.limits.disk,
					},
					access_token: access_token,
				};
			} catch {
				return res
					.status(400)
					.send({ status: "error", data: "Invalid request" });
			}
			try {
				var node_insert = await db.collection("nodes").insertOne(node);
			} catch (error) {
				console.log(error)
				return res.status(500).send({
					status: "error",
					data: "An error occured while creating the node",
				});
			}
			node.id = node_insert.insertedId;
			var access_token_jwt = sign(node, process.env.ENC_KEY, {
				algorithm: "HS256"
			});
			var access_token_identifier = access_token_jwt.substr(0, access_token_jwt.indexOf("."))
			var access_token = access_token_identifier + "::" + access_token_jwt;
			try {
				var iv = crypto.randomBytes(16);
				let cipher = crypto.createCipheriv("aes-256-ctr", process.env.ENC_KEY, iv)
				var hashed_key = Buffer.concat([cipher.update(access_token), cipher.final()]);
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
					$set: {
						access_token: access_token_identifier + "::" + hashed_key.toString("hex"),
						access_token_iv: iv.toString("hex")
					}
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
					id: node_insert.insertedId,
					panel_url: process.env.URL
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
