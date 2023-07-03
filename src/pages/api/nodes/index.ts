import prisma from "@/lib/prisma";

export default async function handler(req, res) {
    let body = req.body;
    const newNode = await prisma.node.create({
        data: {
            name: body.name,
            url: `https://${body.domain}:8443`
        }
    })
    res.status(200).json(newNode)
} 