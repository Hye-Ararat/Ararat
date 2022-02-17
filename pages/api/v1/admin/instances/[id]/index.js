import { ObjectId } from "mongodb";
import crypto from "crypto";
import axios from "axios";
import prisma from "../../../../../../lib/prisma";
import decodeToken from "../../../../../../lib/decodeToken";
import { del } from "../../../../../../lib/requestNode";
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
          users: {
            select: {
              id: permissions.includes("list-users"),
              user: {
                select: {
                  firstName: permissions.includes("list-users"),
                  lastName: permissions.includes("list-users"),
                  email: permissions.includes("list-users"),
                  id: permissions.includes("list-users"),
                  username: permissions.includes("list-users"),
                  permissions: permissions.includes("view-user"),
                }
              },
            }
          },
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
      if (!permissions.includes("delete-instance")) return res.status(403).send("Not allowed to access this resource");
      const instanceToDelete = await prisma.instance.findUnique({
        where: {
          id: id
        },
        include: {
          node: true
        }
      })
      try {
        await del(instanceToDelete.node, `/api/v1/instances/${id}`);
      } catch (error) {
        return res.status(500).send(error);
      }

      try {
        await prisma.instance.delete({
          where: {
            id: id
          }
        })
      } catch (error) {
        return res.status(500).send(error)
      }
      return res.status(204).send();
      break;
    case "PATCH":
      //Update Instance
      break;

    default:
      return res.status(400).send("Invalid Method");
      break;
  }
}
