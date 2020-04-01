"use strict";

const Enquirer = require("enquirer");
const score = require("../../util/score");

const enquirer = new Enquirer();

/**
 * Contest mode prompt
 */
async function modePrompt(init = {}) {
    const _mode = Reflect.has(score, init.mode) ? init.mode : null;
    const { mode } = await enquirer.prompt({
        type: "select",
        name: "mode",
        message: "Contest mode:",
        initial: _mode,
        choices: Object.keys(score)
    });
    return { mode };
}

module.exports = modePrompt;
