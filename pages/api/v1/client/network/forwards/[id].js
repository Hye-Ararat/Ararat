const { connectToDatabase } = require('../../../../../../util/mongodb');
const { ObjectId } = require('mongodb');

export default async function handler(req, res) {
    const { method, query: { id } } = req;
    switch (method) {
        case 'GET': {
            if (typeof (id) != "string" || Buffer.byteLength(id, "utf8") < 12) return res.json({ status: "error", data: "Invalid Request" })
            var { db } = await connectToDatabase();
            var ports = await db.collection("ports").findOne({ _id: ObjectId(id) });
            ports ? res.json(ports) : res.status(404).send("Network Forward does not exist")
            break;
        } case 'PUT': {

        }
    }
}