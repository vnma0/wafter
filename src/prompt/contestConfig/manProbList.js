"use strict";

const Enquirer = require("enquirer");

const enquirer = new Enquirer();

/**
 * Contest name prompt
 */
async function probListPrompt(init = {}) {
    let _probList = init.probList;
    const { probList } = await enquirer.prompt({
        type: "multiselect",
        name: "probList",
        message: "Manage problems in contest:",
        initial: _probList,
        choices: _probList
    });
    return { probList };
}

module.exports = probListPrompt;
