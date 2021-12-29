import { decode, verify } from "jsonwebtoken";

export default async function handler(req, res) {
    const {query: {id}, method} = req;
    if (method != "POST") {
        return res.status(400).send("Invalid Method");
    }
    if (!req.body.access_token) return res.status(400).send("Access Token is Required");
    if (!req.body.access_token.includes(":::")) return res.status(403).send("Unauthorized");
    try {
        var valid = verify(req.body.access_token.split(":::")[1], process.env.ENC_KEY);
    } catch (error) {
        return res.status(403).send("Unauthorized");
    }
    if (!valid)  {
        return res.status(403).send("Unauthorized")
    }
    var token_data = decode(req.body.access_token.split(":::")[1]);
    if (token_data.instance_id != req.query.id) return res.status(403).send("Unauthorized");
    if (token_data.type != "console_access_token") return res.status(403).send("Unauthorized");
    return res.send("Access Token Is Valid!")
}