import express from "express";

import contest from "../config/contest";

const router = express.Router();

router.get("/", (req, res) => {
    res.json(contest);
});

export default router;
