const {connectToDatabase} = require("../../../../../../util/mongodb");
const {ObjectId} = require("mongodb");

export default async function handler(req, res) {
    const {method, query: {id}} = req;
    const {db} = await connectToDatabase();
    const network_container = await db.collection("network_containers").findOne({_id: ObjectId(id)})
    network_container ? res.send(network_container) : res.status(404).send("Network Container does not exist")
}