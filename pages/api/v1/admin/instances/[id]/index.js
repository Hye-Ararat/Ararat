import { ObjectId } from "mongodb";
import { connectToDatabase } from "../../../../../../util/mongodb";
export default async function handler(req, res) {
    const {method, query: {id, include}} = req;
    var { db } = await connectToDatabase();
    var instance = await db.collection("instances").findOne({
        _id: ObjectId(id),
    })
    if (instance && include) {
        console.log(include)
        instance.relationships = {}
        if (include.includes("magma_cube")) {
            console.log(include)
            instance.relationships.magma_cube = await db.collection("magma_cubes").findOne({
                _id: ObjectId(instance.magma_cube.cube)
            })
        }
        if (include.includes("node")) {
            instance.relationships.node = await db.collection("nodes").findOne({
                _id: ObjectId(instance.node)
            })
            instance.relationships.node.access_token = undefined;
            instance.relationships.node.access_token_iv = undefined;
        }
        if (include.includes("allocations")) {
            instance.relationships.allocations = {}
            instance.relationships.allocations.main = {}
            instance.relationships.allocations.list = []
            instance.relationships.allocations.main = await db.collection("allocations").findOne({
                _id: ObjectId(instance.allocations.main)
            })
            for (var i = 0; i < instance.allocations.list.length; i++) {
                var allocation = instance.allocations.list[i]
                var allocation_object = await db.collection("allocations").findOne({
                    _id: ObjectId(allocation)
                })
                instance.relationships.allocations.list.push(allocation_object)
                console.log(allocation_object)
            }
        }
    }
    return instance ? res.json(instance) : res.status(404).send("Instance Does Not Exist")
}