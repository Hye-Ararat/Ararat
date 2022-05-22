import decodeToken from "../../../../../lib/decodeToken";
import prisma from "../../../../../lib/prisma";

export default async function handler(req, res) {
    const { method, query: { id }, body: { firstName, lastName, userName, language } } = req;

    const tokenData = decodeToken(req.headers["authorization"].split(" ")[1]);
    switch (method) {
        case "PATCH":
            let permissions;
            if (!tokenData.permissions.includes("edit-user")) {
                if (tokenData.id == id) {
                    permissions = ["edit-user"];
                }
            } else {
                permissions = tokenData.permissions;
            }
            if (!permissions.includes("edit-user")) return res.status(403).send({
                code: 403,
                error: "not allowed to perform this operation",
                type: "error"
            });
            let data;
            if (firstName) {
                data = {
                    firstName: firstName
                }
            }
            if (lastName) {
                data = {
                    lastName: lastName,
                    ...data
                }
            }
            if (userName) {
                data = {
                    userName: userName,
                    ...data
                }
            }
            if (language) {
                data = {
                    language: language,
                    ...data
                }
            }
            if (!data) return res.status(400).send({
                code: 400,
                error: "bad request: no data to update",
                type: "error"
            });
            const user = await prisma.user.update({
                where: {
                    id: id
                },
                data: data
            })
            return res.status(200).send({
                status_code: 200,
                status: "Success",
                type: "sync",
                metadata: user
            })
        default:
            return res.status(405).send({
                error: "Method not allowed"
            });
    }
}