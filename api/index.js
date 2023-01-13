import { spawn } from "child_process";
import express from "express";
import cors from "cors";
//import launchSFTP from "./lib/sftp.js"

export default async () => {
    const app = express();
    (await import("express-ws")).default(app);
    app.use(cors());
    app.use("*", (req, res, next) => {
console.log(req.path)

    return next();
})
    //spawn("./Hye_Lava");
    const apiRouter = (await import("./routes/apiRouter.js"));
    app.use("/", apiRouter.default);
    app.listen(process.env.PORT ? parseInt(process.env.PORT) : 3001);
};
