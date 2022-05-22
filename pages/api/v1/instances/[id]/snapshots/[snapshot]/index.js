import Client from "hyexd";
import decodeToken from "../../../../../../../lib/decodeToken";
import getNodeEnc from "../../../../../../../lib/getNodeEnc";
import prisma from "../../../../../../../lib/prisma";
import getInstancePermissions from "../../../../../../../lib/client/getInstancePermissions";

export default async function handler(req, res) {
    const { query: { id, snapshot }, method } = req;
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
    if (!instance) return res.status(404).send({
        "code": 404,
        "error": "instance not found",
        "type": "error"
    })

    const tokenData = decodeToken(req.headers["authorization"].split(" ")[1]);
    const permissions = getInstancePermissions(tokenData, instance);

    const lxd = new Client(instance.node.url, {
        certificate: getNodeEnc(instance.node.encIV, instance.node.certificate),
        key: getNodeEnc(instance.node.encIV, instance.node.key)
    })

    let snap = lxd.instance(id).snapshot(snapshot);
    switch (method) {
        case "GET":
            if (!tokenData.permissions.includes("view-snapshot")) {
                if (!permissions.includes("view-snapshot")) {
                    return res.status(403).send({
                        "code": 403,
                        "error": "not allowed to access this resource",
                        "type": "error"
                    })
                }
            }
            let snapshotData;

            try {
                snapshotData = await snap.data;
            } catch (error) {
                return res.status(error.error_code).send(error);
            }

            snapshotData.metadata = {
                name: snapshotData.metadata.name,
                size: snapshotData.metadata.size,
                created_at: snapshotData.metadata.created_at,
                last_used_at: snapshotData.metadata.last_used_at,
                expires_at: snapshotData.metadata.expires_at
            }
            return res.status(200).send(snapshotData);
        case "DELETE":
            let deletedSnapshot;

            try {
                deletedSnapshot = await snap.delete();
            } catch (error) {
                return res.status(error.error_code).send(error);
            }
            deletedSnapshot.operation = deletedSnapshot.operation.replace("/1.0", `/api/v1/nodes/${instance.nodeId}`);
            delete deletedSnapshot.metadata.resources.containers;
            deletedSnapshot.metadata.resources.instances.forEach((instance, index) => {
                deletedSnapshot.metadata.resources.instances[index] = instance.replace("/1.0", "/api/v1")
            })

            return res.status(202).send(deletedSnapshot);
            return;
    }
}