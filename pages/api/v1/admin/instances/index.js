import { createDecipheriv } from "crypto";
import { post } from "../../../../../lib/requestNode";
import decodeToken from "../../../../../lib/decodeToken";
import prisma from "../../../../../lib/prisma";

export default async function handler(req, res) {
    const { method, query: { id, include } } = req;
    const permissions = decodeToken(req.headers["authorization"].split(" ")[1]).permissions
    switch (method) {
        case "GET":

            break;
        case "POST":
            //Validate permissions
            if (!permissions.includes("create-instance")) return res.status(403).send("Not allowed to access this resource");

            //Validate body
            if (!req.body.name || !req.body.node || !req.body.devices || !req.body.memory || !req.body.image || !req.body.users) return res.status(400).send("Missing required fields");

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
                        image: {
                            include: {
                                imageServer: true
                            }
                        },
                        node: true
                    }
                })
            } catch (error) {
                return res.status(500).send(error);
            }

            //Add instance devices

            const devices = new Promise((resolve, reject) => {
                let tempDevices = {};
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
                    tempDevices[device.name] = {
                        type: device.type,
                        ...device.metadata
                    }
                    if (Object.keys(tempDevices).length == req.body.devices.length) resolve(tempDevices);
                })
            })

            //Add instance users
            req.body.users.forEach(async user => {
                let permissions = [];
                user.permissions.forEach(async permission => {
                    permissions.push({
                        permission: permission
                    })
                });

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
                        },
                        permissions: {
                            create: permissions
                        }
                    }
                })
            })

            //Create instance on node
            const config = {
                id: instance.id,
                devices: await devices,
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
                type: instance.image.type,
                environment: null,
                image: instance.image

            }

            try {
                await post(instance.node, "/api/v1/instances", config);
            } catch (error) {
                console.log(error)
                await prisma.instance.delete({
                    where: {
                        id: instance.id
                    }
                })
                return res.status(500).send(error);
            }
            return res.status(202).send("Success");
            break;
        default:
            return res.status(405).send("Method not allowed");
    }
}