import prisma from "../../../../lib/prisma";

export default async function handler(req, res) {
    let users = await prisma.user.findMany({
        select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            permissions: true,
            username: true,
            language: true
        }
    });
    return res.status(200).send({
        status_code: 200,
        status: "Success",
        type: "sync",
        metadata: users
    })
}