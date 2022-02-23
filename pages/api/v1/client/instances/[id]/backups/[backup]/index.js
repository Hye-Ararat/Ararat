import getInstancePermissions from "../../../../../../../../lib/client/getInstancePermissions";
import decodeToken from "../../../../../../../../lib/decodeToken";
import prisma from "../../../../../../../../lib/prisma";
import { del } from "../../../../../../../../lib/requestNode";

export default async function handler(req, res) {
    const { query: { id, backup } } = req;
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
    if (!instance.backups.filter(b => b.id === backup).length) return res.status(404).send("Backup not found");

    const permissions = getInstancePermissions(tokenData.id, instance);

    if (!permissions.includes("delete-backup")) return res.status(403).send("Not allowed to access this resource");
    try {
        await del(instance.node, `/api/v1/instances/${instance.id}/backups/${backup}`);
    } catch {
        return res.status(500).send("Internal Server Error");
    }
    await prisma.instanceBackup.delete({
        where: {
            id: backup
        }
    });
    return res.status(204).send();
}