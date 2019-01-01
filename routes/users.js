import express from "express";
import { readUser, readAllUser } from "../data/database";
import { auth } from "../middleware/auth";

const router = express.Router();

router.get("/", (req, res) => {
    // TODO: Hide this route
    readAllUser().then(
        (docs) => {
            res.send(docs);
        },
        (err) => {
            res.sendStatus(500);
        }
    );
});

router.get("/:username", auth, (req, res) => {
    if (req.user.id !== req.params.username) res.sendStatus(403).end();
    readUser(req.params.username).then(
        (docs) => {
            res.send(docs);
        },
        (err) => {
            res.sendStatus(500);
        }
    );
});

export { router as users };
