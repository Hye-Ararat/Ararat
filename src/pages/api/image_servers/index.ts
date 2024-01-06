import mongo from "@/lib/mongo";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.headers.authorization != process.env.ENC_KEY) {
        res.status(401).send("Unauthorized");
        return;
    }
    if (req.method == "POST") {
        const imageServerCollection = await mongo.db().collection("ImageServer")
        const body = req.body;
        const newImageServer = await imageServerCollection.insertOne({
            name: body.name,
            url: body.url
        })
        res.status(200).json(newImageServer)
    }
}