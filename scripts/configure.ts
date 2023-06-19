import axios from "axios";
import { execSync } from "child_process";
import { writeFileSync } from "fs";
import prompts from "prompts";

function exec(command: string | string[]) {
    if (Array.isArray(command)) {
        return command.map((cmd) => {
            try {
                console.log("- " + cmd)
                return execSync(cmd)
            } catch (error) {
                process.exit(1)
            }
        })
    } else {
        try {
            console.log("- " + command)
            return execSync(command)
        } catch (error) {
            process.exit(1)
        }
    }
}

var portregex = new RegExp("^([1-9][0-9]{0,3}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5])$")
var ipregex = new RegExp("^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$")
var domainregex = /([a-z0-9]+\.)*[a-z0-9]+\.[a-z]+/;

async function setup() {
    // install caddy
    exec([
        "apt-get update -y",
        "apt-get install -y debian-keyring debian-archive-keyring apt-transport-https wget",
        "curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | gpg --batch --yes --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg",
        "curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | tee /etc/apt/sources.list.d/caddy-stable.list",
        "apt-get update -y",
        "apt-get install caddy -y"
    ])
    var useDomain = await prompts({
        type: "confirm",
        name: "value",
        message: "Is this Ararat install going to use a domain? If so, please point your domain to this install before proceeding."
    });
    var address = await prompts({
        type: "text",
        name: "value",
        message: `Enter the ${useDomain.value ? "domain" : "ip address"} of this node ${useDomain.value ? "(ex: us-dal-1.hye.gg)" : "(ex: 8.8.8.8)"}`,
        validate: (value) => {
            if (useDomain.value) {
                return (domainregex.test(value) ? true : "Invalid domain")
            } else {
                return (ipregex.test(value) ? true : "Invalid IP Address")
            }
        }
    });
    var port = await prompts({
        type: "number",
        name: "value",
        message: `Enter the port you would like this node to listen on. (443 is reccomended)`,
        validate: (value) => (portregex.test(value) ? true : "Invalid port")
    })
    let dbUsername = await prompts({
        type: "text",
        name: "value",
        message: "What would you like your database account's username to be?",
        validate: value => value != "admin"
    })
    var dbPassword = await prompts({
        type: "password",
        name: "value",
        message: `What should the password to this database account be?`
    })
    var caddyConfig = {
        "apps": {
            "http": {
                "servers": {
                    "ararat": {
                        "listen": [`:${port.value}`],
                        "routes": [
                            {
                                "match": [
                                    { "host": [address.value] }
                                ],
                                "handle": [
                                    {
                                        "handler": "reverse_proxy",
                                        "upstreams": [
                                            { "dial": "127.0.0.1:3000" }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                }
            }
        }
    }
    await axios.post("http://127.0.0.1:2019/load", caddyConfig)
    // install cockroachDB
    exec([
        "mkdir ./cockroach",
        "wget https://binaries.cockroachdb.com/cockroach-v22.2.2.linux-amd64.tgz -O cockroach/cockroach.tgz",
        "tar -xf cockroach/cockroach.tgz",
        `rm "/usr/local/lib/cockroach"`,
        "mkdir -p /usr/local/lib/cockroach",
        "cp ./cockroach/cockroach-v22.2.2.linux-amd64/cockroach /usr/local/bin",
        "cp ./cockroach/cockroach-v22.2.2.linux-amd64/lib/libgeos.so /usr/local/lib/cockroach/libgeos.so",
        "cp ./cockroach/cockroach-v22.2.2.linux-amd64/lib/libgeos_c.so /usr/local/lib/cockroach/libgeos_c.so",
        "rm -R ./cockroach",
        "mkdir config",
        "mkdir config/certs",
        "cockroach cert create-ca --certs-dir=certs --ca-key=config/certs/ca.key",
        "cockroach cert create-node localhost 127.0.0.1 --certs-dir=certs --ca-key=config/certs/ca.key",
        "cockroach cert create-client root --certs-dir=config/certs --ca-key=config/certs/ca.key",
        "rm /var/lib/cockroach",
        "mkdir /var/lib/cockroach",
        "mv config/certs /var/lib/cockroach",
        "chmod -rwx------ -R /var/lib/cockroach/certs",
        "chmod -R 700 /var/lib/cockroach/certs",
        "useradd cockroach",
        "chown -R cockroach /var/lib/cockroach"
    ])
    var cockroachSystemd = `
[Unit]
Description=Cockroach Database cluster node
Requires=network.target
[Service]
Type=notify
WorkingDirectory=/var/lib/cockroach
ExecStart=/usr/local/bin/cockroach start --certs-dir=certs --advertise-addr=${address.value} --join=${address.value} --http-addr=127.0.0.1:8081 --cache=.25 --max-sql-memory=.25
TimeoutStopSec=300
Restart=always
RestartSec=10
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=cockroach
User=cockroach
[Install]
WantedBy=default.target
`
    writeFileSync("/etc/systemd/system/cockroachdb.service", cockroachSystemd);
    exec([
        "systemctl daemon-reload",
        "systemctl stop cockroachdb",
        "systemctl start cockroachdb",
        `cockroach init --certs-dir=/var/lib/cockroach/certs --host=${address.value}`,
        "systemctl enable cockroachdb",
        `cockroach sql --certs-dir=/var/lib/cockroach/certs --host=127.0.0.1 --execute="CREATE USER ${dbUsername.value} WITH PASSWORD '${dbPassword.value}'";`,
        `cockroach sql --certs-dir=/var/lib/cockroach/certs --host=127.0.0.1 --execute="GRANT admin TO ${dbUsername.value}";`,
        `cockroach sql --certs-dir=/var/lib/cockroach/certs --host=127.0.0.1 --execute="CREATE DATABASE ararat";`
    ])
    let envConfig = "";
    envConfig += `DATABASE_URL="postgresql://${dbUsername}:${dbPassword}@127.0.0.1:26257/ararat"`
    writeFileSync(".env", envConfig);
}
setup()