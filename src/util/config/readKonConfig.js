"use strict";

const { existsSync, writeFileSync } = require("fs");

const validUrl = require("valid-url");

const Judger = require("../../driver/kon");
const parseProbList = require("../parseProbList");
const readConfig = require("../readConfig");

/**
 * Read kon config
 * @param {String} konListFile Filename
 */
function KonConfig(konListFile) {
    try {
        // Setup konList
        if (!existsSync(konListFile)) writeFileSync(konListFile, "[]");

        let rawServerList = readConfig(konListFile);

        const konList = rawServerList
            .filter((kon) => validUrl.isWebUri(kon.url))
            .map((kon) => new Judger(kon.url, parseProbList(kon.prob)));

        return konList;
    } catch (err) {
        throw new Error(`Failed to read config for Kon: ${err.message}`);
    }
}

module.exports = KonConfig;
