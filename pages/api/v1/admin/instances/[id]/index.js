import { ObjectId } from "mongodb";
import { connectToDatabase } from "../../../../../../util/mongodb";
import crypto from "crypto";
import axios from "axios";
export default async function handler(req, res) {
  const {
    method,
    query: { id, include }
  } = req;
  var { db } = await connectToDatabase();
  var instance = await db.collection("instances").findOne({
    _id: ObjectId(id)
  });

  switch (method) {
    case "GET":
      if (instance && include) {
        instance.relationships = {};
        if (include.includes("magma_cube")) {
          instance.relationships.magma_cube = await db.collection("magma_cubes").findOne({
            _id: ObjectId(instance.magma_cube.id)
          });
        }
        if (include.includes("node")) {
          instance.relationships.node = await db.collection("nodes").findOne({
            _id: ObjectId(instance.node)
          });
          instance.relationships.node.access_token = undefined;
          instance.relationships.node.access_token_iv = undefined;
        }
        if (include.includes("network")) {
            instance.relationships.network = {
                id: null,
                address: {
                    ipv4: null,
                    ipv6: null,
                    ip_alias: null
                },
                relationships: {
                    ports: []
                }
            }
            var network = await db.collection("network").findOne({
                _id: ObjectId(instance.network)
            })
            if (network) {
                instance.relationships.network.id = network._id
                instance.relationships.network.address.ipv4 = network.address.ipv4
                instance.relationships.network.address.ipv6 = network.address.ipv6
                instance.relationships.network.address.ip_alias = network.address.ip_alias
                var ports = await db.collection("ports").find({
                    network: instance.network
                })
                instance.relationships.network.relationships.ports = await ports.toArray()
            }
          };
          var network = await db.collection("network").findOne({
            _id: ObjectId(instance.network)
          });
          if (network) {
            instance.relationships.network.id = network._id;
            instance.relationships.network.address.ipv4 = network.address.ipv4;
            instance.relationships.network.address.ipv6 = network.address.ipv6;
            instance.relationships.network.address.ip_alias = network.address.ip_alias;
            var network_forwards = await db.collection("network_forwards").find({
              network: instance.network
            });
            instance.relationships.network.relationships.network_forwards = await network_forwards.toArray();
          }
        }
      return instance ? res.json(instance) : res.status(404).send("Instance Does Not Exist");

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
