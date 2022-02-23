import getInstancePermissions from "../../../../../../../../lib/client/getInstancePermissions";
import decodeToken from "../../../../../../../../lib/decodeToken";
import getNodeAccessToken from "../../../../../../../../lib/getNodeAccessToken";
import prisma from "../../../../../../../../lib/prisma";
import axios from "axios";

export default async function handler(req, res) {
    const { query: { id, backup } } = req;
    const tokenData = decodeToken(req.headers["authorization"].split(" ")[1]);

    const backupToDownload = await prisma.instanceBackup.findUnique({
        where: {
            id: backup
        },
        include: {
            instance: {
                select: {
                    users: {
                        select: {
                            id: true,
                            permissions: true,
                            user: {
                                select: {
                                    id: true
                                }
                            }
                        }
                    },
                    node: true
                }
            }
        }
    });
    if (!backupToDownload) return res.status(404).send("Backup not found");

    const permissions = getInstancePermissions(tokenData.id, backupToDownload.instance);

    if (!permissions.includes("download-backup")) return res.status(403).send("Not allowed to access this resource");

    const accessToken = getNodeAccessToken(backupToDownload.instance.node.accessTokenIV, backupToDownload.instance.node.accessToken);

    let download;
    try {
        download = await axios({
            url: `${backupToDownload.instance.node.ssl ? "https://" : "http://"}${backupToDownload.instance.node.hostname}:${backupToDownload.instance.node.port}/api/v1/instances/${id}/backups/${backup}`, responseType: "stream", method: "get", headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
    } catch {
        return res.status(500).send("Internal Server Error");
    }

    res.writeHead(200, {
        "Content-Type": "application/octet-stream",
        "Content-Disposition": `attachment; filename="${backupToDownload.name}.tar.gz"`,
    });

    return download.data.pipe(res);
}