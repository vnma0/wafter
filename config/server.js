import { readFileSync, existsSync, mkdirSync } from "fs";
import uuidv4 from "uuid/v4";

import score from "../util/score";

require("dotenv").config();

const staticFolder = "static";
if (!existsSync(staticFolder)) mkdirSync(staticFolder);

const contestConfig = "contest.json";

let name, startTime, endTime, mode, probList;

try {
    const contestObj = JSON.parse(readFileSync(contestConfig));
    ({ name, startTime, endTime, mode, probList } = contestObj);

    if (
        !Array.isArray(startTime) ||
        !Array.isArray(endTime) ||
        !Array.isArray(probList)
    )
        throw new Error();
    if (!name || !mode) throw new Error();
    if (!score.hasOwnProperty(mode)) throw new Error();

    startTime = new Date(...startTime);
    endTime = new Date(...endTime);

    if (startTime >= endTime) throw new Error();
} catch (err) {
    throw new Error("Invalid contest file. See contest.sample.json");
}

probList = probList.map((x) => String(x).toUpperCase());
const serverPORT = Number(process.env.PORT);

export default {
    displayName: process.env.SERVERNAME || "Wafter - Themis Distributed Server",
    port: isNaN(serverPORT) ? 3000 : serverPORT,
    secret: process.env.SECRET || uuidv4(),
    contest: {
        // Change this to config contest time
        name: name,
        startTime: startTime,
        endTime: endTime,
        mode: mode,
        probList: probList
    },
    staticFolder: staticFolder
};
