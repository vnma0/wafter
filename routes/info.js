import express from "express";

import server from "../config/server";

const router = express.Router();

router.get("/", (req, res) => {
    res.json(server.contest);
});

export default router;
