const Console = require("console");
const Enquirer = require("enquirer");

const KonConfig = require("../util/config/KonConfig");

const add = require("./KonConfig/add");
const manage = require("./KonConfig/manage");

const enquirer = new Enquirer();

/**
 * Prompt for contest's option
 */
async function KonOptionsPrompt() {
    let KonOptionsContainer = {
        "Add Kon": add,
        "Manage Kon": manage
    };

    let KonOptionsChoices = [
        "Add Kon",
        { name: "Manage Kon", disabled: KonConfig.read().length === 0 }
    ];

    const { choice } = await enquirer.prompt({
        type: "select",
        name: "choice",
        message: "Kon's Pair Options",
        choices: KonOptionsChoices
    });
    const jsonized = JSON.parse(JSON.stringify(KonConfig.read()));
    return KonOptionsContainer[choice](jsonized)
        .then((newData) => {
            KonConfig.update(newData);
            Console.log("Kon's pair configuration saved");
        })
        .catch((err) => {
            Console.log(
                `Kon's pair configuration was not saved${
                    err.message ? `: ${err.message}` : ""
                }`
            );
        });
}

module.exports = KonOptionsPrompt;
