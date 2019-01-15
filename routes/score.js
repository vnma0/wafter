import express from "express";

import auth from "../middleware/auth";
import result from "../util/result";
import contest from "../config/contest";

const router = express.Router();

router.get("/", auth, (req, res) => {
    result.GetTotalResult(req.user._id, contest.probList).then(
        (result) => res.send(result),
        () => res.sendStatus(500)
    );
});

router.get("/:prob_id", auth, (req, res) => {
    result.GetProblemBestResult(req.user._id, req.params.prob_id).then(
        (result) => res.send(result),
        () => res.sendStatus(500)
    );
});

export default router;
