import axios from "axios";
import prisma from "../../../../../../lib/prisma";
import Client from "hyexd";
import getNodeEnc from "../../../../../../lib/getNodeEnc";

export default async function handler(req, res) {
    let { query: { id, path }, method } = req;
    const instance = await prisma.instance.findUnique({
        where: {
            id: id
        },
        include: {
            node: true
        }
    })
    const lxd = new Client("https://" + instance.node.address + ":" + instance.node.lxdPort, {
        certificate: Buffer.from(Buffer(getNodeEnc(instance.node.encIV, instance.node.certificate)).toString(), "base64").toString("ascii"),
        key: Buffer.from(Buffer(getNodeEnc(instance.node.encIV, instance.node.key)).toString(), "base64").toString("ascii")
    });
    switch (method) {
        case "GET":
            console.log(path, "THE PATH")
            let files;
            try {
                files = await axios.get(`http://${instance.node.address}:${instance.node.port}/v1/instances/${instance.id}/files?path=${path}`);
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
            const cOp = await lxd.instance(instance.id).file(path).create(req.body);
            return res.status(200).send(cOp)
        case "DELETE":
            const delOp = await lxd.instance(instance.id).file(path).delete();
            return res.status(200).send(delOp)
        default:
            console.log(operation)
    }
}