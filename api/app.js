dotenv.config();
import { exec, execSync, spawn } from "child_process";
import cluster from "cluster";
import net from "net";
import dotenv from "dotenv";
import chalk from "chalk";
import { appendFileSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "fs";
import tcpProxy from "node-tcp-proxy";
import udpProxy from "udp-proxy";
import { totalmem, cpus, homedir } from "os";

let updating = false;
process.title = "Hye Lava";
let ip;
if (cluster.isPrimary) {
    if (!existsSync(homedir() + "/.lava")) {
        mkdirSync(homedir() + "/.lava");
    }
    if (process.platform == "darwin") {
        console.log("Starting  N-VPS Service...");
        let vmproc = exec(`cd ./macOS && ./Hye_N-VPS_macOS -k vmlinuz -i initrd -d image.img -p ${cpus().length} -m ${(totalmem() / (1024 * 1024)) - 2048} -a "console=hvc0 root=/dev/vda"`);
        vmproc.stderr.on("data", data => {
            if (data.toString().includes("Waiting for connection to")) {
                let conn = data.toString().split(" ");
                conn = conn[conn.length - 1].replace(/\n/g, "");
                let vmscreen = exec("script /dev/null", { cwd: "./macOS", detached: true });
                vmscreen.stdin.write("screen " + conn + "\n");
                let run = false;
                let runProc = false;
                vmscreen.stdout.on("data", (data) => {
                    if (!runProc) {
                        runProc = true;
                        setTimeout(() => {
                            let id = execSync(`ps -ax | grep "com.apple.Virtualization.VirtualMachine"`);
                            let procid = id.toString().split("\n")[0].split(" ")[0];
                            execSync(`lsappinfo setinfo ${procid} --name "Hye Lava N-VPS Service"`);

                        }, 2000)
                    }
                    if (data.toString().includes("LTS ubuntu hvc0") && !run) {
                        run = true;
                        process.on("SIGINT", () => {
                            vmscreen.stdin.write("shutdown now\n");
                            console.log("\nShutting down...");
                            vmscreen.stdout.on("data", (data) => {
                                if (data.toString().includes("[screen is terminating]")) {
                                    console.log("Service stopped.");
                                    process.exit(0);
                                }
                            })
                            setTimeout(() => {
                                console.log("Service shutdown timed out. Forcefully shutting down...");
                                process.exit(0);
                            }, 120000);
                        });
                        console.log("Getting service information...");
                        vmscreen.stdin.write("root\n");
                        setTimeout(() => {
                            vmscreen.stdin.write("root\n");
                            setTimeout(() => {
                                vmscreen.stdin.write(`echo "Addr:" $(hostname -i)\n`);
                            }, 1000);
                        }, 500)
                    }
                    if (data.toString().includes("Addr:") && !data.toString().includes("echo") && !ip) {
                        ip = data.toString().split(" ").filter((e) => e.startsWith("192"))[0]
                        process.env.LXD = "https://" + ip + ":8443";
                        //replace line
                        let file = readFileSync("./.env", "utf8");
                        file = file.replace(/LXD=.*/g, `LXD=https://${ip}:8443`);
                        writeFileSync("./.env", file, "utf8");
                        console.log(`N-VPS service is online at ${chalk.green(ip)}`);
                        start();
                    }

                });
            }
        });
        vmproc.on("exit", () => {
            console.log(" N-VPS service exited");
            process.exit(0);
        })

    } else {
        start()
    }
    function start() {
        if (process.platform == "darwin") {
            console.log("Setting up link to  N-VPS service...");
            tcpProxy.createProxy(8443, ip, 8443);
            udpProxy.createServer({
                address: ip,
                port: 8443,
                localport: 8443,
                localaddress: "127.0.0.1"
            });
            console.log("Link Established ✅");
        }
        const hpProc = spawn("./Hye_Lava");
        hpProc.on("exit", () => {
            spawn("./Hye_Lava");
        })
        import("./console.js").then((e) => {
            e.default();
            console.log("Console server starting...")
        })
        if (existsSync("./intra.sock")) {
            rmSync("./intra.sock");
        }
        const orange = chalk.hex("#ffa500");
        const red = chalk.hex("#ff0000");
        const hyeRed = chalk.hex("#EC635D");
        const hyeBlue = chalk.hex("#5777FF");
        const hyeOrange = chalk.hex("#FFB800");
        process.stdout.write(` 
 .----------------.  .----------------.  .----------------.     ${orange("()")}                      
| .--------------. || .--------------. || .--------------. |   ${orange("((/(     )   )       )")}  
| |  ${hyeRed("____  ____ ")} | || | ${hyeBlue(" ____  ____ ")} | || |  ${hyeOrange("_________")}   | |    ${orange("/(_)) ( /(  /((   ( /(")}  
| | ${hyeRed("|_   ||   _|")} | || | ${hyeBlue("|_  _||_  _|")} | || | ${hyeOrange("|_   ___  |")}  | |   ${orange("(_))   )(_))(_))\\  )(_))")} 
| |   ${hyeRed("| |__| |")}   | || | ${hyeBlue("  \\ \\  / /")}   | || |   ${hyeOrange("| |_  \\_|")}  | |   ${red("| |")}   ${orange("((")}${red("_")}${orange(")")}${red("_ _")}${orange("((")}${red("_")}${orange(")((")}${red("_")} ${orange(")")}${red("_")} 
| |   ${hyeRed("|  __  |")}   | || | ${hyeBlue("   \\ \\/ / ")}   | || |   ${hyeOrange("|  _|  _")}   | |   ${red("| |__ / _' |\\ V / / _' | ")}
| |  ${hyeRed("_| |  | |_")}  | || | ${hyeBlue("   _|  |_    ")}| || |${hyeOrange("  _| |___/ |")}  | |   ${red("|____|\\__,_| \\_/  \\__,_|")}
| | ${hyeRed("|____||____|")} | || |  ${hyeBlue(" |______|   ")}| || | ${hyeOrange("|_________|")}  | | 
| |              | || |              | || |              | |   Ararat's Power
| '--------------' || '--------------' || '--------------' |   © 2022${new Date().getFullYear() != 2022 ? `-${new Date().getFullYear()}` : ""} Hye Hosting LLC
 '----------------'  '----------------'  '----------------'\n\n`);
        for (let i = 0; i < 4; i++) {
            cluster.fork();
        }
        import("./lib/eventHandler.js").then((e) => {
            e.listen();
        })
        const unixServer = net.createServer(socket => {
            socket.on("data", data => {
                console.log("e")
                if (data.toString() == "update") {
                    console.log("Updating...");
                    updating = true;
                    for (const id in cluster.workers) {
                        cluster.workers[id].kill(0);
                    }
                    console.log("Updating...");
                    execSync("apt-get update", { stdio: [0, 1, 2] });
                    let url;
                    if (process.arch == "arm64") {
                        url = process.env.PANEL_URL + "/lxd-arm64.snap";
                    } else {
                        url = process.env.PANEL_URL + "/lxd-amd64.snap";
                    }

                    execSync("wget -O lxd.snap " + url, { stdio: [0, 1, 2] });
                    execSync("snap install lxd.snap --dangerous", { stdio: [0, 1, 2] });
                    execSync("rm lxd.snap", { stdio: [0, 1, 2] });
                    //execSync("git pull", { stdio: [0, 1, 2] });
                    execSync("npm install", { stdio: [0, 1, 2] });
                    for (let i = 0; i < 4; i++) {
                        cluster.fork();
                    }
                    updating = false;
                }
            });
        });
        unixServer.listen("./intra.sock");

        cluster.on("exit", () => {
            if (!updating) {
                cluster.fork();
            }
        });
    }

} else {
    console.log("INSTANCE STARTED");
    (await (import("./index.js"))).default();
}
