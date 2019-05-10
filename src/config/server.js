"use strict";

const path = require("path");
const { existsSync, mkdirSync, writeFileSync } = require("fs");
const uuidv4 = require("uuid/v4");

const serverConfig = require("../util/config/serverConfig");

const staticFolder = path.join(__dirname, "../../public");
if (!existsSync(staticFolder)) mkdirSync(staticFolder);
const sampleHTML =
    "<!DOCTYPE html><html><body>Wafter is running as an API server only</body></html>";
if (!existsSync(staticFolder + "/index.html"))
    writeFileSync(staticFolder + "/index.html", sampleHTML);

const serverCfg = Object.assign(serverConfig(), {
    secret: uuidv4(),
    staticFolder: staticFolder
});

// TODO: Allow option to be be parsed as parameter in CLI
// i.e: `--port 3002`

module.exports = serverCfg;
