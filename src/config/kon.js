import { readFileSync, existsSync, writeFileSync, mkdirSync } from "fs";

import validUrl from "valid-url";

import Judger from "../driver/kon";
import parseProbList from "../util/parseProbList";

const konListFile = "kon.json";

// Require valid folder to work
const taskFolder = "Tasks";

if (!existsSync(konListFile)) mkdirSync(taskFolder);

// Setup konList
if (!existsSync(konListFile)) writeFileSync(konListFile, "[]");

let rawServerList = JSON.parse(readFileSync(konListFile, "utf8"));

// Try manage error
if (!Array.isArray(rawServerList)) rawServerList = [rawServerList];

const konList = rawServerList
    .filter((kon) => validUrl.isWebUri(kon.url))
    .map((kon) => new Judger(kon.url, parseProbList(kon.prob)));

export default {
    judgers: konList,
    tasks: taskFolder
};
