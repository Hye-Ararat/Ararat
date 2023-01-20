const axios = require("axios").default;
const ws = require("ws").WebSocket;

(async function cluster() {
    let addr = process.argv[2];
    let name = process.argv[3];
      const requestClient = new axios.Axios({
        socketPath: "/var/snap/lxd/common/lxd/unix.socket",
        headers: {
            "Content-Type": "application/json",
        }
    })
    let data = await requestClient.get("/1.0");
    console.log(JSON.parse(data.data))
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
    console.log("💻 Connecting to Events Socket");
    const WebSocket = new ws("ws+unix:///var/snap/lxd/common/lxd/unix.socket:/1.0/events");
    WebSocket.on("open", () => {
        console.log("WebSocket Open")
    })
    WebSocket.on("message", (data) => {
        let message = JSON.parse(data.toString());
        try {
            if (message.type == "operation") {
                if (message.metadata.context.description == "Creating bootstrap node") {
                    if (message.metadata.message == "Success for operation") {
                        console.log("💻 Cluster Created");
                        WebSocket.close();
                        process.exit(0);
                    }
                }
            }   
        } catch (error) {
            
        }
    })

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

})()