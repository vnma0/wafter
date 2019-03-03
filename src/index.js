const Enquirer = require("enquirer");
const Console = require("console");

const addUser = require("./prompt/addUser");
const contestOptions = require("./prompt/contestOptions");
const KonOptions = require("./prompt/KonOptions");

require("./util/config/contestConfig").genIfNotExist();
require("./util/config/KonConfig").genIfNotExist();

const enquirer = new Enquirer();

const mainChoices = {
    "Start server": () => {},
    "Add user": addUser,
    "Contest options": contestOptions,
    "Kon's pair options": KonOptions,
    Exit: () => {}
};

/**
 * Main prompt
 */
async function mainPrompt() {
    return enquirer.prompt({
        type: "select",
        name: "main",
        message: "How can I help you ?",
        choices: Object.keys(mainChoices)
    });
}

/**
 * Main menu
 */
async function main() {
    let res = {};

    Console.log("MIRAI Wafter 1.0.0");
    Console.log("Copyright (c) 2018 Vườn ươm A0. MIT License.");
    try {
        while (res.main !== "Exit") {
            res = await mainPrompt();
            try {
                await mainChoices[res.main]();
            } catch (err) {
                Console.log(
                    `Exited to menu${err.message ? `: ${err.message}` : ""}`
                );
            }

            if (res.main === "Start server") {
                require("./server");
                return;
            }
        }
    } catch (err) {
        Console.log(err.message);
        process.exit();
    }
    process.exit();
}

main();
