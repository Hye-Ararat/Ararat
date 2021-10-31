import {ObjectId} from 'mongodb';

const { connectToDatabase } = require("../../../../../util/mongodb");
export default async function handler(req, res) {
  const {
    method,
    query: { id },
  } = req;
  switch (method) {
    case "GET": {
      if (typeof id != "string" || Buffer.byteLength(id, "utf8") < 12)
        return res.json({ status: "error", data: "Invalid Magma Cube" });
      var { db } = await connectToDatabase();
      const magma_cube_data = await db
        .collection("magma_cubes")
        .findOne({ _id: ObjectId(id) });
      magma_cube_data
        ? res.json({ status: "success", data: magma_cube_data })
        : res.json({ status: "error", data: "Magma Cube not found" });
      break;
    }
  }
}
