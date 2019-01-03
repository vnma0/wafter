import express from "express";
import { readSubmission, readAllSubmission } from "../data/database";
import { auth } from "../middleware/auth";
import { codeUpload, validateCode } from "../middleware/upload";
import { sendCode } from "../controller/submitCode";

const router = express.Router();

router.get("/", (req, res) => {
    readAllSubmission().then(
        (docs) => {
            res.send(docs);
        },
        () => {
            res.sendStatus(500);
        }
    );
});

router.get("/:id", (req, res) => {
    readSubmission(req.params.id).then(
        (docs) => {
            res.send(docs);
        },
        () => {
            res.sendStatus(500);
        }
    );
});

router.post("/", auth, codeUpload, validateCode, (req, res) => {
    sendCode(req.file.path, req.user._id, req.file.originalname);
    res.sendStatus(200);
});

export { router as subs };
