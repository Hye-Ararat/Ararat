import decodeToken from "../../../../../../../lib/decodeToken";
import prisma from "../../../../../../../lib/prisma";


export default async function handler(req, res) {
    const permissions = decodeToken(req.headers["authorization"].split(" ")[1]).permissions
    if (!permissions.includes("create-image")) return res.status(403).send("Not allowed to access this resource")

    let image;
    try {
        image = await prisma.image.create({
            data: {
                name: req.body.name,
                stateless: req.body.stateless,
                amd64: req.body.amd64,
                arm64: req.body.arm64,
                entrypoint: req.body.entrypoint ? req.body.entrypoint : null,
                type: req.body.type,
                imageServer: {
                    connect: {
                        id: req.body.imageServer
                    }
                },
                magmaCube: {
                    connect: {
                        id: req.query.id
                    }
                },
                console: req.body.console
            },
        });
    } catch (error) {
        return res.status(500).send(error);
    }

    return res.status(200).send(image);
}