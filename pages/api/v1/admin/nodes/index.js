import crypto from "crypto"
const { sign } = require("jsonwebtoken");
import prisma from "../../../../../lib/prisma";
export default async function handler(req, res) {
	const {
		method,
	} = req;
	switch (method) {
		case "POST":
			let node;
			try {
				node = await prisma.node.create({
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
			} catch {
				return res.status(500).send("Internal Server Error");
			}

			const access_token_jwt = sign(node_insert, process.env.ENC_KEY, {
				algorithm: "HS256"
			});
			const access_token_identifier = access_token_jwt.substring(0, access_token_jwt.indexOf("."))
			const access_token = access_token_identifier + "::" + access_token_jwt;

			let hashed_key;
			try {
				const iv = crypto.randomBytes(16);
				const cipher = crypto.createCipheriv("aes-256-ctr", process.env.ENC_KEY, iv)
				hashed_key = Buffer.concat([cipher.update(access_token), cipher.final()]);
			} catch (error) {
				await prisma.node.delete({
					where: {
						id: node.id
					}
				})
				return res.status(500).send("Internal Server Error");
			}

			try {
				await prisma.node.update({
					where: {
						id: node.id
					},
					data: {
						accessToken: access_token_identifier + "::" + hashed_key.toString("hex"),
						accessTokenIV: iv.toString("hex")
					}
				})
			} catch (error) {
				await prisma.node.delete({
					where: {
						id: node.id
					}
				});
				return res.status(500).send("Internal Server Error")
			}

			return res.status(201).send({
				access_token: access_token,
				id: node.id,
				panel_url: process.env.PANEL_URL,
				node: node
			});
			break;
		default: {
			res.status(400).send("Method not allowed");
		}
	}
}
