import express from "express";
import WebSocket from "ws";
import path from "path";
import { readdirSync } from "fs";
import { homedir } from "os";
import axios from "axios";
import { LXDclient as client } from "../../../../lib/lxd.js";
import net from "net";


const router = express.Router({ mergeParams: true });

router.ws("/", async (ws, req) => {
    const { name } = req.params;
    let authorization = req.headers.authorization;
    let permissions = await axios.get(process.env.PANEL_URL + "/api/v1/instances/" + name + "/permissions", {
        headers: {
            Authorization: authorization
        }
    })
    permissions = permissions.data;
    if (!permissions.includes("view-console_instance")) {
        console.log("no perms 1")
        ws.send("You don't have permission to view the console\x85", { binary: true });
        return ws.close();
    }
    const inst = await client.instance(name).data;
    console.log("eee")
    if (inst.metadata.type == "virtual-machine") {
        if (inst.metadata.config["user.console"]) {
            if (inst.metadata.config["user.console"] != "text") {
                vnc()
            } else {
                text()
            }
        } else {
            vnc()
        }
    } else {
        text()
    }
    async function vnc() {
        let prefix = ("590" + inst.metadata.config["raw.qemu"].split("-vnc 127.0.0.1:")[1]).length > 4 ? "" : "0";
        console.log(parseInt(String(59) + prefix + inst.metadata.config["raw.qemu"].split("-vnc 127.0.0.1:")[1]))

        let target = net.createConnection(parseInt(String(59) + prefix + inst.metadata.config["raw.qemu"].split("-vnc 127.0.0.1:")[1]), "127.0.0.1", () => {
            //if connection is refused
            target.on("data", (data) => {
                ws.send(data, { binary: true });
            })
            target.on("end", (data) => {
                ws.close();
            })
            target.on("error", (data) => {
                ws.close();
            })
            ws.on("message", (msg) => {
                if (permissions.includes("control-console_instance")) {
                    target.write(msg);
                }
            })
            ws.on("close", () => {
                console.log("Closed")
                target.end();
            })
        })
    }
    async function text() {
        console.log("text")
        const webs = new WebSocket(`ws+unix://${homedir()}/.lava/console.sock:/${name}`);
        function start() {
            webs.on("message", (e) => {
                ws.send(e, { binary: true });
            })
            ws.on("message", (e) => {
                if (permissions.includes("control-console_instance")) {
                    webs.send(e, { binary: true });
                } else {
                    ws.send("You don't have permission to control the console\x85", { binary: true });
                }
            })
        }
        if (!webs.OPEN) {
            webs.addEventListener("open", () => {
                start();
            })
        } else {
            start();
        }
        ws.on("close", () => {
            webs.close();
        })
    }
})

export default router;