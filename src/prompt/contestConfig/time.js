"use strict";

const Enquirer = require("enquirer");

const enquirer = new Enquirer();

const validateTime = (timeStr) => {
    return new Date(timeStr).toJSON() === timeStr;
};

const getDate = (() => {
    const now = new Date();
    now.setMilliseconds(0);
    now.setSeconds(0);
    now.setMinutes((Math.ceil(now.getMinutes() / 15) + 1) * 15);
    return now;
})();

const prompt = enquirer.prompt({
    type: "form",
    name: "contest",
    message: "Please provide the following information:",
    choices: [
        { name: "name", message: "Contest name:" },
        {
            name: "startTime",
            message: "Start time:",
            initial: getDate.toJSON(),
            validate: validateTime
        },
        {
            name: "endTime",
            message: "End time:",
            initial: getDate.toJSON(),
            validate: validateTime
        }
    ]
});

prompt
    .then((value) => {
        return value;
    })
    .then(console.log)
    .catch(console.error);
