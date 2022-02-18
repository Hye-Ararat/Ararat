import decodeToken from "../../../../../lib/decodeToken";
import prisma from "../../../../../lib/prisma";


export default async function handler(req, res) {
    const permissions = decodeToken(req.headers["authorization"].split(" ")[1]).permissions;
    if (!permissions.includes("create-magmaCube")) return res.status(403).send("Not allowed to access this resource");
    const cube = await prisma.magmaCube.create({
        data: {
            name: req.body.name
        }
    })
    return res.status(200).send(cube);
}