import { convertNetworkID } from "../../../../../../util/converter";
import prisma from "../../../../../../lib/prisma";
import decodeToken from "../../../../../../lib/decodeToken";

export default async function handler(req, res) {
    const { query: { id } } = req;
    const permissions = decodeToken(req.headers["authorization"].split(" ")[1]).permissions;

    if (!permissions.includes("view-network")) return res.status(403).send("Not allowed to access this resource");

    const network = await prisma.network.findUnique({
        where: {
            id: id
        },
        include: {
            node: {
                select: {
                    id: permissions.includes("list-nodes"),
                    name: permissions.includes("list-nodes"),
                    cpu: permissions.includes("list-nodes"),
                    disk: permissions.includes("list-nodes"),
                    hostname: permissions.includes("list-nodes"),
                    memory: permissions.includes("list-nodes"),
                    port: permissions.includes("list-nodes"),
                    ssl: permissions.includes("list-nodes"),
                }
            },
            ports: permissions.includes("list-ports"),
        }
    })

    if (!network) return res.status(404).send("Network not found")

    if (permissions.includes("list-instances")) {
        const devices = await prisma.instanceDevice.findMany({
            where: {
                type: "nic",
            }
        })
        let instances = [];
        devices.forEach(async device => {
            if (device.metadata.network && device.metadata.network == convertNetworkID(id)) instances.push(device.instanceId);
        })
        network.instances = instances;
    }
    return res.status(200).send(network);
}