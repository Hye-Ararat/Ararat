import { ObjectId } from "mongodb";
import { connectToDatabase } from "../../../../../../util/mongodb";
export default async function handler(req, res) {
    const {method, query: {id, include}} = req;
    var { db } = await connectToDatabase();
    var server = await db.collection("servers").findOne({
        _id: ObjectId(id),
    })
    if (server && include) {
        console.log(include)
        server.relationships = {}
        if (include.includes("magma_cube")) {
            console.log(include)
            server.relationships.magma_cube = await db.collection("magma_cubes").findOne({
                _id: ObjectId(server.magma_cube.cube)
            })
        }
        if (include.includes("node")) {
            server.relationships.node = await db.collection("nodes").findOne({
                _id: ObjectId(server.node)
            })
            server.relationships.node.access_token = undefined;
            server.relationships.node.access_token_iv = undefined;
        }
        if (include.includes("allocations")) {
            server.relationships.allocations = {}
            server.relationships.allocations.main = {}
            server.relationships.allocations.list = []
            server.relationships.allocations.main = await db.collection("allocations").findOne({
                _id: ObjectId(server.allocations.main)
            })
            for (var i = 0; i < server.allocations.list.length; i++) {
                var allocation = server.allocations.list[i]
                var allocation_object = await db.collection("allocations").findOne({
                    _id: ObjectId(allocation)
                })
                server.relationships.allocations.list.push(allocation_object)
                console.log(allocation_object)
            }
        }
    }
    return server ? res.json(server) : res.status(404).send("Server Does Not Exist")
}