const express = require("express");
const next = require("next");

const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const url = process.env.URL;
const app = next({ dev })
const handle = app.getRequestHandler()
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
require("dotenv").config({ "path": "./.env.local" })
const mongo = require("./src/lib/mongo")

const proxy = require("express-http-proxy");
const { exec } = require("child_process");
app.prepare().then(() => {
    const usersCollection = mongo.db().collection("User")
    const server = express()

    server.use(bodyParser.json())
    server.use(cookieParser())
    
    server.all('*', async (req, res) => {
        if (req.url.startsWith("/.well-known") || req.url.startsWith("/oidc")) {
            // do same request on :3002
            return proxy(`http://${process.env.URL.split(":")[0]}:3002`, {
                proxyReqPathResolver: (req) => {
                    return req.url;
                },
                proxyReqBodyDecorator: (bodyContent, srcReq) => {
                    srcReq.headers["host"] = process.env.URL;
                    return bodyContent;
                },
                proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
                    proxyReqOpts.headers["host"] = process.env.URL;
                    return proxyReqOpts;
                }
            })(req, res)
        }
        return handle(req, res)
    })
    server.listen(port, (err) => {
        if (err) throw err
        console.log(`> Hye Ararat is running on https://${process.env.URL}`)
    })
    exec(`node ./authentication.js`, (err, stdout, stderr) => {
        if (err) {
            console.log(err);
            return;
        }
        console.log(stdout);
        console.log(stderr);
    })
})
