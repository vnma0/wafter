import express from "express";

import { readAllUser, readUserByID } from "../data/database";
import { auth } from "../middleware/auth";

const router = express.Router();

/**
 * GET /users
 * If Admin -> show all user
 * If user -> redirect to user
 */
router.get("/", auth, (req, res) => {
    if (req.user.isAdmin)
        readAllUser().then(
            (docs) => {
                res.send(docs);
            },
            (err) => {
                res.status(400).json(err);
            }
        );
    else res.redirect(req.baseUrl + "/" + req.user._id);
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

export { router as users };
