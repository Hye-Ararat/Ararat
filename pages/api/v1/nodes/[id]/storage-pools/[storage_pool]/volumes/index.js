import Client from "hyexd";
import getNodeEnc from "../../../../../../../../lib/getNodeEnc";
import prisma from "../../../../../../../../lib/prisma";

export default async function handler(req, res) {
    const { method, query: { id, storage_pool } } = req;
    const node = await prisma.node.findUnique({
        where: {
            id: id
        }
    })
    if (!node) return res.status(404).send({
        code: 404,
        error: "node not found",
        type: 'error'
    })
    const lxd = new Client("https://" + node.address + ":" + node.lxdPort, {
        certificate: Buffer.from(Buffer(getNodeEnc(node.encIV, node.certificate)).toString(), "base64").toString("ascii"),
        key: Buffer.from(Buffer(getNodeEnc(node.encIV, node.key)).toString(), "base64").toString("ascii")
    });
    switch (method) {
        case "GET":
            let volumes;
            try {
                volumes = await lxd.storagePool(storage_pool).volumes;
            } catch (error) {
                return res.status(500).send(error);
            }
            return res.status(volumes.status_code).send(volumes);
        default:
            return res.status(405).send({
                code: 405,
                error: "method not allowed",
                type: 'error'
            })
    }
}