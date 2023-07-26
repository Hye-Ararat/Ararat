import mongo from "@/lib/mongo";
import { NextApiRequest, NextApiResponse } from "next";
import { ObjectId } from "mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method == "DELETE") {
        const imageServerCollection = await mongo.db().collection("ImageServer")
        imageServerCollection.deleteOne({
            _id: new ObjectId(req.query.id)
        })
        res.send("Success")
    }
}