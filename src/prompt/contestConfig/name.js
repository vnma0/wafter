"use strict";

const Enquirer = require("enquirer");

const enquirer = new Enquirer();

/**
 * Contest name prompt
 */
async function namePrompt(init = {}) {
    const _name = init.name;
    const { name } = await enquirer.prompt({
        type: "input",
        name: "name",
        initial: _name,
        message: "Contest name:"
    });

    return { name };
}

module.exports = namePrompt;
