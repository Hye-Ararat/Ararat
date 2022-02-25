import decodeToken from "../../../../../../../../lib/decodeToken";
import prisma from "../../../../../../../../lib/prisma";
import getInstancePermissions from "../../../../../../../../lib/client/getInstancePermissions";
import { del } from "../../../../../../../../lib/requestNode";

export default async function handler(req, res) {
    const { query: { id, snapshot } } = req;
    const tokenData = decodeToken(req.headers["authorization"].split(" ")[1]);

    const snapshotToDelete = await prisma.instanceSnapshot.findUnique({
        where: {
            id: snapshot
        },
        include: {
            instance: {
                select: {
                    users: {
                        select: {
                            permissions: true,
                            user: {
                                select: {
                                    id: true
                                }
                            }
                        }
                    },
                    node: true
                },
            }
        }
    })

    if (!snapshotToDelete) return res.status(404).send("Snapshot not found");

    const permissions = getInstancePermissions(tokenData.id, snapshotToDelete.instance);

    if (!permissions.includes("delete-snapshot")) return res.status(403).send("Not allowed to access this resource");

    try {
        await del(snapshotToDelete.instance.node, `/api/v1/instances/${id}/snapshots/${snapshot}`);
    } catch {
        return res.status(403).send("Not allowed to access this resource");
    }

    await prisma.instanceSnapshot.delete({
        where: {
            id: snapshot
        }
    })

    return res.status(204).send();
}