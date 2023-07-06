import mongo from "@/lib/mongo";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    var nodesCollection = await mongo.db().collection("Node")
    let body = req.body;
    const newNode = await nodesCollection.insertOne({
        data: {
            name: body.name,
            url: `https://${body.domain}:8443`
        }
    })
    res.status(200).json(newNode)
} 