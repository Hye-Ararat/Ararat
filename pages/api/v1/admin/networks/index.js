import { decode, verify } from "jsonwebtoken";
import { ObjectId } from "mongodb";
import axios from "axios";
import crypto from "crypto";
import { PrismaClient } from "@prisma/client";

export default async function handler(req, res) {
    const { method, query: { id, include } } = req;
    const { connectToDatabase } = require("../../../../../util/mongodb");
    const { db } = await connectToDatabase();
    console.log(req.headers)
    const prisma = new PrismaClient();
    switch (method) {
        case "POST":
            if (req.headers["authorization"].split(" ")[1].includes("::")) {

            } else if (req.headers["authorization"].split(" ")[1].includes(":")) {
                try {
                    var token_data = decode(req.headers["authorization"].split(" ")[1].split(":")[1]);
                } catch {
                    return res.status(403).send("Not allowed to access this resource")
                }
                if (!token_data.permissions.includes("create-network")) {
                    return res.status(403).send("Not allowed to access this resource")
                }
            } else {
                try {
                    var token_data = decode(req.headers["authorization"].split(" ")[1]);
                } catch {
                    return res.status(403).send("Not allowed to access this resource")
                }
                if (!token_data.permissions.includes("create-network")) {
                    return res.status(403).send("Not allowed to access this resource")
                }
            }
            let node;

            try {
                node = await prisma.node.findUnique({
                    where: {
                        id: req.body.node
                    }
                });
            } catch (error) {
                console.log(error);
                return res.status(500).send("An error occured")
            }
            try {
                var network = await prisma.network.create({
                    data: {
                        name: req.body.name,
                        node: {
                            connect: {
                                id: req.body.node
                            }
                        },
                        ipv4: req.body.ipv4,
                        ipv6: req.body.ipv6,
                        ipAlias: req.body.ipAlias,
                        remote: req.body.remote,
                        isPrimaryRemoteNetwork: req.body.isPrimaryRemoteNetwork,
                        primaryRemoteNetworkId: req.body.primaryRemoteNetworkId,
                        remoteNetworkProtocol: req.body.remoteNetworkProtocol,
                    }
                });
            } catch (error) {
                console.log(error)
                return res.status(500).send("An error occured while creating the network")
            }
            console.log()

            try {
                var decipher = crypto.createDecipheriv("aes-256-ctr", process.env.ENC_KEY, Buffer.from(node.access_token_iv, "hex"))
                var access_token = Buffer.concat([decipher.update(Buffer.from(node.access_token.split("::")[1], "hex")), decipher.final()])
            } catch {
                return res.status(500).send("Internal Server Error");
            }

            try {
                if (req.body.remote.remote == true && req.body.remote.primary == true) {
                    console.log(network.id)
                    await axios.post(`${node.address.ssl ? "https" : "http"}://${node.address.hostname}:${node.address.port}/api/v1/network`, {
                        id: network.id,
                        address: {
                            ipv4: req.body.ipv4 ? req.body.ipv4 : null,
                            ipv6: req.body.ipv6 ? req.body.ipv6 : null,
                        },
                        remote: {
                            remote: req.body.remote,
                            primary: req.body.isPrimaryRemoteNetwork,
                            primaryNetwork: req.body.primaryRemoteNetworkId,
                        }
                    }, {
                        headers: {
                            "Authorization": `Bearer ${access_token}`
                        }
                    })
                } else if (req.body.remote.remote == true && req.body.remote.primary == false) {
                    let primaryNetwork = await prisma.network.findUnique({
                        where: {
                            id: req.body.primaryRemoteNetworkId
                        }
                    })
                    await axios.post(`${node.address.ssl ? "https" : "http"}://${node.address.hostname}:${node.address.port}/api/v1/network`, {
                        id: network.id,
                        address: {
                            ipv4: req.body.ipv4,
                            ipv6: req.body.ipv6 ? req.body.ipv6 : null,
                        },
                        remote: {
                            remote: req.body.remote,
                            primary: req.body.isPrimaryRemoteNetwork,
                            primaryNetwork: req.body.remote.primaryRemoteNetworkId,
                            address: {
                                ipv4: primaryNetwork.ipv4
                            }
                        }
                    }, {
                        headers: {
                            "Authorization": `Bearer ${access_token}`
                        }
                    });
                    let primaryNetworkNode = await prisma.node.findUnique({
                        where: {
                            id: primaryNetwork.nodeId
                        }
                    })
                    try {
                        var decipher2 = crypto.createDecipheriv("aes-256-ctr", process.env.ENC_KEY, Buffer.from(primaryNetworkNode.accessTokenIV, "hex"))
                        var accessToken2 = Buffer.concat([decipher2.update(Buffer.from(primaryNetworkNode.accessToken.split("::")[1], "hex")), decipher2.final()])
                    } catch (error) {
                        console.log(error)
                    }
                    await axios.post(`${primaryNetworkNode.ssl ? "https" : "http"}://${primaryNetworkNode.hostname}:${primaryNetworkNode.port}/api/v1/network/${req.body.primaryRemoteNetworkId}/remotes`, {
                        remoteID: network.id,
                        localID: req.body.primaryRemoteNetworkId,
                        protocol: "gre",
                        local: primaryNetwork.ipv4,
                        remote: req.body.ipv4
                    }, {
                        headers: {
                            "Authorization": `Bearer ${accessToken2}`
                        }
                    });

                } else {
                    console.log(network.id)
                    await axios.post(`${node.address.ssl ? "https" : "http"}://${node.address.hostname}:${node.address.port}/api/v1/network`, {
                        id: network.id,
                        address: {
                            ipv4: req.body.ipv4 ? req.body.ipv4 : null,
                            ipv6: req.body.ipv6 ? req.body.ipv6 : null,
                        },
                        remote: {
                            remote: req.body.remote,
                            primary: req.body.isPrimaryRemoteNetwork,
                            primaryNetwork: req.body.primaryRemoteNetworkId
                        }
                    }, {
                        headers: {
                            "Authorization": `Bearer ${access_token}`
                        }
                    })
                }
            } catch (error) {
                console.log(error)
                return res.status(500).send("An error occured while creating the network")
            }
            return res.status(200).send("Success");
            break;
        case "GET":
            if (req.headers["authorization"].split(" ")[1].includes("::")) {

            } else if (req.headers["authorization"].split(" ")[1].includes(":")) {
                try {
                    var token_data = decode(req.headers["authorization"].split(" ")[1].split(":")[1]);
                } catch {
                    return res.status(403).send("Not allowed to access this resource")
                }
                if (!token_data.permissions.includes("list-networks")) {
                    return res.status(403).send("Not allowed to access this resource")
                }
            } else {
                try {
                    var token_data = decode(req.headers["authorization"].split(" ")[1]);
                } catch {
                    return res.status(403).send("Not allowed to access this resource")
                }
                if (!token_data.permissions.includes("list-networks")) {
                    return res.status(403).send("Not allowed to access this resource")
                }
            }

            let networks;
            try {
                networks = await prisma.network.findMany();
            } catch (error) {
                return res.status(500).send("Internal Server Error");
            }
            return res.status(200).send(networks);
        default:
            return res.status(400).send("Invalid request method");
    }
}