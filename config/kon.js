import Judger from "../driver/kon";
import { readFileSync, existsSync, writeFileSync } from "fs";

const konList = ".konlist";

// Setup konList
if (!existsSync(konList)) writeFileSync(konList);

const serverList = readFileSync(konList, "utf8")
    .split("\r\n")
    .map((kon) => new Judger(kon));

export default {
    judgers: serverList
};
