import { sign } from "jsonwebtoken";
import decodeToken from "../../../../../../../../lib/decodeToken";
import prisma from "../../../../../../../../lib/prisma";
export default async function handler(req, res) {
  const {
    query: { id },
  } = req;

  const tokenData = decodeToken(req.headers["authorization"].split(" ")[1]);

  const instance = await prisma.instance.findUnique({
    where: {
      id: id
    },
    include: {
      node: true,
      users: {
        select: {
          permissions: true,
          user: {
            select: {
              id: true
            }
          }
        }
      }
    }
  })

  if (!instance) return res.status(404).send("Instance not found");

  const permissions = getInstancePermissions(tokenData.id, instance);

  if (!permissions.includes("view-statistics")) return res.status(403).send("Not allowed to access this resource");

  const accessToken = sign({
    instance: id,
    type: "monitor",
    permissions: ["view-statistics"]
  }, process.env.ENC_KEY, {
    expiresIn: "15m",
    algorithm: "HS256"
  })

  const identifier = accessToken.split(0, accessToken.indexOf("."))[0];

  const token = identifier + ":::" + accessToken;

  return res.status(200).send(token);
}