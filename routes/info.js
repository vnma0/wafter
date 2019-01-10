import express from "express";

import { contestConfig } from "../config/server";

const router = express.Router();

router.get("/", (req, res) => {
    res.sendFile(contestConfig);
});

export { router as info };
