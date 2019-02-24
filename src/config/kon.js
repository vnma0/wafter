"use strict";

const { existsSync, mkdirSync } = require("fs");

const KonConfig = require("../util/config/readKonConfig");

// Require valid folder to work
const taskFolder = "Tasks";

if (!existsSync(taskFolder)) mkdirSync(taskFolder);

module.exports = {
    judgers: KonConfig.config(),
    tasks: taskFolder
};
