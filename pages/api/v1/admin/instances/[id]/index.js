import { ObjectId } from "mongodb";
import { connectToDatabase } from "../../../../../../util/mongodb";
export default async function handler(req, res) {
    const {method, query: {id, include}} = req;
    var { db } = await connectToDatabase();
    var instance = await db.collection("instances").findOne({
        _id: ObjectId(id),
    })
    if (instance && include) {
        instance.relationships = {}
        if (include.includes("magma_cube")) {
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
        if (include.includes("network")) {
            instance.relationships.network = {
                id: null,
                address: {
                    ipv4: null,
                    ipv6: null,
                    ip_alias: null
                },
                relationships: {
                    network_forwards: []
                }
            }
            var network = await db.collection("network").findOne({
                _id: ObjectId(instance.network)
            })
            if (network) {
                instance.relationships.network.id = network._id
                instance.relationships.network.address.ipv4 = network.address.ipv4
                instance.relationships.network.address.ipv6 = network.address.ipv6
                instance.relationships.network.address.ip_alias = network.address.ip_alias
                var network_forwards = await db.collection("network_forwards").find({
                    network: instance.network
                })
                instance.relationships.network.relationships.network_forwards =  await network_forwards.toArray()
            }
        }
    }
    return instance ? res.json(instance) : res.status(404).send("Instance Does Not Exist")
}