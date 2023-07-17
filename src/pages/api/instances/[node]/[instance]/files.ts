import { getNodeClient } from "@/lib/lxd";
import mongo from "@/lib/mongo";
import { validateSession } from "@/lib/oidc";
import { NextApiRequest, NextApiResponse } from "next";
import { Node } from "@/types/db";
import request from "request";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { searchParams } = new URL((req.url as string), "http://test/")
    var valid = await validateSession((req.cookies.access_token as string))
    if (!valid) return res.status(403).send("Unauthorized");
    var path = searchParams.get("path")
    if (!path) return res.status(400).send("Bad Request");

    if (req.method == "GET") {
        var nodes: Node[] = (await (await mongo.db().collection("Node").find({})).toArray() as any)
        var node = nodes.find(n => n.name == req.query.node)
        var r = request(`${node?.url}/1.0/instances/${req.query.instance}/files?path=${path}`, {
            headers: {
                Authorization: `Bearer ${req.cookies.access_token}`,
                "X-LXD-oidc": "true",
            },
            rejectUnauthorized: false
        });

        var { headers }: any = await new Promise((resolve, reject) => {
            r.on('response', response => {
                response.on("data", (c) => {
                    resolve({ headers: response.headers })
                    r.abort()
                })
            }).on("error", err => { });
        })
        res.json({...headers, size: headers["x-lxd-type"] == "file" ? parseInt(headers["content-length"]) : 0})
    }
} 