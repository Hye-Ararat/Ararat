import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import prisma from "../../../../lib/prisma";

export default async function handler(req, res) {
    const user = await prisma.user.findUnique({
        where: {
            email: req.body.email
        },
        include: {
            permissions: {
                select: {
                    permission: true
                }
            }
        }
    })
    const authErr = {
        code: 401,
        error: "Incorrect email/username or password",
        type: "error"
    }
    if (!user) return res.status(401).send(authErr)

    const match = await compare(req.body.password, user.password);
    if (!match) return res.status(401).send(authErr);
    let permissions = [];
    user.permissions.forEach(async permission => {
        permissions.push(permission.permission);
    });

    const refreshToken = sign({
        type: "refresh",
        user: user.id
    }, process.env.ENC_KEY, {
        algorithm: "HS256",
        expiresIn: "7d"
    })

    const accessToken = sign({
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        language: user.language,
        permissions: permissions
    }, process.env.ENC_KEY, {
        algorithm: "HS256",
        expiresIn: "7d"
    });

    return res.status(200).send({
        type: "sync",
        status: "Success",
        status_code: 200,
        operation: "",
        error_code: 0,
        error: "",
        metadata: {
            refreshToken: refreshToken,
            accessToken: accessToken
        }

    })
}