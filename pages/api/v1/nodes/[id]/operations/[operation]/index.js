import Client from "hyexd";
import getNodeEnc from "../../../../../../../lib/getNodeEnc";
import prisma from "../../../../../../../lib/prisma";


export default async function handler(req, res) {
    const { query: { id, operation: operationID }, method } = req;

    const node = await prisma.node.findUnique({
        where: {
            id: id
        }
    })
    if (!node) return res.status(404).send({
        "code": 404,
        "error": "node not found",
        "type": "error"
    });

    const lxd = new Client("https://" + node.address + ":" + node.lxdPort, {
        certificate: Buffer.from(Buffer(getNodeEnc(node.encIV, node.certificate)).toString(), "base64").toString("ascii"),
        key: Buffer.from(Buffer(getNodeEnc(node.encIV, node.key)).toString(), "base64").toString("ascii")
    })


    switch (method) {
        case "GET":
            let operation;
            try {
                operation = await (lxd.operation(operationID)).data
            } catch (error) {
                return res.status(error.error_code).send(error);
            }

            if (operation.metadata.resources) {
                delete operation.metadata.resources.containers;
                operation.metadata.resources.instances.forEach((instance, index) => {
                    operation.metadata.resources.instances[index] = instance.replace("/1.0", "/api/v1")
                })
            }
            return res.status(200).send(operation);
        case "DELETE":
            return;
        default:
            return res.status(405).send({
                "code": 405,
                "error": "method not allowed",
                "type": "error"
            })
    }
}