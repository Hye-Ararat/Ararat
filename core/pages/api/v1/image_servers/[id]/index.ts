import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../../lib/prisma";
import { standardResponse } from "../../../../../lib/responses";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method == "DELETE") {
        let data = await prisma.imageServer.delete({
            where: {
                id: req.query.id as string
            }
        })
        res.status(200).send(standardResponse(200, 200, data))
    }
}