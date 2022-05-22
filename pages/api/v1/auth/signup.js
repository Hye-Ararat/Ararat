import { genSalt, hash } from "bcryptjs";
import prisma from "../../../../lib/prisma";

export default async function handler(req, res) {
    if (!req.body.password) return res.status(400).send({
        code: 400,
        error: "bad request: password is required",
        type: "error"
    })
    let salt;
    let hashedPassword;
    try {
        salt = await genSalt(10);
        hashedPassword = await hash(req.body.password, salt);
    } catch (error) {
        return res.status(500).send({
            code: 500,
            error: "Internal Server Error",
            type: "error"
        });
    }
    let user;
    try {
        user = await prisma.user.create({
            data: {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                username: req.body.username,
                email: req.body.email,
                password: hashedPassword
            }
        })
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            code: 500,
            error: "Internal Server Error",
            type: "error"
        })
    }
    return res.status(201).send({
        type: "sync",
        status: "Success",
        status_code: 201,
        operation: "",
        error_code: 0,
        error: "",
        metadata: user
    })

}