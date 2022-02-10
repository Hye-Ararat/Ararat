import { verify } from "jsonwebtoken";
import { connectToDatabase } from "../../../../../../../../util/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
    const { method, query: { id, backup } } = req;
    if (!req.headers.authorization.includes("::")) {
        return res.status(403).send("Not allowed to access this resource")
    }
    let allowed;
    try {
        allowed = verify(req.headers.authorization.split("::")[1], process.env.ENC_KEY);
    } catch (error) {
        allowed = false;
    }
    if (!allowed) return res.status(403).send("Not allowed to access this resource")
    const { db } = await connectToDatabase();
    try {
        await db.collection("backups").updateOne({
            _id: ObjectId(backup),
        }, {
            $set: { pending: req.body.state }
        })
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
    return res.status(200).send("Backup State Updated");

}