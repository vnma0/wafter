"use strict";

const contestConfig = require("../util/config/contestConfig");

const contest = contestConfig.read();
contest.startTime = new Date(contest.startTime);
contest.endTime = new Date(contest.endTime);

module.exports = contest;
