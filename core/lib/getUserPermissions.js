import prisma from "./prisma";

export function getUserPermissions(userId) {
    return new Promise(async (resolve, reject) => {
        let user = await prisma.user.findUnique({
            where: {
                id: userId,
            },
            include: {
                permissions: true
            }
        })
        let permissions = [];
        user.permissions.forEach(permission => {
            permissions.push(permission.permission);
        })
        resolve(permissions)
    })
}