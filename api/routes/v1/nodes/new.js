import express from "express";
import {NodeSSH} from "node-ssh"

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
        ws.send(JSON.stringify({event: "status", metadata: "Installing dependencies: curl git"}));
        channel.write("apt-get install -y curl git && echo curlDone\n")
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
        ws.send(JSON.stringify({event: "status", metadata: "Downloading Hye Ararat..."}));
        channel.write("mkdir /usr/lib/ararat\n");
        channel.write(`cd /usr/lib/ararat && git clone https://github.com/Hye-Ararat/Ararat.git . && echo araratCloned\n`);
        await araratReady()
        ws.send(JSON.stringify({event: "status", metadata: "Installing node modules...."}));
        channel.write(`npm install && npm link && echo npmDone\n`)
        await npmReady();

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