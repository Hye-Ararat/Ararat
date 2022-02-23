import { decode, verify } from "jsonwebtoken"
import { connectToDatabase } from "../../../../../../../util/mongodb";
import { ObjectId } from "mongodb";
import crypto from "crypto"
import decodeToken from "../../../../../../../lib/decodeToken";
import prisma from "../../../../../../../lib/prisma";
import getInstancePermissions from "../../../../../../../lib/client/getInstancePermissions";
import { del, get, post } from "../../../../../../../lib/requestNode";
export default async function handler(req, res) {
    const { query: { id, path }, method } = req;
    const tokenData = decodeToken(req.headers["authorization"].split(" ")[1]);

    const instance = await prisma.instance.findUnique({
        where: {
            id: id
        },
        include: {
            users: {
                select: {
                    permissions: true,
                    user: {
                        select: {
                            id: true,
                        }
                    }
                }
            },
            node: true
        }
    });
    if (!instance) return res.status(404).send("Instance not found");

    const permissions = getInstancePermissions(tokenData.id, instance);

    switch (method) {
        case "GET":
            if (!permissions.includes("list-files") && !permissions.includes("view-file")) return res.status(403).send("Not allowed to access this resource");

            let files;
            try {
                files = await get(instance.node, `/api/v1/instances/${instance.id}/files?path=${path}`);
            } catch {
                return res.status(500).send("Internal Server Error");
            }

            let sorted;
            try {
                sorted = files.data.list.sort((a, b) => {
                    if (a.type == "directory" && b.type == "file") {
                        return -1
                    } else if (a.type == "file" && b.type == "directory") {
                        return 1
                    } else {
                        if (a.name > b.name) {
                            return -1
                        } else if (b.name > a.name) {
                            return 1
                        } else {
                            return 0
                        }

                    }
                })
            } catch {
                res.headers = {
                    "Content-Type": "text/plain"
                }

                if (!permissions.includes("view-file")) return res.status(403).send("Not allowed to access this resource");

                return res.send(JSON.stringify(files.data))
            }

            if (!permissions.includes("list-files")) return res.status(403).send("Not allowed to access this resource");

            files.data.list = sorted;
            return res.send(files.data)
            break;
        case "POST":
            if (!permissions.includes("create-file")) return res.status(403).send("Not allowed to access this resource");

            try {
                await post(instance.node, `/api/v1/instances/${id}/files?path=${path}`, req.body)
            } catch {
                return res.status(500).send("Internal Server Error")
            }
            return res.status(204).send();
            break;
        case "DELETE":
            if (!permissions.includes("delete-files")) return res.status(403).send("Not allowed to access this resource");

            try {
                await del(instance.node, `/api/v1/instances/${id}/files?path=${path}`);
            } catch {
                return res.status(500).send("Internal Server Error");
            }
            return res.status(204).send();

            break;
        default:
            return res.status(405).send("Method not allowed")
    }

}