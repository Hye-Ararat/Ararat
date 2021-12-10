import { verify, decode } from "jsonwebtoken";
import { ObjectId } from "mongodb";
export default async function handler(req, res) {
    console.log(req.headers["refresh-token"]);
    try {
    var token_data = verify(req.headers["refresh-token"], process.env.ENC_KEY);
    } catch {
        return res.status(401).send("Invalid refresh token");
    }
    if (token_data) {
        const {db} = await require("../../../../../util/mongodb").connectToDatabase();
        var user_data = await db.collection("users").findOne({
            _id: ObjectId(token_data.user)
        })
        if (user_data) {
            user_data.password = undefined;
            user_data.id = user_data._id;
            user_data._id = undefined;
            return res.json(user_data);
        } else {
            return res.status(404).send("User not found");
        }
    }
    return res.status(401).send("Invalid refresh token");
}