import { getNodes } from "@/lib/db";
import mongo from "@/lib/mongo";
import { connectOIDC } from "incus";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method == "GET") {
        var node = (await getNodes()).find(no => no.name == req.query.node)
        var client = connectOIDC((node?.url as string), (req.cookies.access_token as string))
        var storagePools: string[] = (await client.get(`/storage-pools`)).data.metadata
        var volumes = await Promise.all(storagePools.map(async (pool) => {
            var poolURL = pool.replace("/1.0", "")
            var poolVolumes = await client.get(`${poolURL}/volumes?recursion=1`)
            return poolVolumes.data.metadata.map((s: any) => { return { ...s, pool: poolURL.replace("/storage-pools/", "") } })
        }))
        res.json(volumes.flat(1))
    }
} 