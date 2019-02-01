import Enquirer from "enquirer";
import addUser from "./prompt/addUser";

const enquirer = new Enquirer();

/**
 * Main prompt
 */
async function mainPrompt() {
    return enquirer.prompt({
        type: "autocomplete",
        name: "main",
        message: "How can I help you ?",
        choices: ["Start server", "Add user", "Exit"]
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
            if (res.main === "Add user") {
                await addUser();
                // C:\Users\ntdde\Downloads\Book1.csv
            }
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
