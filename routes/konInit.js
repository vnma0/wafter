import express from "express";

import kon from "../config/kon";
import { initJudger } from "../controller/submitCode";
import { auth } from "../middleware/auth";

const router = express.Router();

router.get("/", auth, (req, res) => {
    if (req.user.isAdmin)
        try {
            initJudger(kon.tasks);
            res.sendStatus(200);
        } catch (err) {
            res.sendStatus(500);
        }
    else res.sendStatus(401);
});

export { router as konInit };
