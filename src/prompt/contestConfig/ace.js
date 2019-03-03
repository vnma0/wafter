"use strict";

const Enquirer = require("enquirer");

const enquirer = new Enquirer();

/**
 * Contest name prompt
 */
async function acePrompt(init = {}) {
    let _ace = init.allowedCodeExt;

    // Temporary solution: create list of language, then filter non-included
    const langList = [".C", ".CPP", ".JAVA", ".KT", ".PAS", ".PY"];
    const initAce = langList.filter((x) => _ace.indexOf(x) > -1);
    const leftAce = _ace.filter((x) => langList.indexOf(x) === -1);
    const { ace } = await enquirer.prompt({
        type: "multiselect",
        name: "ace",
        message: "Set allowed code extension",
        hint: "Use <space> to select, <return> to submit",
        initial: initAce,
        choices: [
            { name: ".C", hint: "- C" },
            { name: ".CPP", hint: "- C++" },
            { name: ".JAVA", hint: "- Java" },
            { name: ".KT", hint: "- Kotlin" },
            { name: ".PAS", hint: "- Pascal" },
            { name: ".PY", hint: "- Python" }
        ]
    });
    return { allowedCodeExt: ace.concat(leftAce) };
}

module.exports = acePrompt;
