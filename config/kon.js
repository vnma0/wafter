import { readFileSync, existsSync, writeFileSync } from "fs";
import { join } from "path";

import validUrl from "valid-url";

import { cwd } from "./cwd";
import Judger from "../driver/kon";

const konList = join(cwd, ".konlist");

const taskFile = join(cwd, "Tasks.zip");

// Setup konList
if (!existsSync(konList)) writeFileSync(konList, "");

// TODO: Validate
const serverList = readFileSync(konList, "utf8")
    .split(/\r\n|\n|\r/)
    .filter((s) => validUrl.isWebUri(s))
    .map((kon) => new Judger(kon));

console.log(serverList);

export default {
    judgers: serverList,
    tasks: taskFile
};
