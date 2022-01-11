const {post, get} = require("axios");
import {connectToDatabase} from "../../../../../../../util/mongodb"
import { ObjectId } from "mongodb";
import { decode } from "jsonwebtoken";
import crypto from "crypto";
export default async function handler(req, res) {
    const {query: {id}, method} = req;
    var {db} = await connectToDatabase();
    try {
        var user = decode(req.headers.authorization.split(" ")[1])
    } catch {
        return res.status(403).send("Unauthorized");
    }
    console.log(user)
    console.log(id)
    try {
        var instance = await db.collection("instances").findOne({
            _id: ObjectId(id),
            [`users.${user.id}`]: {$exists: true}
        })
    } catch (error){
        console.log(error)
        console.log("error 1")
        return res.status(500).json(
            "An error occured while sending the state action")
    }
    if (!instance) {
        return res.status(404).send("Instance does not exist")
    }
    try {
        var node = await db.collection("nodes").findOne({
            _id: ObjectId(instance.node)
        })
    } catch {
        return res.status(500).send("An error occured while fetching the node data");
    }
    if (!node) {
        return res.status(500).send("Node associated with server does not exist")
    }

    switch (method) {
        case "GET":
            try {
                var decipher = crypto.createDecipheriv("aes-256-ctr", process.env.ENC_KEY, Buffer.from(node.access_token_iv, "hex"))
                var access_token = Buffer.concat([decipher.update(Buffer.from(node.access_token, "hex")), decipher.final()])
                var state = await post(`${node.address.ssl ? "https://" : "http://"}${node.address.hostname}:${node.address.port}/api/v1/instances/${id}/state`, req.body, {
                    headers: {
                        Aunthorization: `Bearer ${access_token.toString()}`
                    }
                })
            } catch (error){
                console.log(error)
                console.log("error 2")
                return res.status(500).send("An error occured while sending the power action")
            }
            return res.send("Success")
            break;
        case "POST":
            try {
                var decipher = crypto.createDecipheriv("aes-256-ctr", process.env.ENC_KEY, Buffer.from(node.access_token_iv, "hex"))
                var access_token = Buffer.concat([decipher.update(Buffer.from(node.access_token, "hex")), decipher.final()])
                var state = await post(`${node.address.ssl ? "https://" : "http://"}${node.address.hostname}:${node.address.port}/api/v1/instances/${id}/state`, req.body, {
                    headers: {
                        Aunthorization: `Bearer ${access_token.toString()}`
                    }
                })
            } catch (error){
                console.log(error)
                console.log("error 2")
                return res.status(500).send("An error occured while fetching the power state")
            }
            return res.send(state.data)
            break;
        default:
            return res.status(405).send("Method not allowed")
            break;
    }

}