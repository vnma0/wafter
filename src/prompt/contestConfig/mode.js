"use strict";

const Enquirer = require("enquirer");
const contestConfig = require("../../util/config/contestConfig");
const score = require("../../util/score");

const enquirer = new Enquirer();

/**
 * Contest mode prompt
 */
async function modePrompt() {
    const { mode } = await enquirer.prompt({
        type: "select",
        name: "mode",
        message: "Contest mode:",
        choices: Object.keys(score)
    });

    contestConfig.update({ mode });
}

module.exports = modePrompt;
