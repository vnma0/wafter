import express from "express";
import { readSubmission, readAllSubmission } from "../data/database";

const router = express.Router();

router.get("/", (req, res) => {
    readAllSubmission().then(
        (docs) => {
            res.send(docs);
        },
        (err) => {
            res.sendStatus(500);
        }
    );
});

router.get("/:id", (req, res) => {
    readSubmission(req.params.id).then(
        (docs) => {
            res.send(docs);
        },
        (err) => {
            res.sendStatus(500);
        }
    );
});

export { router as subs };
