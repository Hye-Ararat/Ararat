import { WithId, Document } from "mongodb";

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
        "_id": doc._id
    }
}