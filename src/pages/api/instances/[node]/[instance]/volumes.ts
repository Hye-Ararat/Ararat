import { getNodeClient } from "@/lib/lxd";
import mongo from "@/lib/mongo";
import { validateSession } from "@/lib/oidc";
import { NextApiRequest, NextApiResponse } from "next";
import { Node } from "@/types/db";
import request from "request";
import { connectOIDC } from "js-lxd";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { searchParams } = new URL((req.url as string), "http://test/")
    var valid = await validateSession((req.cookies.access_token as string))
    if (!valid) return res.status(403).send("Unauthorized");
    var nodes: Node[] = (await (await mongo.db().collection("Node").find({})).toArray() as any)
    var node = nodes.find(n => n.name == req.query.node)
    var client = connectOIDC((node?.url as string), (req.cookies.access_token as string))

    if (req.method == "GET") {
        var instanceDevices = (await client.get(`/instances/${req.query.instance}?recursion=1`)).data.metadata.expanded_devices;
        var storageDevices = Object.keys(instanceDevices).filter((s) => instanceDevices[s].type == "disk").map(f => {return{...instanceDevices[f], key: f}})
        var usedPools = storageDevices.map((f) => f.pool).filter((element, index) => {
            return storageDevices.map((f) => f.pool).indexOf(element) === index;
        })
        var usedVolumes = await Promise.all(usedPools.map(async poolName => {
            var poolVolumes = (await client.get(`/storage-pools/${poolName}/volumes?recursion=1`)).data.metadata;
            poolVolumes = poolVolumes.filter((f: any) => f.used_by.includes(`/1.0/instances/${req.query.instance}`))
            var result = await Promise.all(poolVolumes.map(async (vol: any) => {
                var status = (await client.get(`/storage-pools/${poolName}/volumes/${vol.type}/${vol.name}/state`)).data.metadata; 
                return {
                    ...vol,
                    status,
                    key: (Object.keys(instanceDevices).find((s) => instanceDevices[s].source == vol.name && instanceDevices[s].type == "disk") as string) ?? "root",
                    device: vol.type == "container" ? instanceDevices["root"] : instanceDevices[(Object.keys(instanceDevices).find((s) => instanceDevices[s].source == vol.name && instanceDevices[s].type == "disk") as string)]
                }
            }))
            return result;
        }))
        res.json(usedVolumes.flat(1))
    }
} 