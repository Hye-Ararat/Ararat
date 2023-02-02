import getInstancePermissions from "../../../../../lib/client/getInstancePermissions";
import decodeToken from "../../../../../lib/decodeToken";
import Client from "hyexd";
import prisma from "../../../../../lib/prisma";
import getNodeEnc from "../../../../../lib/getNodeEnc";
import Permissions from "../../../../../lib/permissions/index";

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
    const lxd = new Client("unix:///var/snap/lxd/common/lxd/unix.socket", null);
    switch (method) {
        case "GET":
            let permissions;


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
            response.status = instanceData.status
            response.status_code = instanceData.status_code
            let permsInstance = new Permissions(tokenData.id).instance(id)

            if (await permsInstance.listUsers) {
                response.users = instance.users
            }
            //if (permissions.includes("list-devices")) {
            response.devices = instanceData.expanded_devices
            //}
            //if (permissions.includes("view-status")) {
            response.status = instanceData.status
            response.status_code = instanceData.status_code
            //}

            response.node = instance.node


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