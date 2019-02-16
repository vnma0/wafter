import Enquirer from "enquirer";
import addUser from "./prompt/addUser";

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
    try {
        while (res.main !== "Exit") {
            res = await mainPrompt();
            await mainChoices[res.main]();

            if (res.main === "Start server") {
                require("./server");
                return;
            }
        }
    } catch (err) {
        process.exit();
    }
    process.exit();
}

main();