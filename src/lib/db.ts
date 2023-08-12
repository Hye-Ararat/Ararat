import { ImageServer, Node } from "@/types/db";
import { WithId, Document } from "mongodb";
import mongo from "./mongo";

export function sanitizeMany(documents: WithId<Document>[]) {
    return documents.map((doc) => {
        return {
            ...doc,
            "_id": doc._id.toString()
        }
    })
}
export function sanitizeOne(doc: WithId<Document>) {
    return {
        ...doc,
        "_id": doc._id.toString()
    }
}

export async function getNodes(): Promise<Node[]> {
    const nodes = (await (mongo.db().collection("Node").find({})).toArray() as any);
    return (sanitizeMany((nodes as any)) as any);
}

export async function getImageServers(): Promise<ImageServer[]> {
    const imageServers = (await (mongo.db().collection("ImageServer").find({})).toArray() as any);
    return (sanitizeMany((imageServers as any)) as any);
}