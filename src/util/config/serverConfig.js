"use strict";

const uuidv4 = require("uuid/v4");

/**
 * Merge into base config custom config on valid
 * @param {Object} base
 * @param {Object} custom
 */
function mergeConfig(base, custom) {
    let ret = {};
    for (let prop in base) ret[prop] = custom[prop] || base[prop];
    return ret;
}

/**
 * Convert string boolean value into boolean
 * @param {String} str
 */
function toBoolean(str) {
    if (str === "true") return true;
    else if (str === "false") return false;
    else return undefined;
}

/**
 * Parse raw server config from env
 * @param {Config} config
 */
function parseServerConfig(config) {
    return {
        ...config,
        port: Number(config.port),
        disableBrutePrevent: toBoolean(config.disableBrutePrevent)
    };
}

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
            port: "3001",
            secret: "IloveCookie",
            disableBrutePrevent: "false"
        },
        production: {
            displayName: "Wafter - Themis Distributed Server",
            port: "80",
            secret: uuidv4(),
            disableBrutePrevent: "true"
        }
    };

    const envConfig =
        templateConfig[process.env.NODE_ENV] || templateConfig["production"];

    const customConfig = {
        displayName: process.env.SERVERNAME,
        port: process.env.PORT,
        secret: process.env.SECRET,
        disableBrutePrevent: process.env.DISABLE_BRUTE_PREVENT
    };

    const finalConfig = mergeConfig(envConfig, customConfig);

    return parseServerConfig(finalConfig);
}

module.exports = serverConfig;
