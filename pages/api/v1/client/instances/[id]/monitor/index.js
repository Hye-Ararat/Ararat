import decodeToken from "../../../../../../../lib/decodeToken";
import prisma from "../../../../../../../lib/prisma";
import getInstancePermissions from "../../../../../../../lib/client/getInstancePermissions";
import { get } from "../../../../../../../lib/requestNode";


export default async function handler(req, res) {
    const { query: { id } } = req;

    const tokenData = decodeToken(req.headers["authorization"].split(" ")[1]);

    const instance = await prisma.instance.findUnique({
        where: {
            id: id
        },
        include: {
            node: true,
            users: {
                select: {
                    permissions: true,
                    user: {
                        select: {
                            id: true
                        }
                    }
                }
            }
        }
    })

    if (!instance) return res.status(404).send("Instance not found");

    const permissions = getInstancePermissions(tokenData.id, instance);

    if (!permissions.includes("view-statistics")) return res.status(403).send("Not allowed to access this resource");

    let resources;
    try {
        resources = get(instance.node, `/api/v1/instances/${id}/monitor`);
    } catch (err) {
        return res.status(500).send("Internal Server Error");
    }
    return res.status(200).send(resources);


}