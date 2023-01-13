import express from "express";
import newNode from "./new.js";

const router = express.Router({ mergeParams: true });


router.use("/new", newNode);

export default router;