"use strict";

const Enquirer = require("enquirer");

const enquirer = new Enquirer();

/**
 * Kon management prompt
 */
async function manKonPrompt(init = []) {
    const cached = init.reduce((obj, kon) => {
        obj[kon.url] = kon;
        return obj;
    }, {});
    const _konList = init.map((x) => ({
        name: x.url,
        hint: x.prob && x.prob.length > 0 ? JSON.stringify(x.prob) : "*"
    }));
    const { konList } = await enquirer.prompt({
        type: "multiselect",
        name: "konList",
        message: "Manage Kon in use:",
        initial: _konList,
        choices: _konList
    });
    return konList.map((x) => cached[x]);
}

module.exports = manKonPrompt;
