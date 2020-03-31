"use strict";

const path = require("path");
const { v4: uuidv4 } = require("uuid");

const serverConfig = require("../util/config/serverConfig");

const staticFolder = path.join(__dirname, "../../public");

const serverCfg = Object.assign(serverConfig(), {
    secret: uuidv4(),
    staticFolder: staticFolder
});

module.exports = serverCfg;
