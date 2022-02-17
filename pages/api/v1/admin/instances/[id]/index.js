import { ObjectId } from "mongodb";
import { connectToDatabase } from "../../../../../../util/mongodb";
import crypto from "crypto";
import axios from "axios";
import prisma from "../../../../../../lib/prisma";
export default async function handler(req, res) {
  const {
    method,
    query: { id, include }
  } = req;
  const permissions = decodeToken(req.headers["authorization"].split(" ")[1]).permissions;
  switch (method) {
    case "GET":
      if (!permissions.includes("view-instance")) return res.status(403).send("Not allowed to access this resource");
      const instance = await prisma.instance.findUnique({
        where: {
          id: id
        },
        include: {
          backups: permissions.includes("list-backups"),
          snapshots: permissions.includes("list-snapshots"),
          users: permissions.includes("list-users"),
          node: permissions.includes("view-node"),
          devices: true,
          image: {
            select: {
              console: true,
              entrypoint: true,
              id: true,
              name: true,
              stateless: true,
              type: true,
              magmaCube: {
                select: {
                  id: true,
                  name: true
                }
              }
            }
          }
        }
      })
      if (!instance) return res.status(404).send("Instance not found");
      return res.status(200).send(instance);
      break;
    case "DELETE":
      if (!instance) {
        return res.status(404).send("Instance Does Not Exist");
      }
      try {
        var node = await db.collection("nodes").findOne({
          _id: ObjectId(instance.node)
        });
      } catch (error) {
        console.log(error);
        return res.status(500).send("An error occured while deleting the instance");
      }

      try {
        var decipher = crypto.createDecipheriv(
          "aes-256-ctr",
          process.env.ENC_KEY,
          Buffer.from(node.access_token_iv, "hex")
        );
        var access_token = Buffer.concat([
          decipher.update(Buffer.from(node.access_token.split("::")[1], "hex")),
          decipher.final()
        ]);
      } catch (error) {
        console.log(error);
        return res.status(500).send("An error occured while deleting the instance");
      }

      try {
        await axios.delete(
          `${node.address.ssl ? "https://" : "http://"}${node.address.hostname}:${node.address.port}/api/v1/instances/${id}`,
          {
            headers: {
              Authorization: `Bearer ${access_token}`
            }
          }
        );
      } catch (error) {
        console.log(error);
        return res.status(500).send("An error occured while deleting the instance");
      }

      await db.collection("instances").deleteOne({
        _id: ObjectId(id)
      });

      return res.status(200).send("Success");
      break;
    case "PATCH":
      if (!instance) {
        return res.status(404).send("Instance Does Not Exist");
      }
      try {
        var node = await db.collection("nodes").findOne({
          _id: ObjectId(instance.node)
        });
      } catch (error) {
        console.log(error);
        return res.status(500).send("An error occured while deleting the instance");
      }

      try {
        var decipher = crypto.createDecipheriv(
          "aes-256-ctr",
          process.env.ENC_KEY,
          Buffer.from(node.access_token_iv, "hex")
        );
        var access_token = Buffer.concat([
          decipher.update(Buffer.from(node.access_token.split("::")[1], "hex")),
          decipher.final()
        ]);
      } catch (error) {
        console.log(error);
        return res.status(500).send("An error occured while editing the instance");
      }

      try {
        node.findOneAndUpdate({
          _id: ObjectId(instance.node)
        }, {
          $set: {
            name: req.body.name,
          }
        });
      } catch (error) {
        console.log(error);
        return res.status(500).send("An error occured while editing the instance");
      }
      break;

    default:
      return res.status(400).send("Invalid Method");
      break;
  }
}
