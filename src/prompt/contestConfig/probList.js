"use strict";

const Enquirer = require("enquirer");

const enquirer = new Enquirer();

/**
 * Contest name prompt
 */
async function probListPrompt(init = {}) {
    let _probList = init.probList;
    const { probList } = await enquirer.prompt({
        type: "list",
        name: "probList",
        message: "Add problem to contest:"
    });
    _probList = _probList.concat(probList);
    return { probList: _probList };
}

module.exports = probListPrompt;
