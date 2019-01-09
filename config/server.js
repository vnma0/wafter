import { readFileSync } from "fs";

// TODO: Add more configuration options
// TODO: Import from .env

const contestConfig = "contest.json";

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
    displayName: "Wafter - Themis Distributed Server",
    port: 3000,
    secret: process.env.SECRET || "UUIDGoesHere",
    contest: {
        // Change this to config contest time
        name,
        startTime: new Date(...startTime),
        endTime: new Date(...endTime)
    }
};
