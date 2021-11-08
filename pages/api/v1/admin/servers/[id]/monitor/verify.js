import { connectToDatabase } from "../../../../../../../util/mongodb";
import { decode } from "jsonwebtoken";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  const {
    query: { id },
    method,
  } = req;
  switch (method) {
    case "POST":
      let { db } = await connectToDatabase();
      if (!req.body.access_token)
        return res
          .status(400)
          .send({ status: "error", data: "Access Token is required" });
      console.log("passed 1");
      if (!req.body.access_token.includes(":::"))
        return res.status(403).send({ status: "error", data: "Unauthorized" });
      console.log("passed 2");
      console.log(req.body.access_token.split(":::")[1]);
      try {
        var token_data = await decode(
          req.body.access_token.split(":::")[1],
          process.env.ACCESS_TOKEN_SECRET
        );
      } catch (error) {
        console.log(error);
        console.log("error 1");
        return res.status(403).send({ status: "error", data: "Unauthorized" });
      }
	  console.log(token_data);
      if (token_data.server_id != id)
        return res.status(403).send({ status: "error", data: "Unauthorized" });
      console.log("passed 3");
      if (token_data.type != "monitor_access_token")
        return res.status(403).send({ status: "error", data: "Unauthorized" });
      console.log("passed 4");
      var sessions = await db.collection("servers").findOne({
        _id: ObjectId(id),
        [`users.${token_data.user}`]: { $exists: true },
      });
      let match = false;
      sessions ? (match = true) : (match = false);
      if (!match)
        return res.status(403).send({ status: "error", data: "Unauthorized" });
      console.log("passed 5");
      return res.json({ status: "success", data: "Access Token Is Valid" });
      break;
    default:
      res.status(400).json({ status: "error", data: "Method not allowed" });
  }
}
