import yargs from "yargs";
import { hideBin } from "yargs/helpers"
import fs, { createWriteStream, rmSync } from "fs";
import 'dotenv/config';
import { exec, execSync, spawn } from "child_process";
import express from "express";
import expressWs from "express-ws";
import https from "https";
import { homedir } from "os";
import tcpProxy from "node-tcp-proxy";
import udpProxy from "udp-proxy";

const argv = yargs(hideBin(process.argv)).argv;

const app = express();
expressWs(app);

app.ws("/", install)
if ("ssl" in argv) {
    app.listen(3001);
} else {
    app.listen(argv.port ? argv.port : 3001)
}

if ("ssl" in argv) {
    execSync("apt-get -y update", { stdio: [0, 1, 2] });
    execSync("apt-get -y install nginx", { stdio: [0, 1, 2] });
    execSync("apt-get -y install certbot", { stdio: [0, 1, 2] });
    execSync("apt-get -y install python3-certbot-nginx", { stdio: [0, 1, 2] });
    execSync('wget -O /etc/nginx/sites-enabled/Lava.conf https://raw.githubusercontent.com/Hye-Ararat/Lava/master/Lava.conf', { stdio: [0, 1, 2] });
    let conf = fs.readFileSync("/etc/nginx/sites-enabled/Lava.conf", "utf8");
    conf = conf.replaceAll("example.com", `${argv.address}`);
    fs.writeFileSync("/etc/nginx/sites-enabled/Lava.conf", conf);
    execSync(`sudo certbot --nginx -d ${argv.address} --agree-tos --register-unsafely-without-email -n`, { stdio: [0, 1, 2] });
    let conf2 = fs.readFileSync("/etc/nginx/sites-enabled/Lava.conf", "utf8");
    conf2 = conf2.replaceAll("443", `${argv.port}`);
    fs.writeFileSync("/etc/nginx/sites-enabled/Lava.conf", conf2);
    execSync('systemctl restart nginx', { stdio: [0, 1, 2] });
}

console.log("Thanks for choosing Hye Ararat!");
console.log("")
console.log("✅ Ready! Please press continue on the Ararat panel");

