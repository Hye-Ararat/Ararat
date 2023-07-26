import mongo from "@/lib/mongo";
import { NextApiRequest, NextApiResponse } from "next";
import { ObjectId } from "mongodb";
import { getImageServers } from "@/lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method == "GET") {
        let imageServers = await getImageServers();
        let imageServer = imageServers.filter((imageServer) => imageServer["_id"] == req.query.id)[0];
        console.log(imageServer, "asdf")
        if (!req.query.path) {
        let res1 = await fetch(`${imageServer.url}/streams/v1/index.json`, {
            method: "GET",
            cache: "no-cache"
        })
        let json = await res1.json();
        return res.status(200).json(json);
    } else {
        let res1 = await fetch(`${imageServer.url}/${req.query.path}`, {
            method: "GET",
            cache: "no-cache"
        })
        let json = await res1.json();
        return res.status(200).json(json);
    }
    }
    if (req.method == "DELETE") {
        const imageServerCollection = await mongo.db().collection("ImageServer")
        imageServerCollection.deleteOne({
            _id: new ObjectId(req.query.id)
        })
        res.send("Success")
    }
}