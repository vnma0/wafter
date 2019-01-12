import { readFileSync, existsSync, writeFileSync } from "fs";
import { join } from "path";

import { cwd } from "./cwd";
import Judger from "../driver/kon";

const konList = join(cwd, ".konlist");

const taskFile = join(cwd, "Tasks.zip");

// Setup konList
if (!existsSync(konList)) writeFileSync(konList, "");

const serverList = readFileSync(konList, "utf8")
    .split(/\r\n|\n|\r/)
    .map((kon) => new Judger(kon));

export default {
    judgers: serverList,
    tasks: taskFile
};
