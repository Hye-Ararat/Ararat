import { decode, verify } from "jsonwebtoken";
import { ObjectId } from "mongodb";
import axios from "axios"
import { convertNetworkID } from "../../../../../../util/converter";
import { PrismaClient } from "@prisma/client";
export default async function handler(req, res) {
    const { method, query: { id, include } } = req;
    const { connectToDatabase } = require("../../../../../../util/mongodb");
    const { db } = await connectToDatabase();
    const prisma = new PrismaClient();
    if (!req.headers["authorization"]) {
        return res.status(403).send("Not allowed to access this resource")
    }
    if (req.headers["authorization"].split(" ")[1].includes("::")) {

    } else if (req.headers["authorization"].split(" ")[1].includes(":")) {
        try {
            var token_data = decode(req.headers["authorization"].split(" ")[1].split(":")[1]);
        } catch {
            return res.status(403).send("Not allowed to access this resource")
        }
        if (!token_data.permissions.includes("view-network")) {
            return res.status(403).send("Not allowed to access this resource")
        }
    } else {
        try {
            var token_data = decode(req.headers["authorization"].split(" ")[1]);
        } catch {
            return res.status(403).send("Not allowed to access this resource")
        }
        if (!token_data.permissions.includes("view-network")) {
            return res.status(403).send("Not allowed to access this resource")
        }
    }
    var network = await prisma.network.findUnique({
        where: {
            id: id
        },
        include: {
            node: {
                select: {
                    id: token_data.permissions.includes("list-nodes"),
                    name: token_data.permissions.includes("list-nodes"),
                    cpu: token_data.permissions.includes("list-nodes"),
                    disk: token_data.permissions.includes("list-nodes"),
                    hostname: token_data.permissions.includes("list-nodes"),
                    memory: token_data.permissions.includes("list-nodes"),
                    port: token_data.permissions.includes("list-nodes"),
                    ssl: token_data.permissions.includes("list-nodes"),
                }
            },
            ports: token_data.permissions.includes("list-ports"),
        }
    })
    console.log(network)
    if (!network) return res.status(404).send("Network not found")
    if (token_data.permissions.includes("list-instances")) {
        let devices = await prisma.instanceDevice.findMany({
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
    return res.send(network);
}