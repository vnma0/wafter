"use strict";

const express = require("express");

const {
    readUserByID,
    updateUserPassword,
    newUser
} = require("../controller/database");
const auth = require("../middleware/auth");
const bruteForce = require("../middleware/bruteForce");
const contest = require("../config/contest");

const router = express.Router();

router.post("/", bruteForce, async (req, res) => {
    if ((req.user && req.user.isAdmin) || contest.allowEveryoneReg) {
        const form = req.body;
        try {
            await newUser(form.username, form.password);
            res.sendStatus(200);
        } catch (err) {
            res.status(400).json({ err: err.message });
        }
    } else res.sendStatus(401);
});

router.use(auth);

/**
 * GET /users
 * If user -> redirect to user
 */
router.get("/", (req, res) => {
    res.redirect(req.baseUrl + "/" + req.user._id);
});

const verifyUserId = (req, res, next) => {
    if (req.user._id !== req.params.userid) res.sendStatus(403);
    else next();
};

router.get("/:userid", verifyUserId, (req, res) => {
    const userId = req.user._id;
    readUserByID(userId).then(
        (docs) => {
            res.send(docs);
        },
        (err) => {
            res.status(400).json({ err: err.message });
        }
    );
});

router.put("/:userid/password", verifyUserId, (req, res) => {
    // Allow changing password only
    const user = req.user;
    const form = req.body;
    if (form.password === form.newPassword)
        res.status(400).json({
            err: "New password cannot be the same with old password",
        });
    else
        updateUserPassword(user._id, form.password, form.newPassword)
            .then((docs) => {
                // Logout after successfully changing password
                req.logout();
                res.send(docs);
            })
            .catch((err) => {
                res.status(400).json({ err: err.message });
            });
});

module.exports = router;
