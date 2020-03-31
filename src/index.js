// const { Select } = require("enquirer");
const Console = require("console");

require("./util/config/contestConfig").genIfNotExist();
const VERSION = require("./config/version");

const server = require("./server");
// const contestOptions = require("./prompt/contestOptions");
// const addUser = require("./prompt/addUser");

/**
 * Main procedure
 * Used for logging diagnostic info
 */
function main() {
    process.title = "MIRAI Wafter " + VERSION;
    Console.log("MIRAI Wafter " + VERSION);
    Console.log("Copyright (c) 2018-2020 Vườn ươm A0. MIT License.");
    Console.log({
        wafter: process.versions.wafter,
        node: process.versions.node,
        v8: process.versions.v8,
        platform: process.platform,
        arch: process.arch
    });

    // TODO: Add OOBE

    server();
}

main();
