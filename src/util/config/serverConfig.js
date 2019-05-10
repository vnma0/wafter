"use strict";

/**
 * Read Server config: .env
 * Comes with specified config
 */
function serverConfig() {
    require("dotenv").config();

    // TODO: Allow option to be be parsed as parameter in CLI
    // i.e: `--port 3002`

    const templateConfig = {
        development: {
            port: "3001"
        },
        production: {
            port: "80"
        }
    };

    const envConfig =
        templateConfig[process.env.NODE_ENV] || templateConfig["development"];

    const customConfig = {
        port: process.env.PORT
    };

    const finalConfig = Object.assign(envConfig, customConfig);

    return finalConfig;
}

module.exports = serverConfig;
