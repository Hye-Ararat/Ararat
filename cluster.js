const axios = require("axios").default;
const {readFileSync, writeFileSync} = require("fs");
const {execSync}= require("child_process");

(async function cluster() {
    const requestClient = new axios.Axios({
        socketPath: "/var/snap/lxd/common/lxd/unix.socket"
    })
    let data = await requestClient.get("/1.0");
    console.log(JSON.parse(data.data))
    let preseed = readFileSync("./preseed.yaml", "utf8");
    writeFileSync("./preseed.yaml", preseed.replace("addressHere", "103.70.39.84:8443").replace("serverNameHere", "Development"))
    let yes = execSync("cat preseed.yaml | lxd init --preseed")
    console.log(yes.toString())

console.log("e")
})()