"use strict";

const express = require("express");

const local = require("../config/local");

const router = express.Router();

if (local.active) router.use(express.static(local.folder));

module.exports = router;
