import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import {execSync} from "child_process";
import { standardResponse } from "../../../../lib/responses";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const {name, certificate} = req.body;
    let token = execSync(`lxd.lxc cluster add ${name}`)
    const requestClient = new axios.Axios({
        socketPath: "/var/snap/lxd/common/lxd/unix.socket",
        headers: {
            "Content-Type": "application/json",
        }
    })
    let data = await requestClient.get("/1.0");
    let config = JSON.parse(data.data)
    let certPost = await requestClient.post("/1.0/certificates", JSON.stringify({
        "name": name,
        "type": "server",
        "restricted": false,
        "certificate": certificate,
        "password": token.toString().split("\n")[1],
        "token": false
    }))
    res.status(200).send(standardResponse(200, 200, {"joinToken": token.toString().split("\n")[1], "config": config.metadata}))


}