import express from "express";
import { cwd } from "../config/cwd";
import { join } from "path";

const router = express.Router();

router.get("/", (req, res) => {
    res.sendFile(join(cwd, "info.md"));
});
