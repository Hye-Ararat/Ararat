import { verify, sign, decode } from "jsonwebtoken";
import prisma from "../../../../../lib/prisma";


export default async function handler(req, res) {
	const { method } = req;
	switch (method) {
		case "POST":
			if (!req.body.refresh_token) return res.status(400).json("Refresh token is required");
			const valid = verify(req.body.refresh_token, process.env.ENC_KEY);
			if (!valid) {
				res.setHeader('Set-Cookie', `refresh_token=; Path=/; Expires=${new Date(0).toUTCString()}`);
				return res.status(403).send("Unauthorized");
			}


			const userID = decode(req.body.refresh_token).id;
			const user = await prisma.user.findUnique({
				where: {
					id: userID
				},
				include: {
					permissions: {
						select: {
							permission: true
						}
					}
				}
			});


			let permissions = [];
			user.permissions.forEach(async permission => permissions.push(permission.permission));

			const tokenData = {
				id: user.id,
				username: user.username,
				email: user.email,
				firstName: user.firstName,
				lastName: user.lastName,
				permissions: permissions,
			};

			const access_token = sign(tokenData, process.env.ENC_KEY, {
				algorithm: "HS256",
				expiresIn: "15m",
			});
			return res.status(200).send(access_token);
			break;
		default:
			return res.status(405).send("Method not allowed");
	}
}
