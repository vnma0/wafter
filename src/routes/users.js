"use strict";

const express = require("express");

const { readUserByID, updateUserPassword } = require("../data/database");
const auth = require("../middleware/auth");

const router = express.Router();

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
            res.status(400).json(err.message);
        }
    );
});

router.put("/:userid/password", verifyUserId, (req, res) => {
    // Allow changing password only
    const user = req.user;
    const form = req.body;
    if (form.password === form.newPassword)
        res.status(400).send(
            "New password cannot be the same with old password"
        );
    else
        updateUserPassword(user._id, form.password, form.newPassword)
            .then((docs) => {
                // Logout after successfully changing password
                req.logout();
                res.send(docs);
            })
            .catch((err) => {
                res.status(400).json(err.message);
            });
});

module.exports = router;