async function install(ws, req) {
    let certificate;
    let key;
    let panel_url;
    let lxd_port;
    ws.on("message", (msg) => {
        console.log("Recieved Data from Ararat...")
        msg = JSON.parse(msg);

        if (msg.cert) {
            certificate = msg.cert;
        }
        if (msg.key) {
            key = msg.key;
        }
        if (msg.panel_url) {
            if (!argv.panel_url) {
                panel_url = msg.panel_url;
            }
        }
        if (msg.lxd_port) {
            lxd_port = msg.lxd_port;
        }

    });
    if (argv.panel_url) {
        panel_url = argv.panel_url;
    }
    if (process.platform != "darwin") {
        setTimeout(async () => {
            console.log("Starting Installation.")
            console.log("");
            console.log("Installing dependencies...");
            ws.send("Installing Dependencies...");
            execSync("apt-get -y update", { stdio: [0, 1, 2] });
            execSync("apt-get -y install snapd wget", { stdio: [0, 1, 2] });
            execSync("snap install lxd", { stdio: [0, 1, 2] });
            let url;
            if (process.arch == "arm64") {
                url = panel_url + "/lxd-arm64.snap";
            } else {
                url = panel_url + "/lxd-amd64.snap";
            }
            execSync("wget -O lxd.snap " + url, { stdio: [0, 1, 2] });
            execSync("snap install lxd.snap --dangerous", { stdio: [0, 1, 2] });
            execSync("rm lxd.snap", { stdio: [0, 1, 2] });
            console.log("Dependencies installed! ✅");
            console.log("");
            ws.send("Setting Up Dependencies...")
            execSync("lxd.lxc config set core.https_address [::]:" + lxd_port, { stdio: [0, 1, 2] });
            const cert = Buffer.from(certificate, "base64").toString("ascii");
            const newKey = Buffer.from(key, "base64").toString("ascii");
            console.log("Dependencies set up! ✅");
            console.log("");
            ws.send("Authorizing Communication...");
            fs.writeFileSync("./client.crt", cert);
            fs.writeFileSync("./client.key", newKey);
            execSync("lxd.lxc config trust add ./client.crt --name Ararat", { stdio: [0, 1, 2] });
            console.log("Communication authorized! ✅");
            console.log("");
            ws.send("Configuring Node...")
            let config = "";
            if ("ssl" in argv) {
                config += `SSL=${argv.ssl}\n`;
                if (argv.ssl && !argv.ssl_cert_path) {
                    console.log("SSL is enabled but no cert path is set. Please set the ssl_cert_path argument.");
                    process.exit(0);
                }
                if (argv.ssl && !argv.ssl_key_path) {
                    console.log("SSL is enabled but no key path is set. Please set the ssl_key_path argument.");
                    process.exit(0);
                }
            }
            if ("ssl_cert_path" in argv) {
                config += `SSL_CERT_PATH=${argv.ssl_cert_path}\n`;
            }
            if ("ssl_key_path" in argv) {
                config += `SSL_KEY_PATH=${argv.ssl_key_path}\n`;
            }
            if ("port" in argv) {
                if ("ssl" in argv) {
                    config += `PORT=3001\n`;
                } else {
                    config += `PORT=${argv.port}\n`;
                }
            }
            if ("panel_url" in argv) {
                config += `PANEL_URL=${argv.panel_url}\n`;
            }

            fs.writeFileSync(".env", config);
            console.log("Node configured! ✅");
            console.log("");
            ws.send("Success");
            ws.close();
        }, 5000);
    } else {
        let ip;
        setTimeout(() => {
            console.log(" Starting macOS Installation.");
            console.log("Downloading N-VPS image...");
            ws.send("Downloading N-VPS image...");
            https.get("https://cloud-images.ubuntu.com/releases/22.04/release/ubuntu-22.04-server-cloudimg-arm64.tar.gz", async res => {
                const stream = createWriteStream("./macOS/image.tar.gz");
                res.pipe(stream);
                let bytes_done = 0;
                res.on("data", (chunk) => {
                    bytes_done += chunk.length;
                    const percent = (bytes_done / res.headers["content-length"]) * 100;
                    ws.send(`Downloading N-VPS image... ${percent.toFixed(2)}%`);
                })
                stream.on("finish", () => {
                    console.log("Image Downloaded ✅");
                    console.log("");
                    ws.send("Extracting N-VPS image...");
                    execSync("tar -xf image.tar.gz", { cwd: "./macOS" });
                    ws.send("Setting up N-VPS filesystem...");
                    let files = fs.readdirSync("./macOS");
                    files = files.filter(file => file.endsWith(".img"));
                    execSync("mv " + files[0] + " image.img", { cwd: "./macOS" });
                    execSync("qemu-img resize image.img +30G", { cwd: "./macOS" });
                    rmSync("./macOS/image.tar.gz");
                    setTimeout(() => {

                        ws.send("Getting N-VPS ready for configuration...");
                        let configproc = spawn("./Hye_N-VPS_macOS", "-k vmlinuz -i initrd -d image.img -m 1024 -a \"console=hvc0\"".split(" "), { cwd: "./macOS" });
                        configproc.stderr.on("data", (data) => {
                            if (data.toString().includes("Waiting for connection to")) {
                                let configCon = data.toString().split(" ");
                                configCon = configCon[configCon.length - 1].replace(/\n/g, "")
                                let configscreen = exec("script /dev/null", { cwd: "./macOS" });
                                configscreen.stdin.write("screen " + configCon + "\n");
                                let runInit = false;
                                configscreen.stdout.pipe(process.stdout);
                                configscreen.stdout.on("data", (data) => {
                                    if (data.toString().includes("(initramfs)") && !runInit) {
                                        runInit = true;
                                        setTimeout(() => {


                                            ws.send("Configuring N-VPS...");
                                            configscreen.stdin.write("mkdir /mnt\n");
                                            configscreen.stdin.write("mount /dev/vda /mnt\n");
                                            configscreen.stdin.write("chroot /mnt\n");
                                            configscreen.stdin.write("echo 'root:root' | chpasswd\n");
                                            ws.send("Setting up N-VPS networking...");
                                            configscreen.stdin.write(`cat <<EOF > /etc/netplan/01-dhcp.yaml
network:
    renderer: networkd
    ethernets:
        enp0s1:
            dhcp4: true
    version: 2
EOF\n`);
                                            ws.send("Finishing up N-VPS initialization...");
                                            configscreen.stdin.write("exit\n");
                                            configscreen.stdin.write("umount /dev/vda\n");
                                        }, 5000);
                                        setTimeout(() => {
                                            configproc.kill()
                                            ws.send("Getting N-VPS ready for dependency installation...");
                                            let depproc = exec(`cd ./macOS && ./Hye_N-VPS_macOS -k vmlinuz -i initrd -d image.img -m 1024 -a "console=hvc0 root=/dev/vda"`);
                                            depproc.stderr.on("data", (data) => {
                                                if (data.toString().includes("Waiting for connection to")) {
                                                    let depCon = data.toString().split(" ");
                                                    depCon = depCon[depCon.length - 1].replace(/\n/g, "")
                                                    let depscreen = exec("script /dev/null", { cwd: "./macOS" });
                                                    depscreen.stdin.write("screen " + depCon + "\n");
                                                    let runDep = false;
                                                    let runDepInstall = false;
                                                    //E
                                                    depscreen.stdout.pipe(process.stdin)
                                                    depscreen.stdout.on("data", data => {
                                                        if (data.toString().includes("LTS ubuntu hvc0") && !runDep) {
                                                            runDep = true;
                                                            depscreen.stdin.write("root\n");
                                                            setTimeout(() => {
                                                                depscreen.stdin.write("root\n");
                                                            }, 500);

                                                        }
                                                        if (data.toString().includes("root@ubuntu:~#") && !runDepInstall) {
                                                            runDepInstall = true;
                                                            setTimeout(() => {
                                                                setTimeout(() => {
                                                                    ws.send("Getting N-VPS information...");
                                                                    depscreen.stdin.write(`echo "Addr:" $(hostname -i)\n`);
                                                                    setTimeout(() => {
                                                                        ws.send("Downloading LXD...");
                                                                        depscreen.stdin.write("wget -O lxd.snap " + panel_url + "/lxd-arm64.snap\n");
                                                                        setTimeout(() => {
                                                                            ws.send("Installing LXD...");

                                                                            depscreen.stdin.write("snap install lxd.snap --dangerous\n");
                                                                            setTimeout(() => {
                                                                                depscreen.stdin.write("rm lxd.snap\n");
                                                                                ws.send("Setting up LXD...");
                                                                                depscreen.stdin.write(`lxd.lxc config set core.https_address "[::]:${lxd_port}"\n`);
                                                                                setTimeout(() => {
                                                                                    ws.send("Authorizing LXD communication...");
                                                                                    const cert = Buffer.from(certificate, "base64").toString("ascii");
                                                                                    const certKey = Buffer.from(key, "base64").toString("ascii");
                                                                                    depscreen.stdin.write("touch client.crt\n");
                                                                                    depscreen.stdin.write("echo '" + cert + "' > client.crt\n");
                                                                                    depscreen.stdin.write("lxd.lxc config trust add ./client.crt --name Ararat\n");
                                                                                    setTimeout(() => {
                                                                                        ws.send("Finishing Up");
                                                                                        fs.writeFileSync("./client.crt", cert);
                                                                                        fs.writeFileSync("./client.key", certKey);
                                                                                        fs.copyFileSync("./client.crt", homedir() + "/.config/lxc/client.crt");
                                                                                        fs.copyFileSync("./client.key", homedir() + "/.config/lxc/client.key");
                                                                                        let config = "";
                                                                                        if ("ssl" in argv) {
                                                                                            config += `SSL=${argv.ssl}\n`;
                                                                                            if (argv.ssl && !argv.ssl_cert_path) {
                                                                                                console.log("SSL is enabled but no cert path is set. Please set the ssl_cert_path argument.");
                                                                                                process.exit(0);
                                                                                            }
                                                                                            if (argv.ssl && !argv.ssl_key_path) {
                                                                                                console.log("SSL is enabled but no key path is set. Please set the ssl_key_path argument.");
                                                                                                process.exit(0);
                                                                                            }
                                                                                        }
                                                                                        if ("ssl_cert_path" in argv) {
                                                                                            config += `SSL_CERT_PATH=${argv.ssl_cert_path}\n`;
                                                                                        }
                                                                                        if ("ssl_key_path" in argv) {
                                                                                            config += `SSL_KEY_PATH=${argv.ssl_key_path}\n`;
                                                                                        }
                                                                                        if ("port" in argv) {
                                                                                            if ("ssl" in argv) {
                                                                                                config += `PORT=3001\n`;
                                                                                            } else {
                                                                                                config += `PORT=${argv.port}\n`;
                                                                                            }
                                                                                        }
                                                                                        if ("panel_url" in argv) {
                                                                                            config += `PANEL_URL=${argv.panel_url}\n`;
                                                                                        }
                                                                                        config += `LXD=https://${ip}:${lxd_port}\n`;
                                                                                        setTimeout(() => {
                                                                                            ws.send("Configuring CLI...");
                                                                                            execSync(`lxc remote add node ${ip} --accept-certificate`, { stdio: "inherit" });
                                                                                            fs.writeFileSync(".env", config);
                                                                                            depscreen.stdin.write("shutdown now \n");
                                                                                            depscreen.stdout.on("data", data => {
                                                                                                if (data.toString().includes("[screen is terminating]")) {
                                                                                                    ws.send("Success");
                                                                                                    ws.close();
                                                                                                    process.exit(0);
                                                                                                }
                                                                                            })
                                                                                        }, 2000);
                                                                                    }, 5000);
                                                                                }, 10000);
                                                                            }, 40000)
                                                                        }, 40000);
                                                                    }, 5000)
                                                                }, 10000);
                                                            }, 23000);

                                                        }
                                                        if (data.toString().includes("Addr:") && !data.toString().includes("echo") && !ip) {
                                                            ip = data.toString().split(" ").filter((e) => e.startsWith("192"))[0]
                                                            console.log(ip.replace(/[^0-9\.]+/g, ""))
                                                            tcpProxy.createProxy(8443, `${ip.replace(/[^0-9\.]+/g, "")}`, 8443);
                                                            udpProxy.createServer({
                                                                address: ip,
                                                                port: 8443,
                                                                localport: 8443,
                                                                localaddress: "127.0.0.1"
                                                            });
                                                            depscreen.stdin.write(`cat <<EOF > /etc/netplan/01-dhcp.yaml
network:
    renderer: networkd
    ethernets:
        enp0s1:
            dhcp4: yes
            addresses: [${ip}/24]
    version: 2
EOF\n`);
                                                        }
                                                    })
                                                }
                                            })
                                        }, 20000)
                                    }
                                })
                            }
                        });

                    })
                })
            }, 5000)
        }, 10000);
    }
}
