const Console = require("console");
const Enquirer = require("enquirer");

const contestConfig = require("../util/config/contestConfig");

const time = require("./contestConfig/time");
const mode = require("./contestConfig/mode");
const name = require("./contestConfig/name");
const ace = require("./contestConfig/ace");
const probList = require("./contestConfig/probList");
const manProbList = require("./contestConfig/manProbList");

const enquirer = new Enquirer();

/**
 * Prompt for contest's option
 */
async function contestOptionsPrompt() {
    let contestOptionsContainer = {
        "Change name": name,
        "Change time": time,
        "Change mode": mode,
        "Add problem": probList,
        "Manage problems": manProbList,
        "Change allowed code languages": ace
    };

    let contestOptionsChoices = [
        "Change name",
        "Change time",
        "Change mode",
        "Add problem",
        {
            name: "Manage problems",
            disabled: contestConfig.read().probList.length === 0
        },
        "Change allowed code languages"
    ];

    const { choice } = await enquirer.prompt({
        type: "select",
        name: "choice",
        message: "Contest Options",
        choices: contestOptionsChoices
    });

    return contestOptionsContainer[choice](contestConfig.read())
        .then((newData) => {
            contestConfig.update(newData);
            Console.log("Contest's configuration saved");
        })
        .catch((err) => {
            Console.log(
                `Contest's configuration was not saved${
                    err.message ? `: ${err.message}` : ""
                }`
            );
        });
}

module.exports = contestOptionsPrompt;
