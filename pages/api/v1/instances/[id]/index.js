import getInstancePermissions from "../../../../../lib/client/getInstancePermissions";
import decodeToken from "../../../../../lib/decodeToken";
import Client from "hyexd";
import prisma from "../../../../../lib/prisma";
import getNodeEnc from "../../../../../lib/getNodeEnc";

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
                    user: {
                        select: {
                            id: true
                        }
                    },
                    permissions: true
                }
            }
        }
    });
    const lxd = new Client("https://" + instance.node.address + ":" + instance.node.lxdPort, {
        certificate: Buffer.from(Buffer.from(getNodeEnc(instance.node.encIV, instance.node.certificate)).toString(), "base64").toString("ascii"),
        key: Buffer.from(Buffer.from(getNodeEnc(instance.node.encIV, instance.node.key)).toString(), "base64").toString("ascii")
    });
    switch (method) {
        case "GET":
            let permissions;
            if (!tokenData.permissions.includes("view-instance")) {
                permissions = getInstancePermissions(tokenData, instance);
                if (!(permissions.length > 0)) return res.status(403).send({
                    code: 403,
                    error: "not allowed to access this resource",
                    type: "error"
                })
            }

            let instanceData = await (lxd.instance(id)).data;
            instanceData = instanceData.metadata;
            if (!instanceData) return res.status(500).send({
                code: 500,
                error: "internal server error: instance exists on panel, but does not exist on node",
                type: "error"
            });

            let response = {
                id: instance.id,
                name: instance.name,
                nodeId: instance.nodeId,
                architecture: instanceData.architecture,
                created_at: instanceData.created_at,
                type: instanceData.type == "virtual-machine" ? "kvm" : "n-vps",
                last_used_at: instanceData.last_used_at,
                config: instanceData.config,
            };
            console.log(tokenData)
            if (tokenData.permissions.includes("view-instance")) {
                response.devices = instanceData.expanded_devices
                response.status = instanceData.status
                response.status_code = instanceData.status_code
                if (tokenData.permissions.includes("view-node")) {
                    response.node = instance.node
                }
                if (tokenData.permissions.includes("list-users")) {
                    response.users = instance.users
                }
            } else {
                if (permissions.includes("list-devices")) {
                    response.devices = instanceData.expanded_devices
                }
                if (permissions.includes("view-status")) {
                    response.status = instanceData.status
                    response.status_code = instanceData.status_code
                }
                if (permissions.includes("list-users")) {
                    response.users = instance.users
                }
                if (permissions.includes("view-node")) {
                    response.node = instance.node
                }
            }

            return res.status(200).send({
                type: "sync",
                status: "Success",
                status_code: 200,
                operation: "",
                error_code: 0,
                error: "",
                metadata: response
            });
        case "PATCH":
            console.log(req.body)
            let resp = await lxd.instance(id).partialUpdate(req.body);
            return res.status(200).send(resp);
        case "PUT":
            let resp2 = await lxd.instance(id).update(req.body);
            return res.status(200).send(resp2);
    }
}