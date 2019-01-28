const { readFileSync, existsSync, writeFileSync, mkdirSync } = require("fs");

const validUrl = require("valid-url");

const Judger = require("../driver/kon");
const parseProbList = require("../util/parseProbList");

const konListFile = "kon.json";

// Require valid folder to work
const taskFolder = "Tasks";

if (!existsSync(konListFile)) mkdirSync(taskFolder);

// Setup konList
if (!existsSync(konListFile)) writeFileSync(konListFile, "[]");

// TODO: Validate
let rawServerList = JSON.parse(readFileSync(konListFile, "utf8"));

// Try manage error
if (!Array.isArray(rawServerList)) rawServerList = [rawServerList];

const konList = rawServerList
    .filter((kon) => validUrl.isWebUri(kon.url))
    .map((kon) => new Judger(kon.url, parseProbList(kon.prob)));

module.exports = {
    judgers: konList,
    tasks: taskFolder
};
