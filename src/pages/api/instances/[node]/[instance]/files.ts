import { getNodeClient } from "@/lib/lxd";
import { validateSession } from "@/lib/oidc";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { searchParams } = new URL((req.url as string), "http://test/")
    var valid = await validateSession((req.cookies.access_token as string))
    if (!valid) return res.status(403).send("Unauthorized");
    var node = await getNodeClient((req.query.node as string), (req.cookies.access_token as string))
    var path = searchParams.get("path")
    if (!path) return res.status(400).send("Bad Request");

    if (req.method == "GET") {
        const controller = new AbortController();
        var size = await node.get(`/instances/${(req.query.instance as string)}/files?path=${path}`, {
            "responseType": "stream",
            signal: controller.signal
        })
        controller.abort()
        res.json({...size.headers, size: size.headers["x-lxd-type"] == "file" ? parseInt(size.headers["content-length"]) : 0})
    }
} 