import crypto from "crypto";
import decodeToken from "../../../../lib/decodeToken";
import Permissions from "../../../../lib/permissions/index.js";
import prisma from "../../../../lib/prisma";

export default async function handler(req, res) {
    const { method } = req;

    const tokenData = decodeToken(req.headers["authorization"].split(" ")[1]);
    switch (method) {
        case "POST":
            const permissions = new Permissions(tokenData.id)
            if (!await permissions.createNode) return res.status(403).send({
                "code": 403,
                "error": "not allowed to perform this operation",
                "type": "error"
            })

            const { name, port, lxdPort, sftpPort, certificate, address, key } = req.body;
            const iv = crypto.randomBytes(16);
            const cipherCert = crypto.createCipheriv("aes-256-ctr", process.env.ENC_KEY, iv);
            const cipherKey = crypto.createCipheriv("aes-256-ctr", process.env.ENC_KEY, iv);
            const certEnc = Buffer.concat([cipherCert.update(certificate), cipherCert.final()]);
            const keyEnc = Buffer.concat([cipherKey.update(key), cipherKey.final()]);
            const node = await prisma.node.create({
                data: {
                    name: name,
                    address: address,
                    encIV: iv.toString("hex"),
                    certificate: certEnc.toString("hex"),
                    key: keyEnc.toString("hex"),
                    port: port.toString(),
                    lxdPort: lxdPort.toString(),
                    sftpPort: sftpPort.toString()
                }
            })

            return res.status(201).json({
                status: "success",
                status_code: 201,
                type: "sync",
                metadata: node
            })
        case "GET":
            if (!tokenData.permissions.includes("list-nodes")) {
                return res.status(403).send({
                    "code": 403,
                    "error": "not allowed to perform this operation",
                    "type": "error"
                })
            }
            const nodes = await prisma.node.findMany({});
            return res.status(200).json({
                status: "success",
                status_code: 200,
                type: "sync",
                metadata: nodes
            })
    }
}