export default function handler(req, res) {
    console.log(req.query)
    let command = "node setup/setup.js";
    command += " --panel_url " + process.env.PANEL_URL;
    if (req.query.ssl) {
        if (req.query.ssl == "true") {
            command += " --ssl";
            command += " --address " + req.query.nodeAddress;
            command += " --ssl_cert_path " + req.query.ssl_cert_path;
            command += " --ssl_key_path " + req.query.ssl_key_path;
        }
    }
    command += " --port " + req.query.port;
    return res.status(200).send(command)
}
