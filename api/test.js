import { spawn } from 'child_process';
import { readFileSync } from 'fs';
import hyexd from "hyexd";
import WebSocket from "ws";
import axios from "axios";
process.title = "Hye Lava Tester";
console.log("Starting Tester")

let e = spawn("node", ["app.js"], { stdio: "inherit" });
/**
 * 
 * @type {hyexd}
 */
let lxdClient = new hyexd.default("https://127.0.0.1:8443", {
    certificate: readFileSync("./client.crt").toString("ascii"),
    key: readFileSync("./client.key").toString("ascii"),
})
setTimeout(async () => {
    console.log("----------")
    console.log("CREATING TEST INSTANCE");
    let createOperation;
    try {
        createOperation = await lxdClient.createInstance("hyeTest", "container", {
            "config": {
                "limits.cpu": "1",
                "limits.memory": "1GB"
            },
            "devices": {
                "root": {
                    "path": "/",
                    "pool": "default",
                    "size": "5GB",
                    "type": "disk"
                },
                "eth0": {
                    "type": "nic",
                    "network": "lxdbr0"
                },
            },
            "source": {
                "alias": "ubuntu/focal",
                "mode": "pull",
                "protocol": "simplestreams",
                "server": "https://images.linuxcontainers.org",
                "type": "image"
            }
        })
    } catch (error) {
        console.log(error);
        e.kill();
        process.exit(0);
    }
    let waitDone = (operationId) => {
        return new Promise((resolve, reject) => {
            let interval = setInterval(async () => {
                let operationData;
                try {
                    operationData = await lxdClient.operation(operationId).data;

                } catch (error) {
                    clearInterval(interval);
                    return resolve()
                }
                if (operationData.metadata.Status === "Success") {
                    clearInterval(interval);
                    resolve();
                }
            }, 100);
        })
    }
    await waitDone(createOperation.metadata.id);
    console.log("TEST INSTANCE CREATED")
    console.log("OPENING CONSOLE SOCKET")
    const consoleSock = new WebSocket("ws://localhost:3001/v1/instances/hyeTest/console");
    consoleSock.on("open", () => {
        console.log("CONSOLE SOCKET OPENED")
    });
    consoleSock.on("data", (data) => {
        console.log("[TEST INSTANCE CONSOLE]", data.toString());
    });
    console.log("GETTING LIST OF FILES");
    let files = await axios.get("http://localhost:3001/v1/instances/hyeTest/files?path=/");
    console.log("FILES", files.data);
    console.log("STARTING TEST INSTANCE");
    let startOperation;
    try {
        startOperation = await lxdClient.instance("hyeTest").updateState("start");
    }
    catch (error) {
        console.log(error);
        e.kill();
        process.exit(0);
    }
    await waitDone(startOperation.metadata.id);
    console.log("TEST INSTANCE STARTED");
    console.log("STOPPING TEST INSTANCE");
    let stopOperation;
    try {
        stopOperation = await lxdClient.instance("hyeTest").updateState("stop");
    }
    catch (error) {
        console.log(error);
        e.kill();
        process.exit(0);
    }
    await waitDone(stopOperation.metadata.id);
    console.log("TEST INSTANCE STOPPED");
    console.log("All Tests Completed Successfully without hanging");
    e.kill();
    process.exit(0);

}, [1000])