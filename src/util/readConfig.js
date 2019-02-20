import { readFileSync } from "fs";

/**
 * Read Config File
 * @param {String} configFile File name
 */
function readConfig(configFile) {
    try {
        return JSON.parse(readFileSync(configFile, "utf8"));
    } catch (err) {
        throw new Error(`Cannot read config file: "${configFile}."`);
    }
}

export default readConfig;