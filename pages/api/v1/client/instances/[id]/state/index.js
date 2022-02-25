import decodeToken from "../../../../../../../lib/decodeToken";
import prisma from "../../../../../../../lib/prisma";
import { get, post } from "../../../../../../../lib/requestNode";

export default async function handler(req, res) {
    const { query: { id }, body: { state } } = req;

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
                            id: true,
                        }
                    }
                }
            }
        }
    })

    if (!instance) return res.status(404).send("Instance not found");

    const permissions = getInstancePermissions(tokenData.id, instance);

    if (!state) return res.status(400).send("State is required");
    if (state != "start" || state != "stop" || state != "kill" || state != "restart") return res.status(400).send("Invalid State");

    if (state == "start" && !permissions.includes("start-instance")) return res.status(403).send("Not allowed to access this resource");
    if (state == "stop" && !permissions.includes("stop-instance")) return res.status(403).send("Not allowed to access this resource");
    if (state == "kill" && !permissions.includes("kill-instance")) return res.status(403).send("Not allowed to access this resource");
    if (state == "restart" && !permissions.includes("restart-instance")) return res.status(403).send("Not allowed to access this resource");

    try {
        await post(instance.node, `/api/v1/instances/${id}/state`, { state });
    } catch {
        return res.status(500).send("Internal Server Error");
    }

    let instanceState;
    instanceState = await get(instance.node, `/api/v1/instances/${id}/state`).catch(() => instanceState = null);
    if (instanceState) return res.status(200).send(instanceState);
    if (!instanceState) return res.status(204).send();
}