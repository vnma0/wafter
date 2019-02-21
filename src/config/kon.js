"use strict";

const { existsSync, mkdirSync } = require("fs");

const KonConfig = require("../util/config/readKonConfig");

const konListFile = "kon.json";

// Require valid folder to work
const taskFolder = "Tasks";

if (!existsSync(konListFile)) mkdirSync(taskFolder);

module.exports = {
    judgers: KonConfig(konListFile),
    tasks: taskFolder
};
