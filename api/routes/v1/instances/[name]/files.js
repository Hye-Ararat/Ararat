import axios from "axios";
import express from "express";
import http from "http";

const router = express.Router({ mergeParams: true });


router.get("/", async (req, res) => {
    const { name } = req.params;
    const { path } = req.query;
    const authorization = req.headers.authorization;
    let permissions = await axios.get("http://127.0.0.1:3000" + "/api/v1/instances/" + name + "/permissions", {
        headers: {
            Authorization: authorization
        }
    })
    permissions = permissions.data;
    if (!permissions.includes("read-files_instance")) {
        return res.status(401).send("Unauthorized");
    }
    const options = {
        socketPath: './lava.sock',
        path: `/sftp?instance=${name}&path=${encodeURI(path)}`,
    };
    const clientRequest = http.request(options, response => {
        response.setEncoding("utf8");
        Object.keys(response.headers).forEach(key => {
            res.setHeader(key, response.headers[key]);
        });
        response.on("data", data => {
            if (data == "File Does Not Exist") {
                return res.status(400).send(data);
            }
            if (!(data == "null")) {
                res.write(data);
            } else {
                return res.send([]);
            }
        })
        response.on("close", () => {
            res.end();
        })
        response.on("error", data => {
            res.status(500).send(data);
        });
    });
    clientRequest.end();
});

export default router;