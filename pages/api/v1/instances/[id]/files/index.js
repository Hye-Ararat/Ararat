import axios from "axios";
import prisma from "../../../../../../lib/prisma";
import Client from "hyexd";
import getNodeEnc from "../../../../../../lib/getNodeEnc";
import decodeToken from "../../../../../../lib/decodeToken";
import Permissions from "../../../../../../lib/permissions/index.js";
import { errorResponse } from "../../../../../../lib/responses";

export default async function handler(req, res) {
    let { query: { id, path }, method } = req;
    const tokenData = decodeToken(req.headers["authorization"].split(" ")[1]);
    let perms = new Permissions(tokenData.id).instance(id);
    const instance = await prisma.instance.findUnique({
        where: {
            id: id
        },
        include: {
            node: true
        }
    })
    const lxd = new Client("unix:///var/snap/lxd/common/lxd/unix.socket", null);
    switch (method) {
        case "GET":
            if (!(await perms.readFiles)) return res.status(403).send(errorResponse("You are not allowed to read files on this instance", 403));
            let files;
            try {
                files = await axios.get(`http://localhost:3001/api/v1/instances/${instance.id}/files?path=${path}`, {
                    headers: {
                        "Authorization": req.headers["authorization"]
                    }
                });
            } catch (error) {
                console.log(error)
            }
            res.setHeader("type", files.headers.type)
            return res.status(200).send({
                type: "sync",
                status: "Success",
                status_code: 200,
                operation: "",
                error_code: 0,
                error: "",
                additional: {
                    type: files.headers.type
                },
                metadata: files.data
            })
        case "POST":
            if (!(await perms.writeFiles)) return res.status(403).send(errorResponse("You are not allowed to write files on this instance", 403));
            const cOp = await lxd.instance(instance.id).file(path).create(req.body);
            return res.status(200).send(cOp)
        case "DELETE":
            if (!(await perms.deleteFiles)) return res.status(403).send(errorResponse("You are not allowed to delete files on this instance", 403));
            const delOp = await lxd.instance(instance.id).file(path).delete();
            return res.status(200).send(delOp)
        default:
            console.log(operation)
    }
}