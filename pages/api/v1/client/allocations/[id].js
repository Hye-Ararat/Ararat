const {connectToDatabase} = require('../../../../../util/mongodb');
const {ObjectId} = require('mongodb');

export default async function handler(req, res) {
    const { method, query : {id} } = req;
    switch (method) {
        case 'GET': {
            if (typeof (id) != "string" ||  Buffer.byteLength(id, "utf8") < 12) return res.json({status: "error", data: "Invalid Request"})
             var {db} = await connectToDatabase();
             var allocation = await db.collection("allocations").findOne({_id: ObjectId(id)});
             allocation ? res.json({status: "success", data: allocation}) : res.json({status: "error", data: "Invalid Request"})
             break;
        } case 'PUT': {

        }
    }
}