import prisma from "../../../../../../lib/prisma";
import decodeToken from "../../../../../../lib/decodeToken";


export default async function handler(req, res) {
    const { query: { id } } = req;

    const userData = decodeToken(req.headers["authorization"].split(" ")[1]);

    const instance = await prisma.instance.findUnique({
        where: {
            id: id,
        },
        include: {
            users: {
                select: {
                    id: true,
                    permissions: true,
                }
            },
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
    })
    if (!instance) return res.status(404).send("Instance not found");

    if (!instance.users.some(user => user.user.id === userData.id)) return res.status(403).send("Not allowed to access this resource");

    let perms = [];
    instance.users.forEach(user => {
        user.permissions.forEach(permission => {
            perms.push(permission.permission);
        })
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

    return res.status(200).send(instance);



}