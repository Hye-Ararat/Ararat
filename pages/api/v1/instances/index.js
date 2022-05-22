import decodeToken from "../../../../lib/decodeToken";
import Client from "hyexd";
import prisma from "../../../../lib/prisma";
import getNodeEnc from "../../../../lib/getNodeEnc";

export default async function handler(req, res) {
    const { method } = req;

    const tokenData = decodeToken(req.headers["authorization"].split(" ")[1]);

    switch (method) {
        case "POST":
            if (!tokenData.permissions.includes("create-instance")) return res.status(403).send({
                "code": 403,
                "error": "not allowed to perform this operation",
                "type": "error"
            });

            const { name, node, type, config, devices, source, users } = req.body;

            const nodeData = await prisma.node.findUnique({
                where: {
                    id: node
                }
            })
            if (!nodeData) return res.status(400).send({
                "code": 400,
                "error": "bad request: node does not exist",
                "type": "error"
            })

            const lxd = new Client("https://" + nodeData.address + ":" + nodeData.lxdPort, {
                certificate: Buffer.from(Buffer(getNodeEnc(nodeData.encIV, nodeData.certificate)).toString(), "base64").toString("ascii"),
                key: Buffer.from(Buffer(getNodeEnc(nodeData.encIV, nodeData.key)).toString(), "base64").toString("ascii")
            })

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
                let fileCount = 0;
                function files() {
                    return new Promise((resolve, reject) => {
                        const interval = setInterval(() => {
                            let fc = 0;
                            Object.keys(user.permissions.files).forEach(file => {
                                if (user.permissions.files[file] == true) fc++;
                            });
                            if (fileCount == fc) {
                                clearInterval(interval);
                                resolve();
                            }
                        }, 10);
                    })
                }
                Object.keys(user.permissions.files).forEach(async perm => {
                    await prisma.instanceUserPermission.create({
                        data: {
                            instanceUser: {
                                connect: {
                                    id: u.id,
                                }
                            },
                            permission: perm.charAt(0).toUpperCase() + perm.slice(1) + "-files",
                        }
                    })
                })
                await files();
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
            return res.status(202).send(operation);
    }
}