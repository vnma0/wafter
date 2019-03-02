"use strict";

const validUrl = require("valid-url");

const parseProbList = require("../parseProbList");
const Config = require("../config");

/**
 * Parse & validate Kon config data into formatted one
 * @param {Array} configData
 */
function parseKonConfig(configData) {
    if (!Array.isArray(configData)) throw new Error("Invalid Kon config data");

    const includesUrlValue = (arr, val) => {
        for (let kon of arr) if (kon.url === val) return true;
        return false;
    };

    return configData
        .reduce((arr, kon) => {
            kon.url = String(kon.url).toLowerCase();
            if (kon.url && !includesUrlValue(arr, kon.url)) arr.push(kon);
            return arr;
        }, [])
        .filter((kon) => validUrl.isWebUri(kon.url))
        .map((kon) => ({
            url: kon.url,
            prob: parseProbList(kon.prob)
        }));
}

module.exports = new Config("kon.json", parseKonConfig, () => "[]");
