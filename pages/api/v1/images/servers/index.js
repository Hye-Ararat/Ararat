import decodeToken from "../../../../../lib/decodeToken";
import { getUserPermissions } from "../../../../../lib/getUserPermissions";
import prisma from "../../../../../lib/prisma";

export default async function handler(req, res) {
    const tokenData = decodeToken(req.headers["authorization"].split(" ")[1]);
    let image_servers = [];
    if ((await getUserPermissions(tokenData.id)).includes("list-images")) {
        image_servers = await prisma.imageServer.findMany({});
    } else {
        image_servers = await prisma.imageServer.findMany({
            where: {
                ImageServerUser: {
                    some: {
                        userId: tokenData.id
                    }
                }
            }
        });
    }


    return res.status(200).send({
        status_code: 200,
        status: "Success",
        type: "sync",
        metadata: image_servers
    })
}