import express from "express";

import { auth } from "../middleware/auth";
import { GetProblemBestResult, GetTotalResult } from "../util/result";
import server from "../config/server";

const router = express.Router();

router.get("/", auth, (req, res) => {
    GetTotalResult(req.user._id, server.contest.probList).then(
        (result) => res.send(result),
        () => res.sendStatus(400)
    );
});

router.get("/:prob_id", auth, (req, res) => {
    GetProblemBestResult(req.user._id, req.params.prob_id).then(
        (result) => res.send(result),
        () => res.sendStatus(400)
    );
});

export default router;
