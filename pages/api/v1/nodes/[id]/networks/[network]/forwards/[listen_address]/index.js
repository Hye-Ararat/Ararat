import Client from "hyexd";
import getNodeEnc from "../../../../../../../../../lib/getNodeEnc";
import prisma from "../../../../../../../../../lib/prisma";

export default async function handler(req, res) {
    const { method, query: { id, network, listen_address } } = req;
    const node = await prisma.node.findUnique({
        where: {
            id: id
        }
    });
    if (!node) return res.status(404).send({
        code: 404,
        error: "node not found",
        type: "error"
    });

    const lxd = new Client("https://" + node.address + ":" + node.lxdPort, {
        certificate: Buffer.from(Buffer(getNodeEnc(node.encIV, node.certificate)).toString(), "base64").toString("ascii"),
        key: Buffer.from(Buffer(getNodeEnc(node.encIV, node.key)).toString(), "base64").toString("ascii")
    });
    switch (method) {
        case "PATCH":
            let networkForward = await lxd.network(network).forward(listen_address).partialUpdate(req.body);
            return res.status(200).send(networkForward);
    }
}