import { decode } from "jsonwebtoken"
import { connectToDatabase } from "../../../../../util/mongodb";
export default async function handler(req, res) {
    console.log(req.body)
    if (req.headers["authorization"].split(" ")[1].includes("::")) {
        //is node key
    } else if (req.headers["authorization"].split(" ")[1].includes(":")) {
        try {
            var token_data = decode(req.headers["authorization"].split(" ")[1].split(":")[1]);
        } catch {
            return res.status(403).send("Not allowed to access this resource");
        }
        if (!token_data.admin.magma_cubes.write) {
            return res.status(403).send("Not allowed to access this resource");
        }
    } else {
        try {
            var token_data = decode(req.headers["authorization"].split(" ")[1]);
        } catch {
            return res.status(403).send("Not allowed to access this resource");
        }
        if (!token_data.admin.magma_cubes.write) {
            return res.status(403).send("Not allowed to access this resource");
        }
    }
    var {db} = await connectToDatabase();
    try {
        var cube = await db.collection("magma_cubes").insertOne(req.body);
    } catch {
        return res.status(500).send("Internal Server Error");
    }
    return res.status(200).send("Cube successfully added");
    res.send("hello")
}