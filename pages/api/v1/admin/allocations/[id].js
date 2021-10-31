const {connectToDatabase} = require("../../../../../util/mongodb");
const {ObjectId} = require("mongodb");

export default async function handler(req, res) {
    const {method, query: {id}} = req;
    const {db} = await connectToDatabase();
    const allocation = await db.collection("allocations").findOne({_id: ObjectId(id)})
    allocation ? res.json({status: "success", data: allocation}) : res.json({status: "error", message: "Allocation not found"})
}