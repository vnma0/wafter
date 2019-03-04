"use strict";

const Enquirer = require("enquirer");
const getNow = require("../../util/getNow");

const enquirer = new Enquirer();

const timeList = (() => {
    let now = getNow();
    const res = {};
    for (let i = 0; i < 48; ++i) {
        res[now.toLocaleString()] = new Date(now);
        now.setMinutes(now.getMinutes() + 5);
    }
    return res;
})();

const offSetList = (() => {
    let now = new Date(new Date().setHours(0, 0));
    const res = {};
    for (let i = 1; i <= 48; ++i) {
        now.setMinutes(now.getMinutes() + 15);
        let str = "";
        if (now.getHours() !== 0) str += now.getHours().toString() + " hr ";
        if (now.getMinutes() !== 0) str += now.getMinutes().toString() + " min";
        res[str.trim()] = i * 15 * 60 * 1000;
    }
    return res;
})();

/**
 * Change time prompt
 */
async function timePrompt() {
    const { startTime, endTime } = await enquirer
        .prompt([
            {
                type: "select",
                name: "startTime",
                message: "Start time:",
                choices: Object.keys(timeList),
                limit: 1,
                result: (val) => timeList[val]
            },
            {
                type: "select",
                name: "offset",
                message: "Duration:",
                choices: Object.keys(offSetList),
                limit: 1,
                result: (val) => offSetList[val]
            }
        ])
        .then((value) => {
            value.endTime = new Date(value.startTime.getTime() + value.offset);
            return {
                startTime: value.startTime.toJSON(),
                endTime: value.endTime.toJSON()
            };
        });

    return { startTime, endTime };
}

module.exports = timePrompt;
