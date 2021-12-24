const {connectToDatabase} = require('../../../../../../util/mongodb');
const {ObjectId} = require('mongodb');

export default async function handler(req, res) {
    const { method, query : {id} } = req;
    switch (method) {
        case 'GET': {
            if (typeof (id) != "string" ||  Buffer.byteLength(id, "utf8") < 12) return res.json({status: "error", data: "Invalid Request"})
             var {db} = await connectToDatabase();
             var network_container = await db.collection("network_containers").findOne({_id: ObjectId(id)});
             network_container ? res.json(network_container) : res.status(404).send("Network Container does not exist")
             break;
        } case 'PUT': {

        }
    }
}