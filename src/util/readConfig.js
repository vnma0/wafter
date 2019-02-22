"use strict";

const { readFileSync } = require("fs");

/**
 * Read Config File
 * @param {String} configFile File name
 */
function readConfig(configFile) {
    try {
        return JSON.parse(readFileSync(configFile, "utf8"));
    } catch (err) {
        throw new Error(`Cannot read config file: "${configFile}."`);
    }
}

module.exports = readConfig;
