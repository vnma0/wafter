const path = require("path");
const { existsSync, mkdirSync } = require("fs");
const uuidv4 = require("uuid/v4");

require("dotenv").config();

const staticFolder = path.join(__dirname, "../public");
if (!existsSync(staticFolder)) mkdirSync(staticFolder);

const serverPORT = Number(process.env.PORT);

// TODO: Allow option to be be parsed as parameter in CLI
// i.e: `--port 3002`

module.exports = {
    displayName: process.env.SERVERNAME || "Wafter - Themis Distributed Server",
    port: isNaN(serverPORT) ? 3001 : serverPORT,
    secret: process.env.SECRET || uuidv4(),
    staticFolder: staticFolder
};
