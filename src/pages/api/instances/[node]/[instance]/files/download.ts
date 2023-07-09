import { getNodeClient } from "@/lib/lxd";
import { validateSession } from "@/lib/oidc";
import { NextApiRequest, NextApiResponse } from "next";
import { Readable } from "stream";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { searchParams } = new URL((req.url as string), "http://test/")
    var valid = await validateSession((req.cookies.access_token as string))
    if (!valid) return res.status(403).send("Unauthorized");
    var node = await getNodeClient((req.query.node as string), (req.cookies.access_token as string))
    var path = searchParams.get("path")
    if (!path) return res.status(400).send("Bad Request");

    if (req.method == "GET") {
        try {
            var result = await node.get<Readable>(`/instances/${(req.query.instance as string)}/files?path=${path}`, {
                "responseType": "stream"
            })
            res.setHeader("content-disposition", `attachment; filename="${path.split("/")[path.split("/").length - 1]}"`);
            res.setHeader("content-length", (result.headers["content-length"] as string))
            result.data.pipe(res)
        } catch (error) {
            return res.status(501).send("Internal server error");
        }
    }
} 