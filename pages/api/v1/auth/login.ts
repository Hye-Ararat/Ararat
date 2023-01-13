import { NextApiRequest, NextApiResponse } from "next";
import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import prisma from "../../../../lib/prisma";
import { errorResponse, standardResponse } from "../../../../lib/responses";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const {email, password} = JSON.parse(req.body);
    const user = await prisma.user.findUnique({
        where: {
            email
        },
        include: {
            permissions: true,
        }
    });
    let authError = errorResponse(400, 400, "Invalid email or password")
    if (!user) return res.status(401).send(authError)
    const match = await compare(password, user.password);
    if (!match) return res.status(401).send(authError);

    const authorization = sign({
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        language: user.language,
        permissions: user.permissions,
    }, process.env.ENC_KEY as any, {
        algorithm: "HS256",
        expiresIn: "7d"
    })
    return res.status(200).send(standardResponse(200, 200, {
        authorization
    }))
}