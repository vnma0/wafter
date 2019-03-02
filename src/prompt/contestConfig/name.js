"use strict";

const Enquirer = require("enquirer");
const contestConfig = require("../../util/config/contestConfig");

const enquirer = new Enquirer();

/**
 * Contest name prompt
 */
async function namePrompt() {
    const { name } = await enquirer.prompt({
        type: "input",
        name: "name",
        message: "Contest name:"
    });

    contestConfig.update({ name });
}

module.exports = namePrompt;
