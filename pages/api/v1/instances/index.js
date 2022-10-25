import decodeToken from "../../../../lib/decodeToken";
import Client from "hyexd";
import prisma from "../../../../lib/prisma";
import getNodeEnc from "../../../../lib/getNodeEnc";
import { getUserPermissions } from "../../../../lib/getUserPermissions"
import convertPermissionsToArray from "../../../../lib/convertPermissionsToArray";
import getLXDUserPermissions from "../../../../lib/getLXDUserPermissions";
import Permissions from "../../../../lib/permissions/index";
import { backgroundResponse, errorResponse } from "../../../../lib/responses";
import axios from "axios";
export default async function handler(req, res) {
    const { method } = req;

    const tokenData = decodeToken(req.headers["authorization"].split(" ")[1]);
    const permissions = await getUserPermissions(tokenData.id)
    switch (method) {
        case "POST":
            const { name, node, type, config, devices, source, users } = req.body;
            console.log("line1")
            let permInstance = new Permissions(tokenData.id).node(node)
            console.log("line2")
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
            console.log("line3")

            if (!await permInstance.createInstance) {
                return res.status(403).send(errorResponse("You are not allowed to create instances on this node", 403));
            }
            console.log("line4")

            if (!nodeData) return res.status(400).send(errorResponse("Node does not exist", 400))
            console.log("line5")
            const lxd = new Client("https://" + nodeData.address + ":" + nodeData.lxdPort, {
                certificate: Buffer.from(Buffer.from(getNodeEnc(nodeData.encIV, nodeData.certificate)).toString(), "base64").toString("ascii"),
                key: Buffer.from(Buffer.from(getNodeEnc(nodeData.encIV, nodeData.key)).toString(), "base64").toString("ascii")
            })
            console.log("line6")
            const perms = new Promise((resolve, reject) => {
                console.log("line7")
                let count = 0;
                Object.keys(devices).forEach(async device => {
                    console.log("line8")
                    if (device != "root") {
                        console.log("line9")
                        if (devices[device].type == "disk") {
                            console.log("line10")
                            if (!await permInstance.storagePool(devices[device].pool).volume(devices[device].source).attach) {
                                console.log("line11")
                                return reject(errorResponse("You do not have permission to attach the volume(s) specified", 403))
                            }
                        }
                        if (devices[device].type == "nic") {
                            if (!await permInstance.network(devices[device].network).attach) {
                                console.log("line12")
                                return reject(errorResponse("You do not have permission to attach the network(s) specified", 403))
                            }
                        }
                    }
                    console.log("line13")
                    count++;
                    if (count == Object.keys(devices).length) {
                        console.log("line14")
                        return resolve();
                    }
                })

            })
            console.log("line15")
            try {
                await perms;
            } catch (error) {
                return res.status(error.error_code).send(error);
            }
            console.log("line16")
            let imagePerms = new Permissions(tokenData.id).imageServer(source.server);
            console.log("line17")
            if (!await imagePerms.useImages) {
                return res.status(403).send(errorResponse("You do not have permission to use this image", 403));
            }
            console.log("line18")

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
            console.log("line19")
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
            console.log("line20")

            users.forEach(async user => {
                console.log("line21")
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
                console.log("line22")
                count++;
            })
            await done();
            function applyLayout(layout) {
                return new Promise(async (resolve, reject) => {
                    let users = await prisma.instanceUser.findMany({
                        where: {
                            instanceId: instance.id
                        },
                        include: {
                            user: true
                        }
                    })
                    layout.forEach(async grid => {
                        users.forEach(async user => {
                            let widgetGrid = await prisma.instanceUserWidgetGrid.create({
                                data: {
                                    instanceUser: {
                                        connect: {
                                            id: user.id
                                        }
                                    },
                                    direction: grid.direction,
                                    size: grid.size,
                                    index: grid.index,
                                }
                            })
                            grid.widgets.forEach(async widget => {
                                let widg = await prisma.instanceUserWidget.create({
                                    data: {
                                        instanceUserWidgetGrid: {
                                            connect: {
                                                id: widgetGrid.id
                                            }
                                        },
                                        size: widget.size,
                                        index: widget.index,
                                        widget: widget.widget
                                    }
                                })
                            })
                        })

                    })
                    resolve();
                })
            }
            let defaultLayout = [
                {
                    direction: "row",
                    index: 0,
                    size: JSON.stringify({ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }),
                    widgets: [
                        {
                            index: 0,
                            size: JSON.stringify({ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }),
                            widget: "console",
                        }
                    ],
                },
                {
                    direction: "row",
                    index: 1,
                    size: JSON.stringify({ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }),
                    widgets: [
                        {
                            index: 0,
                            size: JSON.stringify({ xs: 6, sm: 6, md: 6, lg: 6, xl: 6 }),
                            widget: "cpu-chart",
                        },
                        {
                            index: 1,
                            size: JSON.stringify({ xs: 6, sm: 6, md: 6, lg: 6, xl: 6 }),
                            widget: "memory-chart",
                        }
                    ]
                }]
            console.log(defaultLayout)
            if (source.server == "https://images.ararat.hye.gg") {
                let res = await axios.get("https://images.ararat.hye.gg/streams/v1/images.json");
              
                var images = Object.keys(res.data.products)
                images = images.map(s => res.data.products[s])
                let image = images.find(image => image.aliases.includes(source.alias));
                if (image) {
                    if (image.properties) {
                        if (image.properties["widget_grids"]) {
                            defaultLayout = image.properties["widget_grids"]
                        }
                    }
                }
            }
            await applyLayout(defaultLayout);
            console.log("line23")
            console.log(config)
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
            console.log("line24")
            operation.operation = operation.operation.replace("/1.0", `/api/v1/nodes/${node}`);

            delete operation.metadata.resources.containers;
            operation.metadata.resources.instances.forEach((instance, index) => {
                operation.metadata.resources.instances[index] = instance.replace("/1.0", "/api/v1")
            });
            console.log("line25")
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