import axios from "axios";
import express from "express";
import v1router from "./v1/v1router.js";
import * as dotenv from "dotenv";
import {readFileSync} from "fs"
import {verify} from "jsonwebtoken";
import cookieParser from "cookie-parser";

dotenv.config({path: "../.env.local"})

const router = express.Router();
router.use(cookieParser())
router.use("*", async (req, res, next) => {
    async function verifyToken(token) {
    let allowed;
    try {
        allowed = verify(token, process.env.ENC_KEY)
    } catch (error) {
        console.log("error", error)
        allowed = false
    }
    if (token == process.env.COMMUNICATION_KEY) allowed = true;
    return allowed;
    
}
if (req.headers["authorization"] ) req.headers["Authorization"] = req.headers["authorization"]
if (!req.headers["Authorization"] && req.cookies.authorization) {
    req.headers["Authorization"] = "Bearer " + req.cookies.authorization
}
let allowed = await verifyToken(req.headers["Authorization"] ? req.headers["Authorization"].split(" ")[1] : req.cookies.authorization ? req.cookies.authorization : "")
if (allowed) return next();
return res.status(401).send({"type":"error","error":"Failure","error_code":400,"metadata":"You are not allowed to access this resource"})
})
router.use("/api/v1", v1router);
router.get("/", (req, res) => {
    res.send("Hye Lava API v1");
})

export default router;