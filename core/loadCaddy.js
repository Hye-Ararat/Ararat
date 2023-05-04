const axios = require("axios");
const {readFileSync, readdirSync, copyFileSync} = require("fs");
//const {connectUnix} = require("lxd.js")

(async function loadCaddy() {
    let config = readFileSync("../caddyConfig.json", "utf8");
    await axios.default.post("http://127.0.0.1:2019/load", JSON.parse(config));
    config = JSON.parse(config);
  //  let host = config.apps.http.servers.ararat.routes[0].match[0].host[0];
   // let certsDir = `/var/lib/caddy/.local/share/caddy/certificates/acme-v02.api.letsencrypt.org-directory/${host}`;
   // copyFileSync(`${certsDir}/${host}.crt`, `/usr/lib/ararat/tempCert.crt`);
   // copyFileSync(`${certsDir}/${host}.key`, `/usr/lib/ararat/tempCert.key`); 
    console.log("✅ Caddy Config Loaded")
})()