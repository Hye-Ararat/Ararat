import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../lib/prisma";
import { standardResponse } from "../../../../lib/responses";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    console.log(req.body)
    let {url, name} = req.body;
    if (req.method == "POST") {
        let data = await prisma.imageServer.create({
            data: {
                name,
                url
            }
        })
        res.status(200).send(standardResponse(200, 200, data))
    }
}