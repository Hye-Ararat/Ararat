import express from "express";
import {NodeSSH} from "node-ssh"

import {execSync} from "child_process";
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "fs";

const router = express.Router({ mergeParams: true });


router.ws("/", 
/**
 * Websocket Endpoint for Installing Node
 * 
 * @param {import("ws")} ws
 * @param {express.Request} req 
 */
async (ws, req) => {
    async function installNode(host, port, username, password) {
        //Connect
        const ssh = new NodeSSH();
        let connection;
        try {
            connection = await ssh.connect({
                host: host,
                port: parseInt(port),
                username: username,
                password: password
            })
        } catch (error) {
            console.log(error)
            return ws.send(JSON.stringify({event: "error", metadata: "We weren't able to connect to your node."}))
        }
        ws.on("close", () => {
            return connection.dispose();
        })

        //Make sure they are using ubuntu
        ws.send(JSON.stringify({event: "status", metadata: "Verifying Compatibility..."}))
        let osRelease = await connection.execCommand("cat /etc/os-release");
        if (!osRelease.stdout.includes("Ubuntu")) {
            connection.dispose();
            return ws.send(JSON.stringify({event: "error", metadata: "System is not compatible! Hye Ararat is only compatible with Ubuntu 20.04+"}))
        }

        //Logic for waiting for escalation
        let esc = false;
        function escalated() {
            return new Promise((resolve, reject) => {
                if (username == "root") {
                    return resolve(true)
                }
                let interval = setInterval(() => {
                    if (esc) {
                        clearInterval(interval);
                        return resolve(true)
                    }
                }, 100)
            })
        }

        //Use a channel for environment context
        let channel = await connection.requestShell();

        //Curl Completion Handler
        let curlDone1 = false;
        let curlDone = false;
        function curlInstalled() {
            return new Promise((resolve, reject) => {
                let interval = setInterval(() => {
                    if (curlDone) {
                        clearInterval(interval);
                        return resolve(true)
                    }
                }, 100)
            })
        }

        //nvm installation handler
        let nvmDone = false;
        function nvmReady() {
            return new Promise((resolve, reject) => {
                let interval = setInterval(() => {
                    if (nvmDone) {
                        clearInterval(interval);
                        return resolve(true)
                    }
                }, 100)
            })
        }

        //Node.JS installation handler;
        let nodeDone = false;
        function nodeReady() {
            return new Promise((resolve, reject) => {
                let interval = setInterval(() => {
                    if (nodeDone) {
                        clearInterval(interval);
                        return resolve(true)
                    }
                }, 100)
            })
        }

        //Ararat download handler
        let araratCloned1 = false;
        let araratDone = false;
        function araratReady() {
            return new Promise((resolve, reject) => {
                let interval = setInterval(() => {
                    if (araratDone) {
                        clearInterval(interval);
                        return resolve(true)
                    }
                }, 100)
            })
        }

        //node module installation handler
        let npmIDone1 = false;
        let npmIDone = false;
        function npmReady() {
            return new Promise((resolve, reject) => {
                let interval = setInterval(() => {
                    if (npmIDone) {
                        clearInterval(interval);
                        return resolve(true)
                    }
                }, 100)
            })
        }

        channel.on("data", async(d) => {
           ws.send(JSON.stringify({event: "log", metadata: d.toString()}))
            //Superuser Escelation
            if (d.toString().includes("password for")) {
                channel.write(password + "\n");
                esc = true;
            }
            if (d.toString().includes("not in the sudoers file")) {
                connection.dispose();
                return ws.send(JSON.stringify({event: "error", metadata: "The user you provided is not a superuser. A user with superuser permissions is required in order to install Hye Ararat."}))
            }
            
            //Curl/Git Installation Completion Handling
            if (d.toString().includes("curlDone")) {
                if (!curlDone1) {
                    curlDone1 = true;
                } else {
                    curlDone = true;
                }
            }

            //nvm Installation Completion Handling
            if (d.toString().includes("This loads nvm bash_completion")) {
                nvmDone = true;
            }

            //Node.JS Installation Completion Handling
            if (d.toString().includes("Now using node")) {
                nodeDone = true;
            }

            //Ararat download handling
            if (d.toString().includes("araratCloned") || d.toString().includes("fatal: destination path '.' already exists and is not an empty directory")) {
                if (!araratCloned1) {
                    araratCloned1 = true;
                } else {
                    araratDone = true;
                }
            }

            //node module installation handling
            if (d.toString().includes("npmDone")) {
                if (!npmIDone1) {
                    npmIDone1 = true;
                } else {
                    npmIDone = true;
                }
            }
        })
        
        //Escelate to Superuser
        if (username != "root") {
            ws.send(JSON.stringify({event: "status", metadata: "Escalating to superuser..."}));
            channel.write("sudo su\n")
        }
        await escalated();

        //Install curl and git
        ws.send(JSON.stringify({event: "status", metadata: "Installing dependencies: curl git wget"}));
        channel.write("apt-get install -y curl git wget && echo curlDone\n")
        await curlInstalled();

        //Install nvm
        ws.send(JSON.stringify({event: "status", metadata: "Installing dependency: nvm"}));
        channel.write("curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash\n");
        await nvmReady();
        channel.write('export NVM_DIR="$HOME/.nvm" \n [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm \n[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion\n')

        //Install Node.JS
        ws.send(JSON.stringify({event: "status", metadata: "Installing dependency: Node.JS"}));
        channel.write("nvm install --lts\n")
        await nodeReady();

        //Download Ararat
        ws.send(JSON.stringify({event: "status", metadata: "Downloading Hye Ararat..."}));
        channel.write("mkdir /usr/lib/ararat\n");
        channel.write(`cd /usr/lib/ararat && git clone https://github.com/Hye-Ararat/Ararat.git . && echo araratCloned\n`);
        await araratReady()

        //Install Node Modules
        ws.send(JSON.stringify({event: "status", metadata: "Installing node modules..."}));
        channel.write(`npm install && npm link && echo npmDone\n`)
        await npmReady();

        ws.send(JSON.stringify({event: "complete", metadata: "Installation"}))
        ws.on("message", async (e) => {
            let data = JSON.parse(e);
            if (data.event == "sendConfiguration") {
                console.log(data.metadata)
                console.log("SEND CONFIGURATION")


                ws.send(JSON.stringify({event: "status", metadata: "Generating Certificates for CockroachDB..."}));
                //Generate Hosts
                let hosts = "localhost 127.0.0.1";
                hosts += " " + data.metadata.domain + " " + data.metadata.ipAddress;

                //Make Certs Directory for Certificates
                channel.write(`mkdir certs\n`);

                //Generate Certificate
                try {
                    rmSync("/usr/lib/ararat/tempCerts", {force: true, recursive: true});
                } catch (error) {
                    
                }
                mkdirSync("/usr/lib/ararat/tempCerts");
                execSync(`cockroach cert create-node ${hosts} --certs-dir=tempCerts --ca-key=ca/ca.key`, {cwd: "/usr/lib/ararat"});
                ws.send(JSON.stringify({event: "status", metadata: "Sending Certificates for CockroachDB..."}));

                await connection.putFiles([
                {local: "/usr/lib/ararat/tempCerts/ca.crt", remote: "/usr/lib/ararat/certs/ca.crt"}, 
                {local: "/usr/lib/ararat/tempCerts/node.crt", remote: "/usr/lib/ararat/certs/node.crt"}, 
                {local: "/usr/lib/ararat/tempCerts/node.key", remote: "/usr/lib/ararat/certs/node.key"}
                ])

                ws.send(JSON.stringify({event: "status", metadata: "Generating CockroachDB Service..."}));
                let cockroachDbSystemd = readFileSync("/etc/systemd/system/cockroachdb.service", "utf8");
                let joined = cockroachDbSystemd.split("--join=")[1].split(" --http-addr=")[0].split(",");
                let updateJoined = false;
                if (joined.length < 3) {
                    joined.push(data.metadata.domain);
                    updateJoined = true;

                    let oldJoinString = cockroachDbSystemd.split("--join=")[1].split(" --http-addr=")[0];
                    let newJoinString = "";
                    joinList.forEach((address, index) => {
                        newJoinString += `${address}${index != joinList.length - 1 ? "," : ""}`;
                    });
                    cockroachDbSystemd = cockroachDbSystemd.replace(oldJoinString, newJoinString);
                }
                let thisAdvertiseAddr = "--advertise-addr=" + newConf.split("--advertise-addr=")[1].split(" --join")[0];
                let newAdvertiseAddr = `--advertise-addr=${data.metadata.domain};`
                cockroachDbSystemd = cockroachDbSystemd.replace(thisAdvertiseAddr, newAdvertiseAddr);

                ws.send(JSON.stringify({event: "status", metadata: "Sending CockroachDB Service File..."}));
                try {
                    rmSync("/usr/lib/ararat/tempConfigs", {force: true, recursive: true})
                } catch (error) {
                    
                }
                mkdirSync("/usr/lib/ararat/tempConfigs");
                writeFileSync("/usr/lib/ararat/tempConfigs/cockroachdb.service", cockroachDbSystemd);
                await connection.putFile([{local: "/usr/lib/ararat/tempConfigs/cockroachdb.service", remote: "/etc/systemd/system/cockroachdb.service"}]);


                ws.send(JSON.stringify({event: "status", metadata: "Setting Up Environment..."}));
                await connection.putFiles([
                    {local: "/usr/lib/ararat/.env", remote: "/usr/lib/ararat/.env"}, 
                    {local: "/usr/lib/ararat/.env.local", remote: "/usr/lib/ararat/.env.local"}, 
                    ])
                    ws.send(JSON.stringify({event: "status", metadata: "Finishing Up..."}));
            }
        })

    }



    ws.on("message", (e) => {
        let data = JSON.parse(e);
        if (data.event == "sendCredentials") {
            console.log(data.metadata)
            let credentials = data.metadata;
            installNode(credentials.sshAddress, credentials.sshPort, credentials.sshUsername, credentials.sshPassword)
        }
    })

})
export default router;