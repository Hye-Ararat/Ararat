import crypto from "crypto"
const { sign } = require("jsonwebtoken");
import { PrismaClient } from "@prisma/client";

export default async function handler(req, res) {
	const {
		method,
		query: { id },
	} = req;
	switch (method) {
		case "POST": {
			const prisma = new PrismaClient();
			try {
				var node_insert = await prisma.node.create({
					data: {
						name: req.body.name,
						hostname: req.body.hostname,
						port: req.body.port,
						ssl: req.body.ssl,
						memory: req.body.memory,
						cpu: req.body.cpu,
						disk: req.body.disk,
						accessToken: "",
						accessTokenIV: ""
					}
				})
			} catch (error) {
				console.log(error)
				return res.status(500).send("An error occured while creating the node",);
			}
			var access_token_jwt = sign(node_insert, process.env.ENC_KEY, {
				algorithm: "HS256"
			});
			var access_token_identifier = access_token_jwt.substring(0, access_token_jwt.indexOf("."))
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
				await prisma.node.update({
					where: {
						id: node_insert.id
					},
					data: {
						accessToken: access_token_identifier + "::" + hashed_key.toString("hex"),
						accessTokenIV: iv.toString("hex")
					}
				})
			} catch (error) {
				console.log(error)
				return res.status(500).send("An error occured while creating this node")
			}
			return res.json({
				access_token: access_token,
				id: node_insert.id,
				panel_url: process.env.URL
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
