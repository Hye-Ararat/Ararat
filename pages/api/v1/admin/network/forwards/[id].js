const {connectToDatabase} = require("../../../../../../util/mongodb");
const {ObjectId} = require("mongodb");

export default async function handler(req, res) {
    const {method, query: {id}} = req;
    const {db} = await connectToDatabase();
    const network_forward = await db.collection("network_forwards").findOne({_id: ObjectId(id)})
    network_forward ? res.send(network_forward) : res.status(404).send("Network Forward does not exist")
}