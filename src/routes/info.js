"use strict";

const express = require("express");

const contest = require("../config/contest");

const router = express.Router();

router.get("/", (req, res) => {
    res.json(contest);
});

module.exports = router;
