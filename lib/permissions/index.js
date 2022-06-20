import Instance from "./instance";
import { getUserPermissions } from "../getUserPermissions";
import prisma from "../prisma";
import ImageServer from "./imageServer";
import Node from "./node";

export default class Permissions {
    constructor(user) {
        this.user = user;
    }
    node(id) {
        return new Node(this, id);
    }
    imageServer(id) {
        return new ImageServer(this, id);
    }
    instance(id) {
        return new Instance(this, id);
    }
    get permissions() {
        return new Promise(async (resolve, reject) => {
            let permissions = await getUserPermissions(this.user);
            return resolve(permissions);
        })
    }
}