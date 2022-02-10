import { verify } from "jsonwebtoken";
import { connectToDatabase } from "../../../../../../../../util/mongodb";
import crypto from "crypto"
import axios from "axios";
import { ObjectId } from "mongodb";
export default async function handler(req, res) {
    const { method, query: { id, snapshot } } = req;
    console.log("a;ldfkjs;ldfj;asldkfjalsdkfjk")
    let user;
    try {
        user = verify(req.headers.authorization.split(" ")[1], process.env.ENC_KEY);
    } catch (error) {
        console.log("error")
        return res.status(401).send("Unauthorized");
    }

    if (!user) return res.status(401).send("Unauthorized");

    const { db } = await connectToDatabase();

    let instance;
    let node;

    try {
        instance = await db.collection("instances").findOne({
            _id: ObjectId(id),
            [`users.${user.id}`]: { $exists: true }
        })
    } catch (error) {
        console.log(error)
        return res.status(500).send(error);
    }

    if (!instance) return res.status(404).send("Instance not found");

    try {
        node = await db.collection("nodes").findOne({
            _id: ObjectId(instance.node)
        })
    } catch (error) {
        console.log(error)
        return res.status(500).send(error);
    }

    if (!node) return res.status(404).send("Node not found");

    let access_token;
    try {
        const decipher = crypto.createDecipheriv("aes-256-ctr", process.env.ENC_KEY, Buffer.from(node.access_token_iv, "hex"));
        access_token = Buffer.concat([decipher.update(Buffer.from(node.access_token.split("::")[1], "hex")), decipher.final()]);
    } catch (error) {
        console.log(error)
        return res.status(500).send(error);
    }

    try {
        await axios.delete(`${node.address.ssl ? "https://" : "http://"}${node.address.hostname}:${node.address.port}/api/v1/instances/${id}/snapshots/${snapshot}`, {
            headers: {
                "Authorization": `Bearer ${access_token.toString()}`
            }
        })
    } catch (error) {
        console.log("error")
        return res.status(500).send(error);
    }

    try {
        await db.collection("snapshots").deleteOne({
            _id: ObjectId(snapshot)
        })
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
    return res.status(200).send("Success");
}