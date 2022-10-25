import { verify } from "jsonwebtoken";
import decodeToken from "../../../../../lib/decodeToken";
import prisma from "../../../../../lib/prisma";

export default async function handler(req, res) {
    let authorization = req.headers.authorization;
    let token = authorization.split(" ")[1];
    let valid = verify(token, process.env.ENC_KEY);
    let tokenData = decodeToken(token);
    let permissions = await prisma.permission.findMany({
        where: {
            userId: tokenData.id,
        }
    })
    let perms = [];
    permissions.forEach((permission) => {
        if (permission.permission.includes("_instance")) {
            perms.push(permission.permission);
        }
    })
    let nodeUser = await prisma.nodeUser.findMany({
        where: {
            userId: tokenData.id,
        },
        select: {
            permissions: true,
        }
    })
    nodeUser.forEach((nodeUser) => {
        nodeUser.permissions.forEach((permission) => {
            if (permission.permission.includes("_instance")) {
                perms.push(permission.permission);
            }
        })
    })
    let instanceUser = await prisma.instanceUser.findFirst({
        where: {
            userId: tokenData.id,
            instanceId: req.query.id,
        },
        include: {
            permissions: true
        }
    })
    instanceUser.permissions.forEach((permission) => {
        perms.push(permission.permission);
    })
    perms = perms.filter((item, index) => {
        return perms.indexOf(item) === index;
    })
    res.json(perms);
}