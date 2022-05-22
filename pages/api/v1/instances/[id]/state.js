import Client from "hyexd";
import getInstancePermissions from "../../../../../lib/client/getInstancePermissions";
import decodeToken from "../../../../../lib/decodeToken";
import getNodeEnc from "../../../../../lib/getNodeEnc";
import prisma from "../../../../../lib/prisma";

export default async function handler(req, res) {
    const { query: { id }, method } = req;

    const tokenData = decodeToken(req.headers["authorization"].split(" ")[1]);


    const instance = await prisma.instance.findUnique({
        where: {
            id: id
        },
        include: {
            node: true,
            users: {
                select: {
                    permissions: true,
                    user: {
                        select: {
                            id: true,
                        }
                    }
                }
            }
        }
    })
    if (!instance) return res.status(404).send("Instance not found");

    const permissions = getInstancePermissions(tokenData, instance);
    switch (method) {
        case "PUT":
            const { state, force } = req.body;
            if (!state) return res.status(400).send({
                "code": 400,
                "error": "bad request: state is required",
                "type": "error"
            })

            const notAllowedError = {
                "code": 403,
                "error": "not allowed to perform this operation",
                "type": "error"
            };
            if (state == "start" && !permissions.includes("start-instance")) return res.status(403).send(notAllowedError);
            if (state == "stop" && !permissions.includes("stop-instance")) return res.status(403).send(notAllowedError);
            if (state == "restart" && !permissions.includes("restart-instance")) return res.status(403).send(notAllowedError);

            const lxd = new Client("https://" + instance.node.address + ":" + instance.node.lxdPort, {
                certificate: Buffer.from(Buffer(getNodeEnc(instance.node.encIV, instance.node.certificate)).toString(), "base64").toString("ascii"),
                key: Buffer.from(Buffer(getNodeEnc(instance.node.encIV, instance.node.key)).toString(), "base64").toString("ascii")
            })
            let operation;
            try {
                operation = await lxd.instance(id).updateState(state)
            } catch (error) {
                console.log(error)
                return res.status(500).send({
                    "code": 500,
                    "error": "internal server error",
                    "type": "error"
                })
            }
            return res.status(202).send(operation);
        default:
            return res.status(405).send({
                "code": 405,
                "error": "method not allowed",
                "type": "error"
            })
    }
}