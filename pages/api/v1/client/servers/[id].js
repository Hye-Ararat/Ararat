import { ObjectId } from "mongodb";
import { connectToDatabase } from "../../../../../util/mongodb";

export default async function handler(req, res) {
    const {method, query: {id}} = req;
    var {db} = await connectToDatabase();
    var server = await db.collection("servers").findOne({
        _id: ObjectId(id)
    })
    server ? res.json({status: "success", data: server}) : res.json({status: "error", data: "Server not found"})
}