import crypto from "crypto";
import { connectToDatabase } from "../../../../../../../util/mongodb";
import { ObjectId } from "mongodb";
import { post } from "axios";
import { decode } from "jsonwebtoken";

export default async function handler(req, res) {
    const { method, query: { id } } = req;

    try {
        var user = decode(req.headers.authorization.split(" ")[1]);
    } catch (error) {
        return res.status(401).send("Unauthorized");
    }

    switch (method) {
        case "GET":
            console.log("Getting backups");
            break;
        case "POST":
            if (!req.body.name) return res.status(400).send("Missing backup name");

            const { db } = await connectToDatabase();
            const instance = await db.collection("instances").findOne({
                _id: ObjectId(id),
                [`users.${user.id}`]: { $exists: true }
            });
            const node = await db.collection("nodes").findOne({
                _id: ObjectId(instance.node)
            });
            try {
                const decipher = crypto.createDecipheriv("aes-256-ctr", process.env.ENC_KEY, Buffer.from(node.access_token_iv, "hex"))
                var access_token = Buffer.concat([decipher.update(Buffer.from(node.access_token.split("::")[1], "hex")), decipher.final()])
            } catch (error) {
                console.log(error);
                return res.status(500).send(error);
            }
            try {
                var backupDB = await db.collection("backups").insertOne({
                    name: req.body.name,
                    instance: instance._id.toHexString(),
                    pending: true,
                    created_at: new Date()
                });
            } catch (error) {
                return res.status(500).send(error);
            }
            try {
                const backup = await post(`${node.address.ssl ? "https://" : "http://"}${node.address.hostname}:${node.address.port}/api/v1/instances/${id}/backups`, {
                    name: backupDB.insertedId.toString(),
                }, {
                    headers: {
                        Authorization: `Bearer ${access_token.toString()}`,
                        "Content-Type": "application/json"
                    }
                })
            } catch (error) {
                console.log(error);
                return res.status(500).send(error);
            }
            return res.status(200).send("Success");
            break;
        default:
            return res.status(400).send("Invalid method");

    }
}