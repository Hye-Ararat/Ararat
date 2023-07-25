import { Document } from "mongodb"

export interface User extends Document {
    email: string,
    password: string,
    firstName: string,
    lastName: string
}
export interface Node extends Document {
    name: string
    url: string
}

export interface ImageServer extends Document {
    name: string
    url: string
}