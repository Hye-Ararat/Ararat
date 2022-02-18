import decodeToken from "../../../../../lib/decodeToken";
import prisma from "../../../../../lib/prisma";

export default async function handler(req, res) {
    const user = decodeToken(req.headers["authorization"].split(" ")[1]);

    const instanceList = await prisma.instance.findMany({
        where: {
            users: {
                every: {
                    userId: user.id
                },
            }
        },
        select: {
            node: {
                select: {
                    id: true,
                    hostname: true,
                    ssl: true,
                    port: true,
                    name: true
                }
            }
        }
    });

    let instances = [];

    instanceList.forEach(async instance => {
        const permissions = await prisma.instanceUserPermission.findMany({
            where: {
                instanceUserId: user.id
            }
        })
        let perms = [];
        permissions.forEach(permission => {
            perms.push(permission);
        })

        if (!perms.includes("view-resources")) {
            instance.cpu = null;
            instance.cpuPriority = null;
            instance.diskPriority = null;
            instance.memory = null;
            instance.memoryEnforce = null;
        }

        if (perms.includes("list-backups")) {
            instance.backups = await prisma.instanceBackup.findMany({
                where: {
                    instanceId: instance.id
                },
            })
        }

        if (perms.includes("list-snapshots")) {
            instance.snapshots = await prisma.instanceSnapshot.findMany({
                where: {
                    instanceId: instance.id
                }
            })
        }

        if (perms.includes("list-users")) {
            instance.users = await prisma.instanceUser.findMany({
                where: {
                    instanceId: instance.id
                },
                select: {
                    id: true,
                    permissions: perms.includes("view-user"),
                    user: {
                        select: {
                            email: perms.includes("view-user"),
                            id: true,
                        }
                    },
                    userId: true,
                }
            })
        }

        if (perms.includes("list-devices")) {
            instance.devices = await prisma.instanceDevice.findMany({
                where: {
                    instanceId: instance.id
                },
                select: {
                    id: true,
                    metadata: perms.includes("view-device"),
                    name: true,
                    type: true,
                }
            })
        }

        if (perms.includes("view-image")) {
            instance.image = await prisma.image.findUnique({
                where: {
                    id: instance.imageId
                },
                select: {
                    id: true,
                    console: true,
                    magmaCube: {
                        select: {
                            id: true,
                            name: true
                        }
                    },
                    stateless: true,
                    type: true
                }
            })
        }

        instances.push(instance);
    })
    return res.status(200).send(instances)
}