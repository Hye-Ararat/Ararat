import { ObjectId } from "mongodb";
import { connectToDatabase } from "../../../../../../util/mongodb";
import {decode} from "jsonwebtoken";

export default async function handler(req, res) {
    const { method, query: { id, include } } = req;
    var { db } = await connectToDatabase();
    var user_info = decode(req.headers.authorization.split(" ")[1])
    var instance = await db.collection("instances").findOne({
        _id: ObjectId(id),
        [`users.${user_info.id}`]: {$exists: true}
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
        if (include.includes("network_container")) {
            instance.relationships.network_container = {
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
            var network_container = await db.collection("network_containers").findOne({
                _id: ObjectId(instance.network_container)
            })
            if (network_container) {
                instance.relationships.network_container.id = network_container._id
                instance.relationships.network_container.address.ipv4 = network_container.address.ipv4
                instance.relationships.network_container.address.ipv6 = network_container.address.ipv6
                instance.relationships.network_container.address.ip_alias = network_container.address.ip_alias
                var network_forwards = await db.collection("network_forwards").find({
                    network_container: instance.network_container
                })
                instance.relationships.network_container.relationships.network_forwards =  await network_forwards.toArray()
            }
        }
    }
    return instance ? res.json(instance) : res.status(404).send("Instance Does Not Exist")
}