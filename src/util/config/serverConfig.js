"use strict";

const uuidv4 = require("uuid/v4");

/**
 * Read Server config: .env
 */
function serverConfig() {
    require("dotenv").config();

    // TODO: Allow option to be be parsed as parameter in CLI
    // i.e: `--port 3002`
    const serverPORT = Number(process.env.PORT);
    return {
        displayName:
            process.env.SERVERNAME || "Wafter - Themis Distributed Server",
        port: isNaN(serverPORT) ? 3001 : serverPORT,
        secret: process.env.SECRET || uuidv4()
    };
}

module.exports = serverConfig;
