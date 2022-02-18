import decodeToken from "../../../../../../../lib/decodeToken";
import prisma from "../../../../../../../lib/prisma";
import { get, put } from "../../../../../../../lib/requestNode";

export default async function handler(req, res) {
    const { method, query: { id } } = req;
    const permissions = decodeToken(req.headers["authorization"].split(" ")[1]).permissions;
    switch (method) {
        case "GET":
            if (!permissions.includes("list-ports")) return res.status(403).send("Not allowed to access this resource");
            return res.status(200).send(await prisma.port.findMany());
            break;
        case "POST":
            if (!permissions.includes("forward-port")) return res.status(403).send("Not allowed to access this resource");
            const port = await prisma.port.create({
                data: {
                    network: {
                        connect: {
                            id: id
                        }
                    },
                    description: req.body.description,
                    protocol: req.body.protocol,
                    listenPort: req.body.listenPort,
                    targetPort: req.body.targetPort,
                    targetType: req.body.targetType,
                    target: req.body.target
                },
                include: {
                    network: {
                        include: {
                            node: true
                        }
                    }
                }
            });

            let ip;
            if (port.targetType == "instance") {
                try {
                    ip = (await get(port.network.node, `/api/v1/instances/${port.target}/network`)).ipv4_address;
                } catch {
                    await prisma.port.delete({
                        where: {
                            id: port.id
                        }
                    })
                    return res.status(500).send("An internal server error occured. This can happen if the instance has not obtained an IP address yet, or if the node running the instance is offline.");
                }
            } else {
                ip = port.target;
            }

            try {
                await put(port.network.node, `/api/v1/network/${port.network.id}/ports`, {
                    listen_address: port.network.ipv4,
                    ports: [
                        {
                            description: port.description,
                            listen_port: port.listenPort,
                            protocol: port.protocol,
                            target_address: ip,
                            target_port: port.targetPort
                        }
                    ]
                })
            } catch {
                await prisma.port.delete({
                    where: {
                        id: port.id
                    }
                })
                return res.status(500).send("Internal server error");
            }

            return res.status(201).send(port);
            break;
        default:
            break;
    }
}