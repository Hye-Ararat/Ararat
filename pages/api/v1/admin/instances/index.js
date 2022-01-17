import { decode } from "jsonwebtoken"
import { ObjectId } from "mongodb";
import { connectToDatabase } from "../../../../../util/mongodb";
import crypto from "crypto";
import axios from "axios";

export default async function handler(req, res) {
    console.log(req.body)
    try {
        var token = decode(req.headers.authorization.split(" ")[1]);
    } catch {
        return res.status(403).send("Unauthorized");
    }

    if (!token.admin.instances.write) {
        return res.status(403).send("Not allowed to access this resource");
    }


    const { db } = await connectToDatabase();

    try {
        var node = await db.collection("nodes").findOne({
            _id: ObjectId(req.body.node)
        })
    } catch {
        return res.status(500).send("Internal Server Error");
    }
    if (!node) {
        return res.status(400).send("Node specified does not exist");
    }

    try {
        var decipher = crypto.createDecipheriv("aes-256-ctr", process.env.ENC_KEY, Buffer.from(node.access_token_iv, "hex"))
        var access_token = Buffer.concat([decipher.update(Buffer.from(node.access_token.split("::")[1], "hex")), decipher.final()])
    } catch {
        return res.status(500).send("Internal Server Error");
    }


    try {
        var instance = await db.collection("instances").insertOne({
            name: req.body.name,
            node: req.body.node,
            magma_cube: req.body.magma_cube,
            limits: req.body.limits,
            users: req.body.users,
            environment: req.body.environment,
            devices: req.body.devices,
            type: req.body.type,
        })
    } catch {
        return res.status(500).send("Internal Server Error");
    }
    var config = {
        id: instance.insertedId,
        devices: req.body.devices,
        limits: req.body.limits,
        type: req.body.type == "n-vps" ? "container" : "virtual-machine",
        image: req.body.magma_cube.image
    }
    console.log(config)
    try {
        axios.post(`${node.address.ssl ? "https://" : "http://"}${node.address.hostname}:${node.address.port}/api/v1/instances`, config, {
            headers: {
                "Authorization": `Bearer ${access_token.toString()}`
            }
        })
    } catch {
        return res.status(500).send("Internal Server Error");
    }
    return res.status(200).send("Startd creating instance");


}