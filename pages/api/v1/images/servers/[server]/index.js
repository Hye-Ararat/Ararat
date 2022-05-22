import prisma from "../../../../../../lib/prisma";

export default async function handler(req, res) {
    const { query: { server } } = req;
    let image_server = await prisma.imageServer.findUnique({
        where: {
            id: server
        }
    })

    return res.status(200).send({
        status_code: 200,
        status: "Success",
        type: "sync",
        metadata: image_server
    })
}