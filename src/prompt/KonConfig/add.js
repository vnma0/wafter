"use strict";

const Enquirer = require("enquirer");
const validUrl = require("valid-url");
const Judger = require("../../driver/kon");
const contestConfig = require("../../util/config/contestConfig");

const enquirer = new Enquirer();

/**
 * Kon addition prompt
 */
async function addKonPrompt() {
    const _probList = contestConfig.read().probList;
    const { url, prob } = await enquirer.prompt([
        {
            type: "input",
            name: "url",
            message: "URL",
            // hint: "http:// or https:// url",
            validate: (val) => !!validUrl.isWebUri(val)
        },
        {
            type: "multiselect",
            name: "prob",
            message: "Problems handled by this Kon",
            hint: "If none are chosen, Wafter will understand Kon accept all",
            choices: _probList
        }
    ]);
    return [{ url, prob }];
}

module.exports = addKonPrompt;
