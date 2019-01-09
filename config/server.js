import { readFileSync } from "fs";
import uuidv4 from "uuid/v4";

require("dotenv").config();

export const contestConfig = "contest.json";

let contestObj = {};
let name, startTime, endTime;

try {
    contestObj = JSON.parse(readFileSync(contestConfig));
    ({ name, startTime, endTime } = contestObj);
    if (!Array.isArray(startTime) && !Array.isArray(endTime)) throw new Error();
} catch (err) {
    throw new Error("Invalid contest file. See contest.sample.json");
}

export default {
    displayName: process.env.SERVERNAME || "Wafter - Themis Distributed Server",
    port: process.env.PORT || 3000,
    secret: process.env.SECRET || uuidv4(),
    contest: {
        // Change this to config contest time
        name,
        startTime: new Date(...startTime),
        endTime: new Date(...endTime)
    }
};
