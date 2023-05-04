import decodeToken from "../../../../../lib/decodeToken";
import Permissions from "../../../../../lib/permissions/index.js";
import prisma from "../../../../../lib/prisma";
import { errorResponse, standardResponse } from "../../../../../lib/responses";


export default async function handler(req, res) {
    const tokenData = decodeToken(req.headers["authorization"].split(" ")[1]);
    const { method, query: { id } } = req;
    const permissions = new Permissions(tokenData.id).usr(id)
    switch (method) {
        case "PATCH": {
            console.log(permissions)
            if (!(await permissions.editUser)) return res.status(403).send(errorResponse("You are not allowed to edit users", 403));
            await prisma.permission.deleteMany({
                where: {
                    userId: id
                }
            })
            let objects = [];
            for (let i = 0; i < req.body.permissions.length; i++) {
                objects.push({
                    userId: id,
                    permission: req.body.permissions[i]
                })
            }
            console.log(objects)
            await prisma.permission.createMany({
                data: objects
            })
            return res.status(200).send(standardResponse("Success", 200));
        }

    }
}