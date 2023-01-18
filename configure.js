const { execSync, spawn, exec } = require("child_process");
const prompts = require("prompts");
const axios = require("axios");
const { mkdirSync, rmSync, cpSync, rmdirSync, writeFileSync } = require("fs");
const { genSalt, hash } = require("bcryptjs");

(async function setup(){
  let joinNode = process.argv[2] ? {
    domain: process.argv[2],
    port: process.argv[3],
    ip: process.argv[4]
  }: false
  console.log(joinNode)
  
console.log("Installing Dependency: caddy...");
execSync("apt-get install -y debian-keyring debian-archive-keyring apt-transport-https wget");
execSync("curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | gpg --batch --yes --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg");
execSync("curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | tee /etc/apt/sources.list.d/caddy-stable.list");
execSync("apt-get update -y")
execSync("apt-get install caddy -y")
console.log("✅ Dependency caddy successfully installed")
let useDomain;
let address;
let port;
if (!joinNode) {
useDomain = await prompts({
    type: "confirm",
    name: "value",
    message: "Is this Ararat install going to use a domain? If so, please point your domain to this install before proceeding."
});
address = await prompts({
    type: "text",
    name: "value",
    message: `Enter the ${useDomain.value ? "domain" : "ip address"} of this node ${useDomain.value ? "(ex: us-dal-1.hye.gg)" : "(ex: 8.8.8.8)"}`
});
port = await prompts({
    type: "number",
    name: "value",
    message: `Enter the port you would like this node to listen on. (443 is reccomended)`
})
} else {
  useDomain = {};
  useDomain.value = true;

  address = {};
  address.value = joinNode.domain;

  port = {};
  port.value = joinNode.port;
}

console.log("Setting up web server...")
let caddyConfig = {
    "apps": {
      "http": {
        "servers": {
          "ararat": {
            "listen": [`:${port.value}`],
            "routes": [
              {
                "match": [
                  {
                    "host": [
                      address.value
                    ]
                  }
                ],
                "handle": [
                  {
                   
                            "handler": "reverse_proxy",
                            "upstreams": [
                              {
                                "dial": "localhost:3000"
                              }
                            ]
                       
                  }
                ]
              }
            ]
          }
        }
      },
    }
  }
  writeFileSync("./caddyConfig.json", JSON.stringify(caddyConfig))
let newConf = await axios.post("http://localhost:2019/load", caddyConfig)
console.log("✅ Web Server Setup Successful")
console.log("Installing dependency: cockroachdb")
try {
    mkdirSync("./cockroach")
} catch {
    
}
execSync("wget https://binaries.cockroachdb.com/cockroach-v22.2.2.linux-amd64.tgz -O cockroach/cockroach.tgz")
execSync("tar -xf cockroach.tgz", {cwd: "./cockroach"})
try {
    rmSync("/usr/local/lib/cockroach");
} catch {
    
}
execSync("mkdir -p /usr/local/lib/cockroach")
execSync("cp ./cockroach/cockroach-v22.2.2.linux-amd64/cockroach /usr/local/bin")
cpSync("./cockroach/cockroach-v22.2.2.linux-amd64/lib/libgeos.so", "/usr/local/lib/cockroach/libgeos.so")
cpSync("./cockroach/cockroach-v22.2.2.linux-amd64/lib/libgeos_c.so", "/usr/local/lib/cockroach/libgeos_c.so")

rmSync("./cockroach", {recursive: true, force: true})
console.log("✅ Dependency cockroachdb successfully installed")
if (!joinNode) {
try {
    rmSync("./ca", {recursive: true});
    rmSync("./certs", {recursive: true});
} catch (error) {
    
}
try {
    mkdirSync("./certs");
    mkdirSync("./ca")   
} catch {
    
}

console.log("Generating Ararat CA");
execSync(`cockroach cert create-ca --certs-dir=certs --ca-key=ca/ca.key`)
console.log("✅ CA Generated");
let publicIp;
if (!joinNode) {
publicIp = await prompts({
    type: "text",
    message: "What is this node's accessible IP address?",
    name: "value"
});
} else {
  publicIp = {};
  publicIp.value = joinNode.ip;
}
console.log("Generating Certificates...");
let hosts = "localhost 127.0.0.1";
hosts += " " + address.value;
if (publicIp.value != address.value) hosts+=` ${publicIp.value}`
execSync(`cockroach cert create-node ${hosts} --certs-dir=certs --ca-key=ca/ca.key`);
}
console.log("Generating Client Certificate...")
if (!joinNode) {
execSync(`cockroach cert create-client root --certs-dir=certs --ca-key=ca/ca.key`);
}
console.log("✅ Certificates Generated");
console.log("Preparing Database for Cluster...")
try {
    rmSync("/var/lib/cockroach", {recursive: true})
} catch {
    
}
execSync("mkdir /var/lib/cockroach");
execSync("mv certs /var/lib/cockroach");
execSync("chmod -rwx------ -R /var/lib/cockroach/certs")
try {
    execSync("useradd cockroach");
} catch {
    
}
execSync("chown -R cockroach /var/lib/cockroach")
if (!joinNode) {
let cockroachSystemd = `
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
}
console.log("Initializing Cluster...")
execSync("systemctl daemon-reload");
try {
execSync("systemctl stop cockroachdb")
} catch {

}
execSync("systemctl start cockroachdb");
if (!joinNode){
execSync(`cockroach init --certs-dir=/var/lib/cockroach/certs --host=${address.value}`)
}
execSync("systemctl enable cockroachdb");

console.log("✅ Cluster Initialized");
if (!joinNode) {
let dbUsername = await prompts({
type: "text",
name: "value",
message: "What would you like your database account's username to be?"
})
let dbPassword = await prompts({
type: "password",
name: "value",
message: "What should the password to this database account be?"
})
console.log("Creating Database User...");
execSync(`cockroach sql --certs-dir=/var/lib/cockroach/certs --host=development.hye.gg --execute="CREATE USER ${dbUsername.value} WITH PASSWORD '${dbPassword.value}'";`);
console.log("✅ Database User Created")
console.log("Granting Administrative Privileges...");
execSync(`cockroach sql --certs-dir=/var/lib/cockroach/certs --host=development.hye.gg --execute="GRANT admin TO ${dbUsername.value}";`);
console.log("✅ Administrative Privileges Granted")
console.log("Creating Database...");
execSync(`cockroach sql --certs-dir=/var/lib/cockroach/certs --host=development.hye.gg --execute="CREATE DATABASE ararat";`);
console.log("✅ Database Created")
console.log("Saving Database Configuration...");
let envConfig = "";
envConfig += `DATABASE_URL="postgresql://${dbUsername.value}:${dbPassword.value}@127.0.0.1:26257/ararat"`
writeFileSync(".env", envConfig);
console.log("✅ Database Configuration Saved");
console.log("Seeding Database...")
execSync("npx prisma db push");
console.log("✅ Database Seeded")
}
console.log("Installing dependency: snapd...");
execSync("apt-get install -y snapd")
console.log("✅ Installed dependency snapd")
console.log("Installing dependency: LXD...")
execSync("snap install lxd");
console.log("✅ Installed dependency LXD")
console.log("Patching LXD...");
try {
execSync("rm lib/lxd_amd64.snap")
} catch {

}
execSync("wget https://github.com/Hye-Ararat/lxd-pkg-snap/releases/download/5.9_amd64/lxd_5.9_amd64.snap -O lib/lxd_amd64.snap")
execSync("snap install lib/lxd_amd64.snap --dangerous");
execSync("rm lib/lxd_amd64.snap");
console.log("✅ Patched LXD")
if (!joinNode){
console.log("Generating Encryption Key...");
const randomString = () => {
const length = 32;
const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
let result = "";
for (let i = 0; i < length; i++) {
    result += charset.charAt(Math.floor(Math.random() * charset.length));
}
return result;
}
let envLocal = "";
envLocal += `ENC_KEY=${randomString()}\n`;
console.log("✅ Encryption Key Generated")
console.log("Generating Communication Key...")
envLocal += `COMMUNICATION_KEY=${randomString()}\n`;
console.log("✅ Communication Key Generated")
console.log("Saving Configuration...");
writeFileSync(".env.local", envLocal);
console.log("✅ Configuration Saved!")
}
console.log("Building Ararat...");
execSync("npm run build");
console.log("✅ Build Successful")
console.log("Adjusting Permissions...")
execSync("chmod +x start.sh");
console.log("✅ Permissions Adjusted")
console.log("Creating System Service...")
try {
execSync("systemctl stop ararat");
execSync("rm /etc/systemd/system/ararat.service");
} catch (error) {

}
let araratSystemd = `
[Unit]
After=network.target
Description=Hye Ararat

[Service]
WorkingDirectory=/usr/lib/ararat/
Environment="NODE_ENV=production"
ExecStart=/usr/lib/ararat/start.sh
Restart=on-failure
User=root

[Install]
WantedBy=multi-user.target
`
writeFileSync("/etc/systemd/system/ararat.service", araratSystemd);
console.log("✅ System Service Created")
console.log("Enabling and Starting System Service...");
//execSync("systemctl enable ararat");
//execSync("systemctl start ararat");
console.log("✅ Ararat enabled at startup and now running")
if (!joinNode){
console.log("Now let's make a Hye Ararat account");
const username = await prompts({
message: "What would you like your username to be",
name: "value",
type: "text"
})
const password = await prompts({
message: "What would you like your password to be",
name: "value",
type: "password"
})
const email = await prompts({
message: "What is your email address",
name: "value",
type: "text"
})
const firstName = await prompts({
type: "text",
name: "value",
message: "What is your first name"
})
const lastName = await prompts({
type: "text",
name: "value",
message: "What is your last name"
})
console.log("Creating user...");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
let salt = await genSalt(10);
let hashedPassword = await hash(password.value, salt);
let user = await prisma.user.create({
  data: {
      firstName: firstName.value,
      lastName: lastName.value,
      email: email.value,
      username: username.value,
      password: hashedPassword,
  }
})
let permission = await prisma.permission.create({
  data: {
      permission: "edit-users_user",
      user: {
          connect: {
              id: user.id
          }
      }
  }
})

console.log("✅ Account created")
}
console.log("You're node has been setup! You can now navigate to it using the URL you specified earlier in your web browser.")

})()