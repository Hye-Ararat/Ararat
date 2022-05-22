import Client from "hyexd";
import getNodeEnc from "../../../../../../lib/getNodeEnc";
import prisma from "../../../../../../lib/prisma";

export default async function handler(req, res) {
    const { method, query: { id } } = req;
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
    })
    switch (method) {
        case "GET":
            let networks = [];
            let networkList;
            try {
                networkList = await lxd.networks()
            } catch (error) {
                console.log(error)
                return res.status(400).send(error);
            }
            networkList.metadata.forEach((network, index) => {
                networkList.metadata[index] = network.replace("/1.0/networks/", "")
            })
            networkList.metadata.forEach(async (network, index) => {
                let e = await lxd.network(network).data
                networks.push(e.metadata)
            })
            function ready() {
                return new Promise((resolve, reject) => {
                    let interval = setInterval(() => {
                        if (networkList.metadata.length == networks.length) {
                            clearInterval(interval)
                            resolve(true)
                        }
                    }, 1)
                })
            }
            await ready();
            return res.status(200).send(
                {
                    ...networkList,
                    metadata: networks
                });
    }
}