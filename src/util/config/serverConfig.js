"use strict";

const uuidv4 = require("uuid/v4");

/**
 * Read Server config: .env
 */
function serverConfig() {
    require("dotenv").config();

    // TODO: Allow option to be be parsed as parameter in CLI
    // i.e: `--port 3002`

    const templateConfig = {
        development: {
            displayName: "Wafter - Development Build",
            port: 3001,
            secret: "IloveCookie"
        },
        production: {
            displayName: "Wafter - Themis Distributed Server",
            port: 80,
            secret: uuidv4()
        }
    };

    const config =
        templateConfig[process.env.NODE_ENV] || templateConfig["production"];

    const finalConfig = {
        displayName: process.env.SERVERNAME || config.displayName,
        port: process.env.PORT || config.port,
        secret: process.env.SECRET || config.secret
    };

    return finalConfig;
}

module.exports = serverConfig;
