import { readFileSync, existsSync, writeFileSync, mkdir } from "fs";
import { join } from "path";

import validUrl from "valid-url";

import { cwd } from "./cwd";
import Judger from "../driver/kon";

const konList = join(cwd, ".konlist");

// Require valid folder to work
const taskFolder = join(cwd, "Tasks");
mkdir(taskFolder, (err) => {
    if (err) throw new Error("Cannot access task folder");
});

// Setup konList
if (!existsSync(konList)) writeFileSync(konList, "");

// TODO: Validate
const serverList = readFileSync(konList, "utf8")
    .split(/\r\n|\n|\r/)
    .filter((s) => validUrl.isWebUri(s))
    .map((kon) => new Judger(kon));

export default {
    judgers: serverList,
    tasks: taskFolder
};
