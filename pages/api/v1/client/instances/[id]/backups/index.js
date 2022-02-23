import { post } from "../../../../../../../lib/requestNode";
import prisma from "../../../../../../../lib/prisma";
import decodeToken from "../../../../../../../lib/decodeToken";
import getInstancePermissions from "../../../../../../../lib/client/getInstancePermissions";

export default async function handler(req, res) {
    const { method, query: { id } } = req;

    const tokenData = decodeToken(req.headers["authorization"].split(" ")[1]);

    const instance = await prisma.instance.findUnique({
        where: {
            id: id
        },
        include: {
            users: {
                select: {
                    id: true,
                    permissions: true,
                    user: {
                        select: {
                            id: true,
                        }
                    }
                }
            },
            backups: true,
            node: true
        }
    })
    if (!instance) return res.status(404).send("Instance not found");

    const permissions = getInstancePermissions(tokenData.id, instance);

    switch (method) {
        case "GET":
            console.log("Getting backups");
            break;
        case "POST":
            if (!permissions.includes("create-backup")) return res.status(403).send("Not allowed to access this resource");
            if (!req.body.name) return res.status(400).send("Missing backup name");

            const backup = await prisma.instanceBackup.create({
                data: {
                    name: req.body.name,
                    createdAt: new Date(),
                    pending: true,
                    instance: {
                        connect: {
                            id: id
                        }
                    }
                },
            });

            try {
                await post(instance.node, `/api/v1/instances/${instance.id}/backups`, {
                    name: backup.id
                })
            } catch (error) {
                await prisma.instanceBackup.delete({
                    where: {
                        id: backup.id
                    }
                });
                return res.status(500).send("Internal Server Error");
            }

            return res.status(201).send(backup);
            break;
        default:
            return res.status(400).send("Invalid method");

    }
}