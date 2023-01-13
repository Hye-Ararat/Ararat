import express from "express";
import instancesRouter from "./instances/instancesRouter.js";
import update from "./update.js";
import system from "./system.js"

const router = express.Router();
router.use("/instances", instancesRouter);
router.get("/update", update);
router.get("/system", system)

export default router;