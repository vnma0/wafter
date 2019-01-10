import express from "express";

import { sendCode } from "../controller/submitCode";
import {
    readSubmission,
    readAllSubmissions,
    readUserSubmission
} from "../data/database";
import { auth } from "../middleware/auth";
import { codeUpload, validateCode } from "../middleware/upload";

const router = express.Router();

router.get("/", auth, (req, res) => {
    if (req.user.isAdmin)
        readAllSubmissions().then(
            (docs) => {
                res.send(docs);
            },
            (err) => {
                res.status(400).json(err);
            }
        );
    else
        readUserSubmission(req.user._id).then(
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

router.post("/", codeUpload, validateCode, (req, res) => {
    sendCode(req.file.path, req.user._id, req.file.originalname);
    res.sendStatus(200);
});

export { router as subs };
