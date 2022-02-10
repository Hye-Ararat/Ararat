import { decode, verify } from "jsonwebtoken";
import { ObjectId } from "mongodb";
import axios from "axios"
import { convertNetworkID } from "../../../../../../util/converter";
export default async function handler(req, res) {
    const { method, query: { id, include } } = req;
    const { connectToDatabase } = require("../../../../../../util/mongodb");
    const { db } = await connectToDatabase();
    console.log(req)
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
        if (!token_data.admin.networks.read) {
            return res.status(403).send("Not allowed to access this resource")
        }
    } else {
        try {
            var token_data = decode(req.headers["authorization"].split(" ")[1]);
        } catch {
            return res.status(403).send("Not allowed to access this resource")
        }
        if (!token_data.admin.networks.read) {
            return res.status(403).send("Not allowed to access this resource")
        }
    }
    var network = await db.collection("networks").findOne({
        _id: ObjectId(id)
    })
    if (network && include) {
        network.relationships = {}
        if (include.includes("ports")) {
            network.relationships.ports = await db.collection("ports").find({
                network: network._id.toHexString()
            }).toArray()
        }
        if (include.includes("instances")) {
            console.log("yes")
            console.log(convertNetworkID(id))
            network.relationships.instances = await db.collection("instances").find({
                [`devices.${convertNetworkID(id)}`]: { $exists: true }
            }).toArray()
        }
    }
    return res.send(network);
}