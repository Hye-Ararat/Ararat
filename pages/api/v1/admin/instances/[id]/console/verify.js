import { decode, verify } from "jsonwebtoken";
import decodeToken from "../../../../../../../lib/decodeToken";

export default async function handler(req, res) {
    const { query: { id }, method } = req;
    if (method != "POST") {
        return res.status(400).send("Invalid Method");
    }
    if (!req.body.access_token) return res.status(400).send("Access Token is Required");
    if (!req.body.access_token.includes(":::")) return res.status(403).send("Not allowed to access this resource");
    if (!verify(req.body.access_token.split(":::")[1], process.env.ENC_KEY)) return res.status(403).send("Unauthorized");
    const token_data = decodeToken(req.body.access_token.split(" ")[1]);
    if (token_data.instance_id != req.query.id) return res.status(403).send("Unauthorized");
    if (token_data.type != "console_access_token") return res.status(403).send("Unauthorized");
    return res.status(204).send();
}