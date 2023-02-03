const axios = require("axios");
const {readFileSync} = require("fs");

(async function loadCaddy() {
    let config = readFileSync("./caddyConfig.json", "utf8");
    axios.default.post("http://127.0.0.1:2019/load", JSON.parse(config));
    console.log("✅ Caddy Config Loaded")
})()