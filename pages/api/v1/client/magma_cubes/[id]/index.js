import { ObjectId } from "mongodb";
import { connectToDatabase } from "../../../../../../util/mongodb";
import {decode} from "jsonwebtoken";
export default async function handler(req, res) {
    const {query: {id}} = req;
    let {db} = await connectToDatabase();
    try {
    var user_data = await decode(req.headers.authorization.split(" "), process.env.ACCESS_TOKEN_SECRET);
    } catch {
        res.status(403).json({status: "error", data: "Unauthorized"});
    }
    let server_check = db.collection("servers").findOne({
        [`users.${user_data.user}`]: {$exists: true},
        magma_cube: {
            cube: id
        }
    })
    if (!server_check) return res.status(404).json({
        status: "error",
        data: "Magma Cube does not exist"
    })
    let magmaCube = await db.collection("magma_cubes").findOne({
        _id: ObjectId(id)
    });
    if (!magmaCube) res.status(404).json({
        status: "error",
        data: "Magma Cube does not exist"
    })
    return res.json({
        status: "success",
        data: magmaCube
    })
}