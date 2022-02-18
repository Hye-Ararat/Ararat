import prisma from "../../../../../../../../lib/prisma";

export default async function handler(req, res) {
    const { query: { backup } } = req;
    if (!req.headers.authorization.includes("::")) return res.status(403).send("Not allowed to access this resource")
    const updatedBackup = await prisma.instanceBackup.update({
        where: {
            id: backup
        },
        data: {
            pending: false
        }
    })
    return res.status(200).send(updatedBackup);

}