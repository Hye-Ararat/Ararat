import decodeToken from "../../../../../../lib/decodeToken";
import prisma from "../../../../../../lib/prisma";

export default async function handler(req, res) {
    const { query: { id } } = req;
    const permissions = decodeToken(req.headers["authorization"].split(" ")[1]).permissions;
    if (!permissions.includes("view-node")) return res.status(403).send("Not allowed to access this resource");

    let node;
    try {
        node = await prisma.node.findUnique({
            where: {
                id: id
            },
            select: {
                cpu: true,
                disk: true,
                hostname: true,
                id: true,
                memory: true,
                name: true,
                port: true,
                ssl: true,
                instances: permissions.includes("list-instances"),
                networks: permissions.includes("list-networks")
            }
        })
    } catch (error) {
        return res.status(500).send(error)
    }

    if (!node) return res.status(404).send("Node does not exist");

    return res.status(200).send(node);
}