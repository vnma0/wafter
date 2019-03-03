const Console = require("console");
const Enquirer = require("enquirer");

const time = require("./contestConfig/time");
const mode = require("./contestConfig/mode");
const name = require("./contestConfig/name");
const ace = require("./contestConfig/ace");
const probList = require("./contestConfig/probList");

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
        "Change allowed code languages": ace
    };

    const { choice } = await enquirer.prompt({
        type: "select",
        name: "choice",
        message: "Contest Options",
        choices: Object.keys(contestOptionsContainer)
    });

    return contestOptionsContainer[choice]().then(
        () => {
            Console.log("Contest's configuration saved");
        },
        (err) => {
            Console.log("Contest's configuration was not saved: ", err.message);
        }
    );
}

module.exports = contestOptionsPrompt;
