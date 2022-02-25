import { post } from "../../../../../../../lib/requestNode";
import decodeToken from "../../../../../../../lib/decodeToken";
import prisma from "../../../../../../../lib/prisma";
import getInstancePermissions from "../../../../../../../lib/client/getInstancePermissions";

export default async function handler(req, res) {
    const { query: { id } } = req;
    const tokenData = decodeToken(req.headers["authorization"].split(" ")[1]);

    const instance = await prisma.instance.findUnique({
        where: {
            id: id
        },
        include: {
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
    })
    if (!instance) return res.status(404).send("Instance not found");

    const permissions = getInstancePermissions(tokenData.id, instance);

    if (!permissions.includes("create-snapshot")) return res.status(403).send("Not allowed to access this resource");

    const snapshot = await prisma.instanceSnapshot.create({
        data: {
            name: req.body.name,
            createdAt: new Date(),
            instance: {
                connect: {
                    id: instance.id
                }
            }
        }
    })

    try {
        await post(instance.node, `/api/v1/instances/${instance.id}/snapshots`, {
            name: snapshot.id
        })
    } catch {
        await prisma.instanceSnapshot.delete({
            where: {
                id: snapshot.id
            }
        })
        return res.status(500).send("Internal Server Error");
    }

    return res.status(201).send(snapshot);

}