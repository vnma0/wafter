const Console = require("console");
const { readFileSync, existsSync } = require("fs");
const { extname } = require("path");
const Enquirer = require("enquirer");
const neatCsv = require("neat-csv");

const { newUser } = require("../controller/database");
const { isPassword, isUsername } = require("../util/userValid");

const enquirer = new Enquirer();

/**
 * Import array of UserData { username, password, isAdmin }
 * @param {Array<Object>} data
 */
async function ImportUserData(data) {
    return Promise.all(
        data.map((a) =>
            newUser(a.username, a.password, a.isAdmin).then(
                () =>
                    Console.log(
                        `Added ${JSON.stringify(a.username)} ${
                            a.isAdmin ? "[Admin]" : "[User]"
                        }`
                    ),
                (err) =>
                    Console.log(
                        `Failed to add ${JSON.stringify(a.username)}: ${
                            err.message
                        }`
                    )
            )
        )
    );
}

/**
 * Import data file prompt
 */
async function ImportUserFilePrompt(ext, parseFun) {
    const { sourceFile } = await enquirer.prompt([
        {
            type: "input",
            name: "sourceFile",
            message: `Locate ${ext} file`,
            validate: (path) => existsSync(path) && extname(path) === ext
        }
    ]);
    const fileBlob = readFileSync(sourceFile, "utf8");
    return parseFun(fileBlob).then(ImportUserData);
}

/**
 * Add user manually via CLI
 */
async function addUserManually() {
    const { username, password, isAdmin } = await enquirer.prompt([
        {
            type: "input",
            name: "username",
            message: "Username",
            validate: isUsername
        },
        {
            type: "invisible",
            name: "password",
            message: "Password",
            validate: isPassword
        },
        {
            type: "confirm",
            name: "isAdmin",
            message: "isAdmin?"
        }
    ]);

    return newUser(username, password, isAdmin).catch((e) =>
        Console.log("Error: ", e.message)
    );
}

/**
 * Add user prompt
 */
async function addUserPrompt() {
    let userChoicesContainer = {
        "Import from CSV": () => ImportUserFilePrompt(".csv", neatCsv),
        "Import from JSON": () => ImportUserFilePrompt(".json", JSON.parse),
        "Add manually": () => addUserManually()
    };
    const { addChoice } = await enquirer.prompt([
        {
            type: "autocomplete",
            name: "addChoice",
            message: "How do you want to add ?",
            choices: Object.keys(userChoicesContainer)
        }
    ]);

    return userChoicesContainer[addChoice]();
}

module.exports = addUserPrompt;
