import decodeToken from "../../../../../../lib/decodeToken";
import Permissions from "../../../../../../lib/permissions/index.js";
import { errorResponse } from "../../../../../../lib/responses.js";
import prisma from "../../../../../../lib/prisma.js";

export default async function handler(req, res) {
    const tokenData = decodeToken(req.headers["authorization"].split(" ")[1]);
    const { query: { server } } = req;
    let permissions = new Permissions(tokenData.id);
    if (!await permissions.imageServer(server).useImages) return res.status(403).send(errorResponse("You are not allowed to use this image server.", 403))
    let image_server = await prisma.imageServer.findUnique({
        where: {
            id: server
        }
    })
    if (!image_server) return res.status(404).send(errorResponse("Image server does not exist.", 404))
    return res.status(200).send({
        status_code: 200,
        status: "Success",
        type: "sync",
        metadata: image_server
    })
}