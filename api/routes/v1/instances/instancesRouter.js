import express from "express";
import files from "./[name]/files.js";
import state from "./[name]/state.js";
import console from "./[name]/console.js";

const router = express.Router({ mergeParams: true });

router.use("/:name/files", files);
router.use("/:name/console", console)
router.use("/:name/state", state)

export default router;