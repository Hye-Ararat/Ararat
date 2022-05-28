import Client from "hyexd";
import getInstancePermissions from "../../../../../../lib/client/getInstancePermissions";
import decodeToken from "../../../../../../lib/decodeToken";
import prisma from "../../../../../../lib/prisma";
import getNodeEnc from "../../../../../../lib/getNodeEnc";

export default async function handler(req, res) {
    const { query: { id }, method } = req;

    const instance = await prisma.instance.findUnique({
        where: {
            id: id
        },
        include: {
            users: {
                select: {
                    permissions: true,
                    user: {
                        select: {
                            id: true
                        }
                    }
                }
            },
            node: true
        }
    })

    const tokenData = decodeToken(req.headers["authorization"].split(" ")[1]);

    if (!instance) return res.status(404).send({
        "code": 404,
        "error": "instance not found",
        "type": "error"
    })

    const permissions = getInstancePermissions(tokenData, instance);

    const lxd = new Client("https://" + instance.node.address + ":" + instance.node.lxdPort, {
        certificate: Buffer.from(Buffer.from(getNodeEnc(instance.node.encIV, instance.node.certificate)).toString(), "base64").toString("ascii"),
        key: Buffer.from(Buffer.from(getNodeEnc(instance.node.encIV, instance.node.key)).toString(), "base64").toString("ascii")
    })

    switch (method) {
        case "GET":
            if (!permissions.includes("list-snapshots")) return res.status(403).send({
                "code": 403,
                "error": "not allowed to access this resource",
                "type": "error"
            });

            let snapshots = await (lxd.instance(id)).snapshots;
            snapshots.metadata.forEach(({ name, size, created_at, last_used_at, expires_at }, index) => {
                snapshots.metadata[index] = {
                    name,
                    size,
                    created_at,
                    last_used_at,
                    expires_at
                }
            })
            return res.status(200).send(snapshots);
            return;
        case "POST":
            /*if (!permissions.includes("create-snapshot")) return res.status(403).send({
                "code": 403,
                "error": "not allowed to perform this operation",
                "type": "error"
            });*/

            const { name, expires_at, stateful } = req.body;

            let snapshot = await (lxd.instance(id)).createSnapshot(name, expires_at, stateful);

            if (snapshot.metadata.resources) {
                delete snapshot.metadata.resources.containers;
                snapshot.metadata.resources.instances.forEach((instance, index) => {
                    snapshot.metadata.resources.instances[index] = instance.replace("/1.0", "/api/v1")
                })
            }
            if (snapshot.operation) {
                snapshot.operation = snapshot.operation.replace("/1.0", `/api/v1/nodes/${instance.nodeId}`)
            }
            return res.status(202).send(snapshot);
        default:
            return res.status(405).send({
                code: 405,
                error: "method not allowed",
                type: "error"
            })
    }
}       