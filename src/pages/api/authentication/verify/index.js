import { validateSession } from "@/lib/oidc";
import { decodeJwt } from "jose";
import { ObjectId } from "mongodb";
import mongo from "../../../../lib/mongo";



export default async function handler(req, res) {
    console.log(req.headers)
    let valid = await validateSession(req.headers["access_token"])
    if (valid) {
        let userId = decodeJwt(req.headers["access_token"]).sub;
        let user = await mongo.db().collection("User").findOne({ "_id": new ObjectId(userId) });

        console.log(user)
        res.status(200).json({
            ...user,
            id: userId
        })
    } else {
        res.status(401).json({ "status": "invalid" })
    }
}