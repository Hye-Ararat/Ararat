import { NodeLxdInstance } from "@/types/instance";
import { connectOIDC } from "incus";
import mongo from "./mongo";
import { Node } from "@/types/db";
import { AxiosInstance } from "axios"
import ws from "ws"
export function fetchInstance(name: string, node_name: string, access_token: string): Promise<NodeLxdInstance | undefined> {
    return new Promise(async (resolve, reject) => {
        try {
            var nodes: Node[] = (await (await mongo.db().collection("Node").find({})).toArray() as any)
            var node = nodes.find(n => n.name == node_name || n._id == node_name)
            if (!node) return reject(new Error("No such node found: " + node));
            let client = connectOIDC(node.url, access_token)
            var instance = (await client.get(`/instances/${name}?recursion=1`)).data.metadata
            delete node._id;
            resolve({ ...instance, node: node })
        } catch (error) {
            reject(error)
        }
    })
}

export function fetchAllInstances(access_token: string): Promise<NodeLxdInstance[]> {
    return new Promise(async (resolve, reject) => {
        try {
            var nodes: Node[] = (await (await mongo.db().collection("Node").find({})).toArray() as any)
            var instancesPromise: Promise<NodeLxdInstance[]>[] = nodes.map(async (node) => {
                let client = connectOIDC(node.url, access_token)
                let instances: NodeLxdInstance[] = []
                try {
                    instances = (await client.get("/instances?recursion=2")).data.metadata
                } catch (error) {
                    instances = []
                }
                delete node._id;
                return instances.map((instance) => { return { ...instance, node: node } })
            })
            resolve((await Promise.all(instancesPromise)).flat(1))
        } catch (error) {
            reject(error)
        }
    })
}

export function getNodeClient(node_name: string, access_token: string): Promise<AxiosInstance & {
    ws: (url: string) => ws.WebSocket;
}> {
    return new Promise(async (resolve, reject) => {
        try {
            var nodes: Node[] = (await (await mongo.db().collection("Node").find({})).toArray() as any)
            var node = nodes.find(n => n.name == node_name)
            if (!node) return reject(new Error("No such node found: " + node_name));
            let client = connectOIDC(node.url, access_token)
            resolve(client)
        } catch (error) {
            reject(error)
        }

    })
}