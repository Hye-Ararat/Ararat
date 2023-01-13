import os from "os";
export default async function system(req, res) {
    res.send({
        "hostname": os.hostname(),
        "platform": os.platform(),
        "arch": os.arch(),
        "release": os.release(),
        "uptime": os.uptime(),
        "loadavg": os.loadavg(),
        "totalmem": os.totalmem(),
        "freemem": os.freemem(),
        "cpus": os.cpus(),
        "type": os.type(),
    })
}