import decodeToken from "../../../../../../lib/decodeToken";
import { getUserPermissions } from "../../../../../../lib/getUserPermissions";
import prisma from "../../../../../../lib/prisma";

export default async function handler(req, res) {
    const tokenData = decodeToken(req.headers["authorization"].split(" ")[1]);
    const { query: { server } } = req;
    let image_server = null;
    if ((await getUserPermissions(tokenData.id)).includes("list-images")) {
        image_server = await prisma.imageServer.findUnique({
            where: {
                id: server
            }
        });
    } else {
        let tempImageServer = await prisma.imageServer.findUnique({
            where: {
                id: server,
            },
            include: {
                users: {
                    select: {
                        userId: true
                    }
                }
            }
        })
        let found = false;
        let iterations = 0;
        while (!found && iterations < tempImageServer.users.length) {
            if (tempImageServer.users[iterations].userId == tokenData.id) {
                found = true;
            }
            iterations += 1;
        }
        if (found) {
            image_server = tempImageServer;
        }
    }
    if (!image_server) {
        return res.status(403).send({
            status_code: 403,
            status: "Forbidden",
            type: "error",
            "error": "You are not allowed to access this resource"
        })
    }
    delete image_server.users;

    return res.status(200).send({
        status_code: 200,
        status: "Success",
        type: "sync",
        metadata: image_server
    })
}