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
            let storage_pools = [];
            let pools;
            try {
                pools = await lxd.storagePools()
            } catch (error) {
                console.log(error)
                return res.status(500).send(error);
            }
            pools.metadata.forEach((pool, index) => {
                pools.metadata[index] = pool.replace("/1.0/storage-pools/", "")
            })
            pools.metadata.forEach(async (pool, index) => {
                let e = await lxd.storagePool(pool).data
                storage_pools.push(e.metadata)
            })
            function ready() {
                return new Promise((resolve, reject) => {
                    let interval = setInterval(() => {
                        if (pools.metadata.length == storage_pools.length) {
                            clearInterval(interval)
                            resolve(storage_pools)
                        }
                    }, 1)
                })
            }
            await ready();
            console.log(pools)
            return res.status(200).send(
                {
                    ...pools,
                    metadata: storage_pools
                });
    }
}