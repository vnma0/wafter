"use strict";

const { existsSync, writeFileSync } = require("fs");

const validUrl = require("valid-url");

const Judger = require("../../driver/kon");
const parseProbList = require("../parseProbList");
const readConfig = require("../readConfig");

/**
 * Parse & validate Kon config data into formatted one
 * @param {Array} configData
 */
function parseKonConfig(configData) {
    if (!Array.isArray(configData)) throw new Error("Invalid Kon config data");
    return configData
        .filter((kon) => validUrl.isWebUri(kon.url))
        .map((kon) => new Judger(kon.url, parseProbList(kon.prob)));
}

/**
 * Read kon config
 */
function KonConfig() {
    const konListFile = "kon.json";
    try {
        // Pre-create konList
        if (!existsSync(konListFile)) writeFileSync(konListFile, "[]");

        return parseKonConfig(readConfig(konListFile));
    } catch (err) {
        throw new Error(`Failed to read config for Kon: ${err.message}`);
    }
}

module.exports = {
    config: KonConfig,
    parse: parseKonConfig
};
