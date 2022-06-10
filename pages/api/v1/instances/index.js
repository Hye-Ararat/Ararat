import decodeToken from "../../../../lib/decodeToken";
import Client from "hyexd";
import prisma from "../../../../lib/prisma";
import getNodeEnc from "../../../../lib/getNodeEnc";
import { getUserPermissions } from "../../../../lib/getUserPermissions"
import convertPermissionsToArray from "../../../../lib/convertPermissionsToArray";
import getLXDUserPermissions from "../../../../lib/getLXDUserPermissions";
import Permissions from "../../../../lib/permissions/index";
import { backgroundResponse, errorResponse } from "../../../../lib/responses";
export default async function handler(req, res) {
    const { method } = req;

    const tokenData = decodeToken(req.headers["authorization"].split(" ")[1]);
    const permissions = await getUserPermissions(tokenData.id)
    switch (method) {
        case "POST":
            const { name, node, type, config, devices, source, users } = req.body;
            let permInstance = new Permissions(tokenData.id).node(node)
            const nodeData = await prisma.node.findUnique({
                where: {
                    id: node
                },
                include: {
                    users: {
                        where: {
                            userId: tokenData.id
                        },
                        include: {
                            permissions: true
                        }
                    }
                }
            })

            if (!await permInstance.createInstance) {
                return res.status(403).send(errorResponse("You are not allowed to create instances on this node", 403));
            }

            if (!nodeData) return res.status(404).send(errorResponse("Node does not exist", 404))

            const lxd = new Client("https://" + nodeData.address + ":" + nodeData.lxdPort, {
                certificate: Buffer.from(Buffer.from(getNodeEnc(nodeData.encIV, nodeData.certificate)).toString(), "base64").toString("ascii"),
                key: Buffer.from(Buffer.from(getNodeEnc(nodeData.encIV, nodeData.key)).toString(), "base64").toString("ascii")
            })
            const perms = new Promise((resolve, reject) => {
                let count = 0;
                Object.keys(devices).forEach(async device => {
                    if (device != "root") {
                        if (devices[device].type == "disk") {
                            if (!await permInstance.storagePool(devices[device].pool).volume(devices[device].source).attach) {
                                return reject(errorResponse("You do not have permission to attach the volume(s) specified", 403))
                            }
                        }
                        if (devices[device].type == "nic") {
                            if (!await permInstance.network(devices[device].network).attach) {
                                return reject(errorResponse("You do not have permission to attach the network(s) specified", 403))
                            }
                        }
                    }
                    count++;
                    if (count == Object.keys(devices).length) {
                        return resolve();
                    }
                })

            })

            try {
                await perms;
            } catch (error) {
                return res.status(error.error_code).send(error);
            }
            let imagePerms = new Permissions(tokenData.id).imageServer(source.server);
            if (!await imagePerms.useImages) {
                return res.status(403).send(errorResponse("You do not have permission to use this image", 403));
            }

            let operation;

            const instance = await prisma.instance.create({
                data: {
                    name: name,
                    node: {
                        connect: {
                            id: node
                        }
                    },
                }
            })
            let count = 0;
            function done() {
                return new Promise((resolve, reject) => {
                    const interval = setInterval(() => {
                        if (count == users.length) {
                            clearInterval(interval);
                            resolve();
                        }
                    }, 10);
                })
            }

            users.forEach(async user => {
                let u = await prisma.instanceUser.create({
                    data: {
                        instance: {
                            connect: {
                                id: instance.id
                            }
                        },
                        user: {
                            connect: {
                                id: user.id
                            }
                        }
                    }
                })
                await Promise.all([user.permissions.forEach(async permission => {
                    await prisma.instanceUserPermission.create({
                        data: {
                            instanceUser: {
                                connect: {
                                    id: u.id
                                }
                            },
                            permission: permission
                        }
                    })
                })])

                count++;
            })
            await done();
            try {
                operation = await lxd.createInstance(instance.id, type, {
                    config: config,
                    devices: devices,
                    source: {
                        ...source
                    }
                })
            } catch (error) {
                await prisma.instance.delete({
                    where: {
                        id: instance.id
                    }
                });
                return res.status(error.error_code).send(error);
            }
            operation.operation = operation.operation.replace("/1.0", `/api/v1/nodes/${node}`);

            delete operation.metadata.resources.containers;
            operation.metadata.resources.instances.forEach((instance, index) => {
                operation.metadata.resources.instances[index] = instance.replace("/1.0", "/api/v1")
            });
            return res.status(202).send(backgroundResponse(100, operation.operation, operation.metadata));
        case "GET":
            const dbInstances = await prisma.instance.findMany({
                include: {
                    users: {
                        where: {
                            userId: tokenData.id
                        }
                    }
                }
            })
            let instances = [];
            dbInstances.forEach(instance => {
                if (instance.users.length > 0) {
                    instances.push(instance)
                }
            })
            res.send({
                type: "sync",
                status: "Success",
                status_code: 200,
                operation: "",
                error_code: 0,
                error: "",
                metadata: instances
            })
    }
}