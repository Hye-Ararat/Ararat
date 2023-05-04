import Client from "hyexd";
import getNodeEnc from "../../../../../../../../../lib/getNodeEnc";
import prisma from "../../../../../../../../../lib/prisma";

export default async function handler(req, res) {
    const { method, query: { id, storage_pool, volume } } = req;
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
        certificate: Buffer.from(Buffer.from(getNodeEnc(node.encIV, node.certificate)).toString(), "base64").toString("ascii"),
        key: Buffer.from(Buffer.from(getNodeEnc(node.encIV, node.key)).toString(), "base64").toString("ascii")
    });
    switch (method) {
        case "PATCH":
            let patchedVolume;
            try {
                patchedVolume = await lxd.storagePool(storage_pool).volume(volume).partialUpdate(req.body);

            } catch (error) {
                console.log(error)
            }
            return res.status(200).send(patchedVolume);
    }
}