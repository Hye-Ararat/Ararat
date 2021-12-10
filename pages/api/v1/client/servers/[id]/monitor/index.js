import { connectToDatabase } from "../../../../../../../util/mongodb";
import { ObjectId } from "mongodb";
import {verify} from "jsonwebtoken";
import axios from "axios";
import crypto from "crypto"
import db from "../../../../../../../util/mongodb";
export default async function handler(req, res) {
    const {query: {id}} = req;
    try {
        var user = await verify(req.headers.authorization.split(" ")[1], process.env.ENC_KEY)
    } catch (error){
        console.log(error)
        return res.status(403).json({
            status: "error", 
            data: "Unauthorized"
        })
    }
    try {
        var server = await db.collection("servers").findOne({
            _id: ObjectId(id),
            [`users.${user.id}`]: {$exists: true}
        })
    } catch {
        return res.status(500).json({
            status: "error",
            data: "An error occured while fetching the server data"
        })
    }
    if (!server){
        return res.status(404).json({
            status: "error",
            data: "Server does not exist"
        })
    }
    try {
        var node = await db.collection("nodes").findOne({
            _id: ObjectId(server.node)
        })
    } catch {
        return res.status(500).json({
            status: "error",
            data: "An error occured while fetching the node data"
        })
    }
    if (!node) {
        return res.status(500).json({
            status: "error",
            data: "Node does not exist"
        })
    }
    try {
        var decipher = crypto.createDecipheriv("aes-256-ctr", process.env.ENC_KEY, Buffer.from(node.access_token_iv, "hex"))
        var access_token = Buffer.concat([decipher.update(Buffer.from(node.access_token, "hex")), decipher.final()])
        console.log(access_token.toString())
        var monitor = await axios.get(`https://${node.address.hostname}:${node.address.port}/api/v1/servers/${id}/monitor`, {
            headers: {
                Authorization: `Bearer ${access_token.toString()}`
            }
        })
    } catch (err){
        console.log(err)
        return res.status(500).json({
            status: "error",
            data: "An error occured"
        })
    }
    return res.status(200).json({
        status: "success",
        data: monitor.data
    })
    

}