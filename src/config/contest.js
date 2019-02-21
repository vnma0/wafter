"use strict";

const contestConfig = require("../util/config/readCtConfig");

const ctCfgFile = "contest.json";

module.exports = contestConfig(ctCfgFile);
