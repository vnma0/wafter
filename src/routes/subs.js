"use strict";

const express = require("express");

const { sendCode } = require("../controller/submitCode");
const {
    readSubmission,
    readAllSubmissions,
    readUserSubmission
} = require("../data/database");
const auth = require("../middleware/auth");
const bruteForce = require("../middleware/bruteForce");
const upload = require("../middleware/upload");
const contestIsRunning = require("../middleware/time");

const router = express.Router();

router.use(auth);

router
    .route("/")
    .get((req, res) => {
        let { page, count, size } = req.query;

        page = Number(page);
        count = Number(count);
        size = Number(size);

        if (req.user.isAdmin)
            readAllSubmissions(page, count, size).then(
                (docs) => {
                    res.send(docs);
                },
                (err) => {
                    res.status(400).json(err.message);
                }
            );
        else
            readUserSubmission(req.user._id, page, count, size).then(
                (docs) => {
                    res.send(docs);
                },
                (err) => {
                    res.status(400).json(err.message);
                }
            );
    })
    .post(contestIsRunning, bruteForce.prevent, upload, (req, res) => {
        const file = req.file;
        sendCode(file.path, req.user._id, file.originalname).then(
            () => res.sendStatus(200),
            () => res.sendStatus(400)
        );
    });

router.get("/:id", (req, res) => {
    readSubmission(req.params.id).then(
        (docs) => {
            if (docs.user_id === req.user._id) res.send(docs);
            else res.sendStatus(401);
        },
        (err) => {
            res.status(400).json(err.message);
        }
    );
});

module.exports = router;
