import { NextApiRequest, NextApiResponse } from "next";
import {readFileSync, writeFileSync} from "fs";
import {execSync} from "child_process";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const {joinList} = req.body;
    let cockroachDbSystemd = readFileSync("/etc/systemd/system/cockroachdb.service", "utf8");
    let oldJoinString = cockroachDbSystemd.split("--join=")[1].split(" --http-addr=")[0];

    let newJoinString = "";

    joinList.forEach((address, index) => {
        newJoinString += `${address}${index != joinList.length - 1 ? "," : ""}`;
    })
    let newConf = cockroachDbSystemd.replace(oldJoinString, newJoinString);
    writeFileSync("/etc/systemd/system/cockroachdb.service", newConf);
    execSync("systemctl daemon-reload");
    execSync("systemctl stop cockroachdb");
    execSync("systemctl start cockroachdb");

}