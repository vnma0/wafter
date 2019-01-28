const { readFileSync, writeFileSync } = require("fs");
const sampleContest = require("./sampleContest");
const score = require("../util/score");

const contestConfig = "contest.json";

let contestObj;
let name, startTime, endTime, mode, probList, allowedCodeExt;

try {
    contestObj = JSON.parse(readFileSync(contestConfig));
} catch (err) {
    if (err.code === "ENOENT") {
        writeFileSync(contestConfig, JSON.stringify(sampleContest, null, 4));
        throw new Error(
            "No contest file found. Wafter just created a sample one for you"
        );
    }

    throw new Error(`Cannot read contest file. (${contestConfig}).`);
}

try {
    ({ name, startTime, endTime, mode, probList, allowedCodeExt } = contestObj);

    if (allowedCodeExt === undefined)
        allowedCodeExt = sampleContest.allowedCodeExt;

    if (
        !Array.isArray(startTime) ||
        !Array.isArray(endTime) ||
        !Array.isArray(probList) ||
        !Array.isArray(allowedCodeExt)
    )
        throw new Error();
    if (!name || !mode) throw new Error();
    if (!score.hasOwnProperty(mode)) throw new Error();

    startTime = new Date(...startTime);
    endTime = new Date(...endTime);

    if (startTime >= endTime) throw new Error();
} catch (err) {
    throw new Error(`Invalid contest file (${contestConfig})`);
}

probList = probList.map((x) => String(x).toUpperCase());

module.exports = {
    // Change this to config contest time
    name: name,
    startTime: startTime,
    endTime: endTime,
    mode: mode,
    probList: probList,
    allowedCodeExt: allowedCodeExt
};
