"use strict";

const express = require("express");

const handler = require("serve-handler");

const local = require("../config/local");

const router = express.Router();

if (local.active)
    router.use(async (req, res) => {
        // req.url is not relative
        await handler(req, res, {
            public: local.folder
        });
    });

module.exports = router;
