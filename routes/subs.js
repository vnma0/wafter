import express from "express";
import { readSubmission, readAllSubmission } from "../data/database";
import { auth } from "../middleware/auth";

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

router.post("/", auth, (req, res) => {
    // TODO: add multer middleware
    console.log(req.files);
    res.sendStatus(200);
});

export { router as subs };
