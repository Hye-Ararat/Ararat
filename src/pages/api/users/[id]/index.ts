import { NextApiRequest, NextApiResponse } from "next";
import mongo from "@/lib/mongo";
import { ObjectId } from "mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method == "DELETE") {
        const id = req.query.id?.toString()
        await mongo.db().collection("User").deleteOne({_id: new ObjectId(id)})
        res.status(200).send("Success");
    }
}