import { getUserPermissions } from "../getUserPermissions";
import prisma from "../prisma";
import Node from "./node";

export default class Permissions {
    constructor(user) {
        this.user = user;
    }
    node(id) {
        return new Node(this, id);
    }
    get permissions() {
        return new Promise(async (resolve, reject) => {
            let permissions = await getUserPermissions(this.user);
            return resolve(permissions);
        })
    }
}