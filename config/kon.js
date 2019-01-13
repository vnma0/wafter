import { readFileSync, existsSync, writeFileSync, mkdirSync } from "fs";
import { join } from "path";

import validUrl from "valid-url";

import { cwd } from "./cwd";
import Judger from "../driver/kon";

const konList = join(cwd, "kon.json");

// Require valid folder to work
const taskFolder = join(cwd, "Tasks");

if (!existsSync(konList)) mkdirSync(taskFolder);

// Setup konList
if (!existsSync(konList)) writeFileSync(konList, "[]");

// TODO: Validate
let rawServerList = JSON.parse(readFileSync(konList, "utf8"));

// Try manage error
if (!Array.isArray(rawServerList)) rawServerList = [rawServerList];

const serverList = rawServerList
    .filter((s) => validUrl.isWebUri(s.url))
    .map((kon) => new Judger(kon.url, kon.prob));

export default {
    judgers: serverList,
    tasks: taskFolder
};
