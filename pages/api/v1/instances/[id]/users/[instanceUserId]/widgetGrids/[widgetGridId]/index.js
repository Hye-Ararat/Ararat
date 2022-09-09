import decodeToken from "../../../../../../../../../lib/decodeToken";
import Permissions from "../../../../../../../../../lib/permissions/index.js";
import prisma from "../../../../../../../../../lib/prisma.js";

export default async function handler(req, res) {
    const { query: { id, instanceUserId, widgetGridId }, method } = req;
    const tokenData = decodeToken(req.headers["authorization"].split(" ")[1]);
    if (method == "DELETE") {
        let permissions = new Permissions(tokenData.id).instance(id).instanceUser(instanceUserId);
        if (await permissions.editWidgetLayout) {
            await prisma.instanceUserWidgetGrid.delete({
                where: {
                    id: widgetGridId
                }
            })
            res.status(200).json({ message: "success" })
        } else {
            res.status(403).json({ message: "Not authorized" })
        }
    }
    else {
        res.status(405).json({ message: "Method not allowed" })
    }
}