import axios from "axios"
import { errorResponse, standardResponse } from "../../../../../lib/responses"
import prisma from "../../../../../lib/prisma"

export default async function handler(req, res) {
    let node = await prisma.node.findUnique({
        where: {
            id: req.query.id
        }
    })
    if (!node) return res.status(404).send(errorResponse("Node does not exist", 404))
    let sysinfo = await axios.get((node.ssl ? "https://" : "http://") + node.address + ":" + node.port + "/v1/system")
    if (sysinfo.data.arch == "x64") sysinfo.data.arch = "amd64";
    return res.status(200).send(standardResponse(200, sysinfo.data, 200))
}