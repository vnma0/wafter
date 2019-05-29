"use strict";

const express = require("express");
const { existsSync } = require("fs");

const { sendCode } = require("../controller/submitCode");
const {
    readSubmission,
    readAllSubmissions,
    readUserSubmission,
    readSubmissionSrc
} = require("../data/database");
const auth = require("../middleware/auth");
const bruteForce = require("../middleware/bruteForce");
const upload = require("../middleware/upload");
const contestIsRunning = require("../middleware/time");

const router = express.Router();

const bruteMiddleware =
    process.env.NODE_ENV === "production" ? [bruteForce.prevent] : [];

router.use(auth);

router
    .route("/")
    .get((req, res) => {
        let { page, size, count } = req.query;

        page = Number(page);
        size = Number(size);
        count = Number(count);

        if (req.user.isAdmin)
            readAllSubmissions(page, size, count).then(
                (docs) => {
                    res.send(docs);
                },
                (err) => {
                    res.status(400).json(err.message);
                }
            );
        else
            readUserSubmission(req.user._id, page, size, count).then(
                (docs) => {
                    res.send(docs);
                },
                (err) => {
                    res.status(400).json(err.message);
                }
            );
    })
    .post(contestIsRunning, ...bruteMiddleware, upload, (req, res) => {
        const file = req.file;
        sendCode(file.path, req.user._id, file.originalname).then(
            () => res.sendStatus(200),
            () => res.sendStatus(400)
        );
    });

router.get("/:id", (req, res) => {
    readSubmission(req.params.id).then(
        (docs) => {
            if (docs.user_id === req.user._id || req.user.isAdmin)
                res.send(docs);
            else res.sendStatus(401);
        },
        (err) => {
            res.status(400).json(err.message);
        }
    );
});

router.get("/:id/source", (req, res) => {
    readSubmissionSrc(req.params.id)
        .then((docs) => {
            if (docs.user_id === req.user._id || req.user.isAdmin) {
                if (!existsSync(docs.source_code)) res.sendStatus(404);
                else
                    res.download(
                        docs.source_code,
                        "".concat(docs._id, docs.ext.toLowerCase())
                    );
            } else res.sendStatus(401);
        })
        .catch((err) => {
            res.status(400).json(err.message);
        });
});

module.exports = router;
