import express from "express";
import cors from "cors";
import { existsSync, rmSync } from "fs";
import { LXDclient as client } from "./lib/lxd.js";
import { add, get, remove } from "./lib/console.js";
import { homedir } from "os";

export default async () => {
    const app = express();
    (await import("express-ws")).default(app);
    app.use(cors());
    app.ws("/:name", async (ws, req) => {
        const name = req.params.name;
        let logs;
        const inst = await client.instance(name).data;
        try {
            if (inst.metadata.config["image.variant"] != "stateless") {
                logs = await client.instance(name).consoleLog();
                ws.send(logs);
            }
        } catch (error) {

        }
        if (get(name) && inst.metadata.status != "Running") {
            remove(name);
        }
        if (!get(name)) {
            let socks;
            if (inst.metadata.status == "Running") {
                if (inst.metadata.config["image.variant"]) {
                    if (inst.metadata.config["image.variant"] == "stateless") {
                        if (inst.metadata.config["user.startup"]) {
                            let user;
                            let wd;
                            if (inst.metadata.config["user.user"]) user = parseInt(inst.metadata.config["user.user"]);
                            if (inst.metadata.config["user.working_dir"]) wd = inst.metadata.config["user.working_dir"];
                            let environment = {}
                            Object.keys(inst.metadata.config).forEach((key) => {
                                if (key.startsWith("environment.")) {
                                    environment[key.replace("environment.", "")] = inst.metadata.config[key];
                                }
                            })
                            let startup = inst.metadata.config["user.startup"].split(" ");
                            startup = startup.map((arg) => {
                                if (arg.startsWith("$")) {
                                    return environment[arg.replace("$", "")];
                                } else {
                                    return arg;
                                }
                            })
                            try {
                                socks = await client.instance(name).exec(startup, user, wd)
                            } catch (error) {
                                console.log(error);
                            }
                            socks["stdout"].addEventListener("message", async (dat) => {
                                if (dat.data == "") {
                                    let updInst = await client.instance(name).data;
                                    if (updInst.metadata.status == "Running") {
                                        await client.instance(name).updateState("stop");
                                        socks["stdin"].close();
                                    }
                                }
                            })

                        }
                    }
                }
                if (!socks) {
                    try {
                        socks = await client.instance(name).console("console");
                    } catch (error) {
                        console.log(error)
                    }
                }
                add(name, socks.stdin, socks.stdout);
                ready();
            } else {
                const interval = setInterval(() => {
                    if (get(name)) {
                        ready();
                        clearInterval(interval);
                    }
                }, 100);
                ws.on("close", () => {
                    clearInterval(interval);
                })
            }
        } else {
            ready();
        }
        function startStdout() {
            get(name).socket.stdout.on("message", (event) => {
                if (event == "") {
                    get(name).socket.stdout.close();
                    return;
                }
                ws.send(event, { binary: true });
            });
            get(name).socket.stdout.on("close", () => {
                ws.onmessage = () => { };
                remove(name);
                const interval = setInterval(() => {
                    if (get(name)) {
                        ready();
                        clearInterval(interval);
                    }
                }, 100)
                ws.on("close", () => {
                    clearInterval(interval);
                })
            })
        }
        function startStdin() {
            ws.onmessage = (e) => {
                get(name).socket.stdout.send(e.data, { binary: true });
            }
        }
        function ready() {
            if (get(name)) {
                if (get(name).socket) {
                    if (get(name).socket.stdout) {
                        if (!get(name).socket.stdout.OPEN) {
                            get(name).socket.stdout.on("open", () => {
                                startStdout();
                            })
                            get(name).socket.stdin.on("open", () => {
                                startStdin();
                            })
                        } else {
                            startStdout();
                            startStdin();
                        }
                    }
                }
            }
        }

    })
    if (existsSync(homedir() + "/.lava/console.sock")) {
        rmSync(homedir() + "/.lava/console.sock");
    }
    app.listen(homedir() + "/.lava/console.sock", () => {
        console.log("Console server running ✅");
    });
}
