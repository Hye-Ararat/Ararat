import { decode, sign } from "jsonwebtoken";
import { connectToDatabase } from "../../../../../../../../util/mongodb";
import { ObjectId } from "mongodb";
export default async function handler(req, res) {
    let user_data = await decode(req.headers.authorization.split(" ")[1]);
    let { db } = await connectToDatabase();
    var instance = db.collection("instances").findOne({
        _id: ObjectId(req.query.id),
        [`users.${user_data.id}`]: { $exists: true },
    })
    if (instance) {
        var access_token_jwt = sign(
            {
                instance_id: req.query.id,
                type: "console_access_token",
                user: user_data.id
            },
            process.env.ENC_KEY,
            {
                expiresIn: "15m",
                algorithm: "HS256",
            }
        );
        var access_token_identifier = access_token_jwt.split(
            0,
            access_token_jwt.indexOf(".")
        )[0];
        var access_token = access_token_identifier + ":::" + access_token_jwt;
        return res.send(access_token)
    } else {
        return res.status(403).send("You do not have permission to access the console for this instance")
    }
}