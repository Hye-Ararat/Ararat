import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    let body = req.body;
    const newNode = await prisma.node.create({
        data: {
            name: body.name,
            url: `https://${body.domain}:8443`
        }
    })
    res.status(200).json(newNode)
} 