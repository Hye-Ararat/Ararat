import { decode, verify } from "jsonwebtoken";
import { ObjectId } from "mongodb";
import axios from "axios";
import crypto from "crypto";

export default async function handler(req, res) {
    const { method, query: { id, include } } = req;
    const { connectToDatabase } = require("../../../../../util/mongodb");
    const { db } = await connectToDatabase();
    console.log(req.headers)
    switch (method) {
        case "POST":
            if (req.headers["authorization"].split(" ")[1].includes("::")) {

            } else if (req.headers["authorization"].split(" ")[1].includes(":")) {
                try {
                    var token_data = decode(req.headers["authorization"].split(" ")[1].split(":")[1]);
                } catch {
                    return res.status(403).send("Not allowed to access this resource")
                }
                if (!token_data.admin.networks.write) {
                    return res.status(403).send("Not allowed to access this resource")
                }
            } else {
                try {
                    var token_data = decode(req.headers["authorization"].split(" ")[1]);
                } catch {
                    return res.status(403).send("Not allowed to access this resource")
                }
                if (!token_data.admin.networks.write) {
                    return res.status(403).send("Not allowed to access this resource")
                }
            }
            var node = await db.collection("nodes").findOne({
                _id: ObjectId(req.body.node.id)
            })
            try {
                var network = await db.collection("networks").insertOne({
                    node: req.body.node.id,
                    address: {
                        ipv4: req.body.address.ipv4 ? req.body.address.ipv4 : null,
                        ipv6: req.body.address.ipv6 ? req.body.address.ipv6 : null,
                        ip_alias: req.body.address.ip_alias ? req.body.address.ip_alias : null
                    },
                    remote: {
                        remote: req.body.remote.remote,
                        primary: req.body.remote.primary,
                        protocol: req.body.remote.protocol,
                        primaryNetwork: req.body.remote.primaryNetwork
                    }
                })
            } catch {
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
                    console.log(network.insertedId.toString())
                    await axios.post(`${node.address.ssl ? "https" : "http"}://${node.address.hostname}:${node.address.port}/api/v1/network`, {
                        id: network.insertedId.toString(),
                        address: {
                            ipv4: req.body.address.ipv4 ? req.body.address.ipv4 : null,
                            ipv6: req.body.address.ipv6 ? req.body.address.ipv6 : null,
                        },
                        remote: {
                            remote: req.body.remote.remote,
                            primary: req.body.remote.primary,
                            primaryNetwork: req.body.remote.primaryNetwork
                        }
                    }, {
                        headers: {
                            "Authorization": `Bearer ${access_token}`
                        }
                    })
                } else if (req.body.remote.remote == true && req.body.remote.primary == false) {
                    let primaryNetwork = await db.collection("networks").findOne({
                        _id: ObjectId(req.body.remote.primaryNetwork)
                    })
                    await axios.post(`${node.address.ssl ? "https" : "http"}://${node.address.hostname}:${node.address.port}/api/v1/network`, {
                        id: network.insertedId.toString(),
                        address: {
                            ipv4: req.body.address.ipv4,
                            ipv6: req.body.address.ipv6 ? req.body.address.ipv6 : null,
                        },
                        remote: {
                            remote: req.body.remote.remote,
                            primary: req.body.remote.primary,
                            primaryNetwork: primaryNetwork["_id"].toString(),
                            address: {
                                ipv4: primaryNetwork.address.ipv4
                            }
                        }
                    }, {
                        headers: {
                            "Authorization": `Bearer ${access_token}`
                        }
                    });
                    let primaryNetworkNode = await db.collection("nodes").findOne({
                        _id: ObjectId(primaryNetwork.node)
                    })
                    try {
                        var decipher2 = crypto.createDecipheriv("aes-256-ctr", process.env.ENC_KEY, Buffer.from(primaryNetworkNode.access_token_iv, "hex"))
                        var accessToken2 = Buffer.concat([decipher2.update(Buffer.from(primaryNetworkNode.access_token.split("::")[1], "hex")), decipher2.final()])
                    } catch (error) {
                        console.log(error)
                    }
                    await axios.post(`${primaryNetworkNode.address.ssl ? "https" : "http"}://${primaryNetworkNode.address.hostname}:${primaryNetworkNode.address.port}/api/v1/network/${req.body.remote.primaryNetwork}/remotes`, {
                        remoteID: network.insertedId.toString(),
                        localID: req.body.remote.primaryNetwork,
                        protocol: "gre",
                        local: primaryNetwork.address.ipv4,
                        remote: req.body.address.ipv4
                    }, {
                        headers: {
                            "Authorization": `Bearer ${accessToken2}`
                        }
                    });

                } else {
                    console.log(network.insertedId.toString())
                    await axios.post(`${node.address.ssl ? "https" : "http"}://${node.address.hostname}:${node.address.port}/api/v1/network`, {
                        id: network.insertedId.toString(),
                        address: {
                            ipv4: req.body.address.ipv4 ? req.body.address.ipv4 : null,
                            ipv6: req.body.address.ipv6 ? req.body.address.ipv6 : null,
                        },
                        remote: {
                            remote: req.body.remote.remote,
                            primary: req.body.remote.primary,
                            primaryNetwork: req.body.remote.primaryNetwork
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
        default:
            return res.status(400).send("Invalid request method");
    }
}