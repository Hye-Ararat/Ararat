import { createDecipheriv } from "crypto";
import { post } from "../../../../../lib/requestNode";
import decodeToken from "../../../../../lib/decodeToken";
import prisma from "../../../../../lib/prisma";

export default async function handler(req, res) {
    const { method, query: { id, include } } = req;
    const permissions = decodeToken(req.headers["authorization"].split(" ")).permissions
    switch (method) {
        case "GET":

            break;
        case "POST":
            //Validate permissions
            if (!permissions.includes("create-instance")) return res.status(403).send("Not allowed to access this resource");

            //Validate body
            if (!req.body.name || !req.body.node || !req.body.devices || !req.body.memory || !req.body.images || !req.body.users) return res.status(400).send("Missing required fields");

            //Insert instance into database
            let instance;
            try {
                instance = await prisma.instance.create({
                    data: {
                        name: req.body.name,
                        cpu: req.body.cpu,
                        memory: req.body.memory,
                        cpuPriority: req.body.cpuPriority,
                        memoryEnforce: req.body.memoryEnforce,
                        node: {
                            connect: {
                                id: req.body.node
                            }
                        },
                        image: {
                            connect: {
                                id: req.body.image
                            }
                        }
                    },
                    include: {
                        image: true
                    }
                })
            } catch (error) {
                return res.status(500).send(error);
            }

            //Add instance devices
            let devices = {};
            req.body.devices.forEach(async device => {
                await prisma.instanceDevice.create({
                    data: {
                        instance: {
                            connect: {
                                id: instance.id
                            }
                        },
                        name: device.name,
                        type: device.type,
                        metadata: device.metadata
                    }
                })
                devices[device.name] = {
                    type: device.type,
                    ...device.metadata
                }
            })

            //Add instance users
            req.body.users.forEach(async user => {
                await prisma.instanceUser.create({
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
                user.permissions.forEach(async permission => {
                    await prisma.instanceUserPermission.create({
                        data: {
                            permission: permission,
                            instanceUser: {
                                connect: {
                                    id: user.id
                                }
                            }
                        }
                    })
                })
            })

            //Create instance on node
            const config = {
                id: instance.id,
                devices: devices,
                limits: {
                    cpu: {
                        limit: req.body.cpu,
                        priority: req.body.cpuPriority
                    },
                    memory: {
                        limit: req.body.memory,
                        enforce: req.body.memoryEnforce
                    },
                    disk: {
                        priority: req.body.diskPriority
                    }
                },
                type: instance.image.type
            }

            try {
                await post(node, "/api/v1/instances", config);
            } catch (error) {
                await prisma.instance.delete({
                    where: {
                        id: instance.id
                    }
                })
                return res.status(500).send("An error occured while creating the instance");
            }
            return res.status(202).send("Success");
            break;
        default:
            return res.status(405).send("Method not allowed");
    }
}