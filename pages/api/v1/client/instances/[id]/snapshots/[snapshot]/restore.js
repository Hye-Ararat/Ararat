import getInstancePermissions from "../../../../../../../../lib/client/getInstancePermissions";
import decodeToken from "../../../../../../../../lib/decodeToken";
import prisma from "../../../../../../../../lib/prisma";
import { post } from "../../../../../../../../lib/requestNode";

export default async function handler(req, res) {
    const { query: { id, snapshot } } = req;
    const tokenData = decodeToken(req.headers["authorization"].split(" ")[1]);

    const snapshotToRestore = await prisma.instanceSnapshot.findUnique({
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
                }
            }
        }
    })

    if (!snapshotToRestore) return res.status(404).send("Snapshot not found");

    const permissions = getInstancePermissions(tokenData.id, snapshotToRestore.instance);
    if (!permissions.includes("restore-snapshot")) return res.status(403).send("Not allowed to access this resource");

    try {
        await post(snapshotToRestore.instance.node, `/api/v1/instances/${id}/snapshots/${snapshot}/restore`, null);
    } catch {
        return res.status(500).send("Internal Server Error")
    }

    return res.status(204).send();
}