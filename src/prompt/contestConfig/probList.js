"use strict";

const Enquirer = require("enquirer");
const contestConfig = require("../../util/config/contestConfig");

const enquirer = new Enquirer();

/**
 * Contest name prompt
 */
async function probListPrompt() {
    let _probList = contestConfig.read().probList;
    const { probList } = await enquirer.prompt({
        type: "list",
        name: "probList",
        message: "Add problem to contest:"
    });
    _probList = _probList.concat(probList);
    contestConfig.update({ probList: _probList });
}

module.exports = probListPrompt;
