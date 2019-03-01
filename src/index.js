const Enquirer = require("enquirer");
const Console = require("console");
const server = require("./server");
const addUser = require("./prompt/addUser");

const enquirer = new Enquirer();

const mainChoices = {
    "Start server": () => {},
    "Add user": () => addUser(),
    Exit: () => {}
};

/**
 * Main prompt
 */
async function mainPrompt() {
    return enquirer.prompt({
        type: "autocomplete",
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
            await mainChoices[res.main]();

            if (res.main === "Start server") {
                server();
                return;
            }
        }
    } catch (err) {
        Console.log(err.message);
    }
    process.exit();
}

main();
