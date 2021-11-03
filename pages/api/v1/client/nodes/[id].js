import { ObjectId } from "mongodb";
import { connectToDatabase } from "../../../../../util/mongodb";

export default async function handler(req, res) {
    const {method, query: {id}} = req;
    var {db} = await connectToDatabase();
    var node = await db.collection("nodes").findOne({
        _id: ObjectId(id)
    })
    node ? res.json({status: "success", data: node}) : res.json({status: "error", data: "Node does not exist"})
}