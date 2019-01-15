import express from "express";

import auth from "../middleware/auth";
import scoreboard from "../util/scoreboard";

const router = express.Router();

router.get("/", auth, (req, res) => {
    scoreboard(req.user._id).then(
        (result) => res.send(result),
        () => res.sendStatus(500)
    );
});

export default router;
