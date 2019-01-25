import express from "express";

import { sendCode } from "../controller/submitCode";
import {
    readSubmission,
    readAllSubmissions,
    readUserSubmission
} from "../data/database";
import auth from "../middleware/auth";
import bruteForce from "../middleware/bruteForce";
import upload from "../middleware/upload";
import contestIsRunning from "../middleware/time";

const router = express.Router();

router.get("/", auth, (req, res) => {
    const page = Number(req.query.page);
    if (req.user.isAdmin)
        readAllSubmissions(page).then(
            (docs) => {
                res.send(docs);
            },
            (err) => {
                res.status(400).json(err);
            }
        );
    else
        readUserSubmission(req.user._id, page).then(
            (docs) => {
                res.send(docs);
            },
            (err) => {
                res.status(400).json(err);
            }
        );
});

router.get("/:id", auth, (req, res) => {
    readSubmission(req.params.id).then(
        (docs) => {
            if (docs.user_id === req.user._id) res.send(docs);
            else res.sendStatus(401);
        },
        (err) => {
            res.status(400).json(err);
        }
    );
});

router.post(
    "/",
    auth,
    contestIsRunning,
    bruteForce.prevent,
    upload,
    (req, res) => {
        const file = req.file;
        sendCode(file.path, req.user._id, file.originalname).then(
            () => res.sendStatus(200),
            () => res.sendStatus(500)
        );
    }
);

export default router;
