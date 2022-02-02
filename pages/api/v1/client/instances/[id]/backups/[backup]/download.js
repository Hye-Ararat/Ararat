import { verify } from "jsonwebtoken";
import { ObjectId } from "mongodb";
import { connectToDatabase } from "../../../../../../../../util/mongodb";
import axios from "axios";
import crypto from "crypto"

export default async function handler(req, res) {
    const { method, query: { id, backup } } = req;
    console.log(req.headers)
    if (req.query.authorization) {
        req.headers["authorization"] = "Bearer " + req.query.authorization
    }
    let user;
    try {
        user = verify(req.headers.authorization.split(" ")[1], process.env.ENC_KEY);
    } catch (error) {
        return res.status(401).send("Unauthorized");
    }
    if (!user) return res.status(401).send("Unauthorized");

    const { db } = await connectToDatabase();

    let instance;
    let node;
    let backupData;

    try {
        instance = await db.collection("instances").findOne({
            _id: ObjectId(id),
            [`users.${user.id}`]: { $exists: true }
        })
    } catch (error) {
        return res.status(500).send(error);
    }

    if (!instance) return res.status(404).send("Instance not found");

    try {
        backupData = await db.collection("backups").findOne({
            _id: ObjectId(backup),
            instance: instance._id.toHexString()
        })
    } catch (error) {
        return res.status(500).send(error);
    }

    if (!backupData) return res.status(404).send("Backup not found");

    try {
        node = await db.collection("nodes").findOne({
            _id: ObjectId(instance.node)
        })
    } catch (error) {
        return res.status(500).send(error);
    }

    if (!node) return res.status(404).send("Node not found");


    let download;
    let access_token;

    try {
        const decipher = crypto.createDecipheriv("aes-256-ctr", process.env.ENC_KEY, Buffer.from(node.access_token_iv, "hex"))
        access_token = Buffer.concat([decipher.update(Buffer.from(node.access_token.split("::")[1], "hex")), decipher.final()])

    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }

    try {
        download = await axios({
            url: `${node.address.ssl ? "https://" : "http://"}${node.address.hostname}:${node.address.port}/api/v1/instances/${id}/backups/${backupData._id.toHexString()}`, responseType: "stream", method: "get", headers: {
                Authorization: `Bearer ${access_token.toString()}`
            }
        })
    } catch (error) {
        return res.status(500).send(error);
    }
    res.writeHead(200, {
        "Content-Type": "application/octet-stream",
        "Content-Disposition": `attachment; filename="${backupData.name}.tar.gz"`,
    })
    return download.data.pipe(res);
}