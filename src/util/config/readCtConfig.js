"use strict";

const score = require("../score");
const readConfig = require("../readConfig");

/**
 * Parse ISO 8601 into Date object
 * @param {String} timeData ISO 8601 String
 */
function parseTime(timeData) {
    // Must be a number
    if (new Date(timeData).toJSON() !== timeData)
        throw new Error("Invalid Time");
    else return new Date(timeData);
}

/**
 * Parse Problem List
 * @param {Array} container
 */
function parseContainer(container) {
    if (!Array.isArray(container)) throw new Error("Invalid Container");
    return container
        .map((x) => String(x).toUpperCase())
        .sort((a, b) => a.localeCompare(b));
}

/**
 * Parse & validate contest config data into formatted one
 * @param {Object} configData
 */
function parseCtCfg(configData) {
    let {
        name,
        startTime,
        endTime,
        mode,
        probList,
        allowedCodeExt
    } = configData;

    name = String(name);
    mode = String(mode);
    if (!score.hasOwnProperty(mode)) throw new Error("Invalid mode");

    startTime = parseTime(startTime);
    endTime = parseTime(endTime);

    if (startTime >= endTime) throw new Error("Start time is after end time");

    return {
        name: name,
        mode: mode,
        startTime: startTime,
        endTime: endTime,
        probList: parseContainer(probList),
        allowedCodeExt: parseContainer(allowedCodeExt)
    };
}

/**
 * Read Config from contest.json
 */
function contestConfig() {
    const ctCfgFile = "contest.json";
    try {
        return parseCtCfg(readConfig(ctCfgFile));
    } catch (err) {
        throw new Error(`Invalid contest file (${ctCfgFile}): ${err.message}`);
    }
}

module.exports = {
    config: contestConfig,
    parse: parseCtCfg
};