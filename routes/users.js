import express from "express";
import { readUser, readAllUser } from "../data/database";

const router = express.Router();

router.get("/", (req, res) => {
    readAllUser().then(
        (docs) => {
            res.send(docs);
        },
        (err) => {
            res.sendStatus(500);
        }
    );
});

router.get("/:username", (req, res) => {
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
