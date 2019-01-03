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
        () => {
            res.sendStatus(500);
        }
    );
});

router.get("/:userid", auth, (req, res) => {
    if (req.user.id !== req.params.userid) res.sendStatus(403).end();
    readUser(req.params.userid).then(
        (docs) => {
            res.send(docs);
        },
        () => {
            res.sendStatus(500);
        }
    );
});

export { router as users };
