import { connectToDatabase } from "../../../../../../util/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
    var {db} = await connectToDatabase();
    try {
        var node = await db.collection("nodes").findOne({
            _id: ObjectId(req.query.id)
        });
        node.access_token = undefined;
        node.access_token_iv = undefined;
        node.id = node._id;
        node._id = undefined;   
    } catch {
        return res.status(500).send("An error occured while fetching the node information")
    }
    if (!node) {
        return res.status(404).send("Node does not exist");
    }
    return res.send(node);
}