import { sign } from "jsonwebtoken";
import getInstancePermissions from "../../../../../../../../lib/client/getInstancePermissions";
import decodeToken from "../../../../../../../../lib/decodeToken";
import prisma from "../../../../../../../../lib/prisma";

export default async function handler(req, res) {
    const { query: { id } } = req;
    const tokenData = decodeToken(req.headers["authorization"].split(" ")[1]);

    const instance = await prisma.instance.findUnique({
        where: {
            id: id
        },
        include: {
            users: {
                select: {
                    user: {
                        select: {
                            id: true
                        }
                    },
                    permissions: true
                }
            }
        }
    })

    if (!instance) return res.status(404).send("Instance not found");

    const permissions = getInstancePermissions(tokenData.id, instance);

    if (!permissions.includes("view-console")) return res.status(403).send("Not allowed to access this resource");

    const consolePermissions = ["view-console"];

    if (permissions.includes("input-console")) consolePermissions.push("input-console");

    const accessToken = sign({
        instance: instance.id,
        type: "console",
        permissions: consolePermissions
    }, process.env.ENC_KEY, {
        expiresIn: "15m",
        algorithm: "HS256"
    })

    const tokenIdentifier = accessToken.split(0, accessToken.indexOf("."))[0];

    const token = tokenIdentifier + ":::" + accessToken;

    return res.status(200).send(token);
}