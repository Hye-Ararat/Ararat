const { execSync } = require("child_process");
const { writeFileSync } = require("fs");
const prompts = require("prompts");
const axios = require("axios");
const sleep = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  const log = async (s) => {
    return new Promise(async (resolve, reject) => {
      for (const c of s) {
        process.stdout.write(c);
        await sleep(20);
      }
      await sleep(500);
      process.stdout.write("\n");
      resolve();
    });
  };

  (async function configure() {
    await log("Node Setup Initiated")
    await log("Installing Dependency: caddy...")
    execSync("apt-get update -y");
    execSync("apt-get install -y debian-keyring debian-archive-keyring apt-transport-https wget");
    execSync("curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | gpg --batch --yes --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg");
    execSync("curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | tee /etc/apt/sources.list.d/caddy-stable.list");
    execSync("apt-get update -y");
    execSync("apt-get install caddy -y")
    await log("✅ Dependency caddy successfully installed");
    let useDomain;
    let address;
    let port;
    useDomain = await prompts({
        type: "confirm",
        name: "value",
        message: "Is this Ararat install going to use a domain? If so, please point your domain to this install before proceeding."
    });
    address = await prompts({
        type: "text",
        name: "value",
        message: `Enter the ${useDomain.value ? "domain" : "ip address"} of this Ararat install ${useDomain.value ? "(ex: example.hyeararat.com)" : "(ex: 1.1.1.1)"}`
    });
    port = await prompts({
        type: "number",
        name: "value",
        message: `Enter the port you would like the Ararat Web UI to listen on. (443 is reccomended)`
    })
    await log("Setting up web server...");
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
                                    "dial": "127.0.0.1:3000"
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
      let newConf = await axios.post("http://127.0.0.1:2019/load", caddyConfig)
      await log("✅ Web server successfully configured");
      let alreadyHasDB = await prompts({
            type: "confirm",
            name: "value",
            message: "Does this Ararat install already have a database?"
        });
        let mongoUsername;
        let mongoPassword;
        let mongoHost;
        let mongoPort;
        let mongoDBName;
        if (!alreadyHasDB.value) {
            mongoHost = "localhost";
            mongoPort = 27017;
            mongoDBName = "ararat";
            await log("Installing MongoDB...");
            execSync("apt-get install gnupg");
            execSync("curl -fsSL https://pgp.mongodb.com/server-7.0.asc | \
            gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg \
            --dearmor")
            execSync(`echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list`)
            execSync("apt-get update -y");
            execSync("apt-get install -y mongodb-org")
            execSync("systemctl start mongod")
            execSync("systemctl enable mongod")
            await log("✅ MongoDB successfully installed");
            await log("Creating Ararat database...");
            await log("Configuring MongoDB...");
            mongoUsername = await prompts({
                type: "text",
                name: "value",
                message: "Enter a username for the MongoDB database"
            });
            mongoPassword = await prompts({
                type: "password",
                name: "value",
                message: "Enter a password for the MongoDB database"
            });
            execSync(`mongosh --eval "db.getSiblingDB('ararat').createUser({user: '${mongoUsername.value}', pwd: '${mongoPassword.value}', roles: [{role: 'readWrite', db: 'ararat'}]})"`)
            execSync('echo "security:\n  authorization: enabled" >> /etc/mongod.conf');
            execSync("systemctl restart mongod")
            await log("✅ MongoDB successfully configured");
        }
       if (alreadyHasDB.value) {
        mongoHost = await prompts({
            type: "text",
            name: "value",
            message: "Enter the hostname of the MongoDB server"
        });
        mongoPort = await prompts({
            type: "number",
            name: "value",
            message: "Enter the port of the MongoDB server"
        });
        mongoDBName = await prompts({
            type: "text",
            name: "value",
            message: "Enter the database name you want Ararat to use on the MongoDB server"
        });
        mongoUsername = await prompts({
            type: "text",
            name: "value",
            message: "Enter the username to the MongoDB datbase"
        });
        mongoPassword = await prompts({
            type: "password",
            name: "value",
            message: "Enter the password to the MongoDB database"
        });
       }
       await log("Generating Environment Variables...")
       let mongoURI = `mongodb://${mongoUsername}:${mongoPassword}@${mongoHost}:${mongoPort}/${mongoDBName}`;
       let env = `DATABASE_URL=${mongoURI}\n`
       let key = '';
       let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
       
       while (key.length < 32) {
         key += characters.charAt(Math.floor(Math.random() * characters.length));
       }
    env+=`ENC_KEY=${key}\n`
    env+=`URL=${address.value}:${port.value}\n`
    fs.writeFileSync("./.env.local", env);
    await log("✅ Environment variables successfully generated");
    await log("Generating encryption keys...");
    const fs = require("fs");
const generateKeyPair = require("jose").generateKeyPair;
const exportJWK = require("jose").exportJWK;



    if (!fs.existsSync("./key")) {
        const keypair = await generateKeyPair("RS256");
        const jwk = await exportJWK(keypair.privateKey);
        fs.writeFileSync("./key", JSON.stringify(jwk));
        await log("✅ Encryption keys generated");
    };
    await log(`Ararat is all setup and ready to go! You can now create your first user account by running the command: node cli/createUser.js. To start Ararat, build it using the command: npm run build, then start it using the command: npm run start!`);






    
  }())

