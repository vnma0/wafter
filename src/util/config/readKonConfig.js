import { readFileSync, existsSync, writeFileSync } from "fs";

import validUrl from "valid-url";

import Judger from "../../driver/kon";
import parseProbList from "../parseProbList";
import readConfig from "../readConfig";

/**
 * Read kon config
 * @param {String} konListFile Filename
 */
function KonConfig(konListFile) {
    try {
        // Setup konList
        if (!existsSync(konListFile)) writeFileSync(konListFile, "[]");

        let rawServerList = readConfig(konListFile);

        const konList = rawServerList
            .filter((kon) => validUrl.isWebUri(kon.url))
            .map((kon) => new Judger(kon.url, parseProbList(kon.prob)));

        return konList;
    } catch (err) {
        throw new Error("Cannot read Kon Config");
    }
}

export default KonConfig;
