import { LXDclient as client } from "./lxd.js";
import portfinder from "portfinder"

export function listen() {
    console.log("Event Handler Running")
    global.sockets = [];
    let list = client.events();
    list.on("message", async (msg) => {
        async function setVNC(inst) {
            console.log("setting")
            portfinder.setBasePort(5900);
            portfinder.setHighestPort(5999);
            let port = await portfinder.getPortPromise()
            console.log("found", port)
            port = port.toString().replace("59", "")
            let op;
            try {
                op = await client.instance(inst.metadata.name).partialUpdate({
                    "config": {
                        "raw.qemu": "-vnc 127.0.0.1:" + port
                    }
                })
            } catch (error) {
                console.log(error)
            }
            console.log(op)

        }
        if (JSON.parse(msg).metadata.action == "instance-created") {
            console.log(JSON.parse(msg))
            let inst
            try {
                inst = await client.instance(JSON.parse(msg).metadata.source.split("/1.0/instances/")[1]).data;
            } catch (error) {
                console.log(inst)
            }
            console.log(inst)
            if (inst.metadata.type == "virtual-machine") {
                if (inst.metadata.config["user.console"]) {
                    if (!inst.metadata.config["user.console"]) {
                        console.log("set vnc")
                        setVNC(inst)
                    } else {
                        if (inst.metadata.config["user.console"] != "text") setVNC(inst);
                    }
                } else {
                    console.log("set vnc")
                    setVNC(inst)
                }
            }
        }
        if (JSON.parse(msg).metadata.message == "Start finished") {
            const inst = await client.instance(JSON.parse(msg).metadata.context.instance).data;
            if (inst.metadata.status == "Running") {
                let socks;
                if (inst.metadata.config["image.variant"]) {
                    if (inst.metadata.config["image.variant"] == "stateless") {
                        console.log("STATELESS N_VPS")
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
                                socks = await client.instance(JSON.parse(msg).metadata.context.instance).exec(startup, user, wd)
                            } catch (error) {
                                console.log(error);
                            }
                            socks["stdout"].addEventListener("message", async (dat) => {
                                if (dat.data == "") {
                                    let updInst = await client.instance(JSON.parse(msg).metadata.context.instance).data;
                                    if (updInst.metadata.status == "Running") {
                                        await client.instance(JSON.parse(msg).metadata.context.instance).updateState("stop");
                                        socks["stdin"].close();
                                    }
                                }
                            })

                        }
                    }
                }
                if (!socks) {
                    try {
                        socks = await client.instance(JSON.parse(msg).metadata.context.instance).console("console");
                    } catch (error) {
                        console.log(error)
                    }
                }
                console.log("PUSHING")
                global.sockets.push({
                    name: JSON.parse(msg).metadata.context.instance,
                    socket: socks
                });
            }
        }

    })
}