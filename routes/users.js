import express from "express";
import { readAllUser, readUserByID } from "../data/database";
import { auth } from "../middleware/auth";

const router = express.Router();

/**
 * GET /users
 * If Admin -> show all user
 * If user -> redirect to user
 */
router.get("/", (req, res) => {
    if (req.user.isAdmin)
        readAllUser().then(
            (docs) => {
                res.send(docs);
            },
            () => {
                res.sendStatus(500);
            }
        );
    else res.redirect(req.baseUrl + "/" + req.user._id);
});

router.get("/:userid", (req, res) => {
    const userId = req.user._id;
    if (userId !== req.params.userid) res.sendStatus(403);
    readUserByID(userId).then(
        (docs) => {
            res.send(docs);
        },
        (err) => {
            res.json(err);
        }
    );
});

export { router as users };
