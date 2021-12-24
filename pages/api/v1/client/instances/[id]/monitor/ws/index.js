import { connectToDatabase } from "../../../../../../../../util/mongodb";
import { sign, decode } from "jsonwebtoken";
import { ObjectId } from "mongodb";
export default async function handler(req, res) {
  const {
    query: { id },
  } = req;
  let { db } = await connectToDatabase();
  let user_data = await decode(req.headers.authorization.split(" ")[1]);
  console.log(user_data)
  var access_token_jwt = sign(
    {
      instance_id: id,
      type: "monitor_access_token",
      user: user_data.id
    },
    process.env.ENC_KEY,
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
    var sessions = await db.collection("instances").findOne({
      _id: ObjectId(id),
      [`users.${user_data.id}`]: { $exists: true },
    });
  } catch (error) {
    console.log(error)
    return res.status(500).send({
      status: "error",
      data: "An error occured while creating the access token credentials",
    });
  }
  if (!sessions)
    return res.status(403).send({
      status: "error",
      data: "You do not have permission to create an access token for this instance",
    });
  return res.json({
    status: "success",
    data: {
      access_token: access_token,
    },
  });
}