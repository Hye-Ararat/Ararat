import convertPermissionsToArray from "../convertPermissionsToArray";
import prisma from "../prisma.js";

export default class Instance {
    constructor(user, instanceId) {
        this.instanceId = instanceId;
        this.user = user;
    }
    get data() {
        return new Promise(async (resolve, reject) => {
            const instanceData = await prisma.instance.findUnique({
                where: {
                    id: this.instanceId
                },
                include: {
                    users: {
                        where: {
                            userId: this.user.user,
                        },
                        include: {
                            permissions: true
                        }
                    }
                }
            });
            return resolve(instanceData);
        })
    }
    get permissions() {
        return new Promise(async (resolve, reject) => {
            let instance = await this.data;
            if (!instance.users[0]) {
                return resolve([]);
            }
            let perms = convertPermissionsToArray(instance.users[0].permissions);
            return resolve(perms);
        })
    }

    get listUsers() {
        return new Promise(async (resolve, reject) => {
            if ((await this.user.permissions).includes("list-users_instance")) {
                return resolve(true);
            }
            if ((await this.permissions).includes("list-users_instance")) {
                return resolve(true)
            }
            return resolve(false);
        })
    }
    get readFiles() {
        return new Promise(async (resolve, reject) => {
            if ((await this.user.permissions).includes("read-files_instance")) {
                return resolve(true);
            }
            if ((await this.permissions).includes("read-files_instance")) {
                return resolve(true)
            }
            return resolve(false);
        })
    }
    get writeFiles() {
        return new Promise(async (resolve, reject) => {
            if ((await this.user.permissions).includes("write-files_instance")) {
                return resolve(true);
            }
            if ((await this.permissions).includes("write-files_instance")) {
                return resolve(true)
            }
            return resolve(false);
        })
    }
    get deleteFiles() {
        return new Promise(async (resolve, reject) => {
            if ((await this.user.permissions).includes("delete-files_instance")) {
                return resolve(true);
            }
            if ((await this.permissions).includes("delete-files_instance")) {
                return resolve(true)
            }
            return resolve(false);
        })
    }
}