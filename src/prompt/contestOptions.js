const Console = require("console");
const Enquirer = require("enquirer");

const time = require("./contestConfig/time");

const enquirer = new Enquirer();

/**
 * Prompt for contest's option
 */
async function contestOptionsPrompt() {
    let contestOptionsContainer = {
        "Change time": time
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
        () => {
            Console.log("Contest's configuration was not saved :(");
        }
    );
}

module.exports = contestOptionsPrompt;
