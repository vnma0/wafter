"use strict";

const express = require("express");
const { existsSync } = require("fs");
const { basename, extname } = require("path");

const {
    readSubmission,
    readAllSubmissions,
    readUserSubmission,
    readSubmissionSrc,
    newSubmission
} = require("../controller/database");
const Kon = require("../controller/kon");
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
                docs => {
                    res.send(docs);
                },
                err => {
                    res.status(400).json(err.message);
                }
            );
        else
            readUserSubmission(req.user._id, page, size, count).then(
                docs => {
                    res.send(docs);
                },
                err => {
                    res.status(400).json(err.message);
                }
            );
    })
    .post(contestIsRunning, ...bruteMiddleware, upload, async (req, res) => {
        const file = req.file;
        const file_name = file.originalname;
        const user_id = req.user._id;

        const code_ext = extname(file_name);
        const prob_id = basename(file_name, code_ext);

        try {
            const sub_id = await newSubmission(
                file.path,
                code_ext,
                user_id,
                prob_id
            );
            const success = Kon.sendCode(file.path, file_name, sub_id);
            if (success) {
                res.sendStatus(200);
            } else {
                res.sendStatus(503);
            }
        } catch (err) {
            res.sendStatus(500);
        }
    });

router.get("/:id", (req, res) => {
    readSubmission(req.params.id).then(
        docs => {
            if (docs.user_id === req.user._id || req.user.isAdmin)
                res.send(docs);
            else res.sendStatus(401);
        },
        err => {
            res.status(400).json(err.message);
        }
    );
});

router.get("/:id/source", (req, res) => {
    readSubmissionSrc(req.params.id)
        .then(docs => {
            if (docs.user_id === req.user._id || req.user.isAdmin) {
                if (!existsSync(docs.source_code)) res.sendStatus(404);
                else
                    res.download(
                        docs.source_code,
                        "".concat(docs._id, docs.ext.toLowerCase())
                    );
            } else res.sendStatus(401);
        })
        .catch(err => {
            res.status(400).json(err.message);
        });
});

module.exports = router;
