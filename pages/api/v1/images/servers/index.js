import prisma from "../../../../../lib/prisma";

export default async function handler(req, res) {
    let image_servers = await prisma.imageServer.findMany({});

    return res.status(200).send({
        status_code: 200,
        status: "Success",
        type: "sync",
        metadata: image_servers
    })
}