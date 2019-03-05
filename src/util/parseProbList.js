"use strict";

const contestConfig = require("../util/config/contestConfig");

/**
 * parseProbList
 * @param {Array} obj Array of problem included in kon.json
 */
function parseProbList(obj) {
    const probList = contestConfig.read().probList;
    if (obj === undefined) return probList;

    if (!Array.isArray(obj)) return [];
    const out = probList.filter((x) => obj.indexOf(x) > -1);

    return out;
}

module.exports = parseProbList;
