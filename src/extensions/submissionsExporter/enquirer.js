const console = require("console");
const enquirer = new (require("enquirer"))();

module.exports = async () => {
    console.log("Wafter will attempt to export all submissions with the metadata found in \x1b[32m%s\x1b[0m and \x1b[32m%s\x1b[0m.", "data/submissions.db", "data/users.db");

    console.log("Each submission will have its filename in the form of");
    console.log("\n\t\x1b[33m%s\x1b[0m_\x1b[34m%s\x1b[0m_\x1b[36m%s\x1b[0m_\x1b[31m%s\x1b[0m\n", "<random hash>", "<username/user ID>", "<verdict>", "<extension>");
    console.log("A metadata file, named");
    console.log("\n\t\x1b[33m%s\x1b[0m.log.json\n", "<submission's random hash>");
    console.log("would also be generated with each submission.\n");

    console.log("Any submission that has their respective file in \x1b[32m%s\x1b[0m deleted will be ignored.", "upload/");
    console.log("The metadata file for that submission would still be generated.");

    const { isVerbose } = await enquirer.prompt([
        {
            type: "confirm",
            name: "isVerbose",
            message: "Run in verbose mode?"
        }
    ]);

    return await require("./exporter.js")(isVerbose);
};