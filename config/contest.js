import { readFileSync } from "fs";
import score from "../util/score";

const contestConfig = "contest.json";

let name, startTime, endTime, mode, probList, acceptMIME;

try {
    const contestObj = JSON.parse(readFileSync(contestConfig));
    ({ name, startTime, endTime, mode, probList, acceptMIME } = contestObj);

    // TODO: Move condition outside ?
    if (acceptMIME === undefined)
        acceptMIME = [
            "text/x-c",
            "text/x-pascal",
            "text/x-java-source",
            "text/x-script.python"
        ];

    if (
        !Array.isArray(startTime) ||
        !Array.isArray(endTime) ||
        !Array.isArray(probList) ||
        !Array.isArray(acceptMIME)
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

export default {
    // Change this to config contest time
    name: name,
    startTime: startTime,
    endTime: endTime,
    mode: mode,
    probList: probList,
    acceptMIME: acceptMIME
}