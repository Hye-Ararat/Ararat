const axios = require("axios").default;
require('dotenv').config({ path: ".env.local" });

(async function cluster() {
    let addr = process.argv[2];
    let name = process.argv[3];
    let mode = process.argv[4] ? process.argv[4] : false;
    console.log(mode)
    const requestClient = new axios.Axios({
        socketPath: "/var/snap/lxd/common/lxd/unix.socket",
        headers: {
            "Content-Type": "application/json",
        }
    })
    let data = await requestClient.get("/1.0");
    console.log(JSON.parse(data.data))
    data = JSON.parse(data.data)
    if (!mode) {
        console.log("💻 Setting Listen Config");
        let config;
        try {
            config = await requestClient.put("/1.0", JSON.stringify({
                "config": {
                    "cluster.https_address": `${addr}:8443`,
                    "core.https_address": `${addr}:8443`
                }
            }))
        } catch (error) {
            return console.log(error)
        }
        console.log(config.data);


        console.log("💻 Setting Cluster Config");
        let clusterConfig;
        try {
            clusterConfig = await requestClient.put("/1.0/cluster", JSON.stringify({
                "server_name": `${name}`,
                "enabled": true,
                "member_config": null,
                "cluster_address": "",
                "cluster_certificate": "",
                "server_address": "",
                "cluster_password": ""
            })
            )
        } catch (error) {
            return console.log(error)
        }
        console.log(clusterConfig.data);
    } else {
        let certificate = data.metadata.environment.certificate.split("-----BEGIN CERTIFICATE-----\n")[1].split("\n-----END C")[0];
        let info = await axios.post(`${mode}/api/v1/system/join`, JSON.stringify({
            name: name,
            certificate: certificate
        }), {
            headers: {
                "Authorization": `Bearer ${process.env.COMMUNICATION_KEY}`
            }
        })
        let joinToken = info.data.metadata.joinToken
        let joinCluster = await requestClient.put("/1.0/cluster", JSON.stringify({
            "server_name": name,
            "enabled": true,
            "member_config": [],
            "cluster_address": `${addr}:8443`,
            "cluster_certificate": data.metadata.environment.certificate,
            "server_address": `${addr}:8443`,
            "cluster_password": ""
        }))
        console.log(joinCluster)
    }

})()