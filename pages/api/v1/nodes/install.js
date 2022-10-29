export default function handler(req, res) {
    console.log(req.query)
    let command = "node setup/setup.js";
    command += " --panel_url " + process.env.PANEL_URL;
    if (req.query.ssl) {
        if (req.query.ssl == "true") {
            command += " --ssl";
            command += " --domain " + req.query.nodeAddress;
        }
    }
    command += " --port " + req.query.port;
    return res.status(200).send(command)
}
