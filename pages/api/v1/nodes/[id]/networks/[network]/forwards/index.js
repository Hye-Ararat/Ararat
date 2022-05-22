import Client from "hyexd";
import getNodeEnc from "../../../../../../../../lib/getNodeEnc";
import prisma from "../../../../../../../../lib/prisma";

export default async function handler(req, res) {
    const { method, query: { id, network } } = req;
    const node = await prisma.node.findUnique({
        where: {
            id: id
        }
    })
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
        case "GET":
            let networkForwards = await lxd.network(network).forwards;
            return res.status(200).send(networkForwards);
        case "POST":
            let { name, listen_address, ports, config } = req.body;
            let forward = await lxd.network(network).createForward(name, listen_address, ports, config);
            return res.status(200).send(forward);

    }
}