export default class User {
    constructor(user) {
        this.user = user;
    }

    get data() {
        return new Promise(async (resolve, reject) => {
            const userData = await prisma.user.findUnique({
                where: {
                    id: this.user.user
                },
                include: {
                    permissions: true
                }
            });
            return resolve(userData);
        })
    }

    get permissions() {
        return new Promise(async (resolve, reject) => {
            let user = await this.data;
            if (!user.permissions) {
                return resolve([]);
            }
            let perms = convertPermissionsToArray(user.permissions);
            return resolve(perms);
        })
    }

    get editUser() {
        return new Promise(async (resolve, reject) => {
            if ((await this.user.permissions).includes("edit-users_user")) {
                return resolve(true);
            }
            return resolve(false)
        })
    }
}