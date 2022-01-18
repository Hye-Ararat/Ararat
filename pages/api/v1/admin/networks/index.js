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
                _id: ObjectId(req.body.node)
            })
            try {
                var network = await db.collection("networks").insertOne({
                    node: req.body.node,
                    address: {
                        ipv4: req.body.address.ipv4 ? req.body.address.ipv4 : null,
                        ipv6: req.body.address.ipv6 ? req.body.address.ipv6 : null,
                        ip_alias: req.body.address.ip_alias ? req.body.address.ip_alias : null
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
                await axios.post(`${node.address.ssl ? "https" : "http"}://${node.address.hostname}:${node.address.port}/api/v1/network`, {
                    id: network.insertedId.toHexString(),
                    address: {
                        ipv4: req.body.address.ipv4 ? req.body.address.ipv4 : null,
                        ipv6: req.body.address.ipv6 ? req.body.address.ipv6 : null,
                    }
                }, {
                    headers: {
                        "Authorization": `Bearer ${access_token}`
                    }
                })
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