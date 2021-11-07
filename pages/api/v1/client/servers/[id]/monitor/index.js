import { connectToDatabase } from "../../../../../../../util/mongodb";
import { sign } from "jsonwebtoken";
export default async function handler(req, res) {
  const {
    query: { id },
  } = req;
  let { db } = await connectToDatabase();
  var access_token_jwt = sign(
    {
      server_id: id,
      type: "monitor_access_token",
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "15m",
      algorithm: "HS256",
    }
  );
  var access_token_identifier = access_token_jwt.substr(
    0,
    access_token_jwt.indexOf(".")
  );
  var access_token = access_token_identifier + ":::" + access_token_jwt;
  try {
    var sessions = await db.collection("servers").findOne({
      _id: ObjectId(id),
      [`users.${token_data.user}`]: { $exists: true },
    });
  } catch (error) {
    return res.status(500).send({
      status: "error",
      data: "An error occured while creating the access token credentials",
    });
  }
  if (!sessions)
    return res.status(403).send({
      status: "error",
      data: "You do not have permission to create an access token for this server",
    });
  return res.json({
    status: "success",
    data: {
      access_token: access_token,
    },
  });
}
