import express from "express";

import { readUserByID } from "../data/database";
import auth from "../middleware/auth";

const router = express.Router();

/**
 * GET /users
 * If user -> redirect to user
 */
router.get("/", auth, (req, res) => {
    res.redirect(req.baseUrl + "/" + req.user._id);
});

router.get("/:userid", auth, (req, res) => {
    const userId = req.user._id;
    if (userId !== req.params.userid) res.sendStatus(403);
    readUserByID(userId).then(
        (docs) => {
            res.send(docs);
        },
        (err) => {
            res.status(400).json(err);
        }
    );
});

export default router;

