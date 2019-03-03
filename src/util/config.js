"use strict";

const { readFileSync, writeFileSync, existsSync } = require("fs");

class ConfigObject {
    constructor(file, parse = (x) => x, sample = () => {}) {
        this.file = file;
        this.parse = parse;
        this.sample = sample;
    }
    genIfNotExist() {
        if (!existsSync(this.file)) this.write(this.sample());
    }
    read() {
        try {
            const rawData = readFileSync(this.file, "utf8");
            return this.parse(JSON.parse(rawData));
        } catch (err) {
            throw new Error(
                `Cannot read config file: "${this.file}": ${err.message}`
            );
        }
    }
    write(data) {
        let exportData = null;

        try {
            // Paraphrase data in JSON to strict type
            const jsonized = JSON.parse(JSON.stringify(data));
            const parsedData = this.parse(jsonized);
            exportData = JSON.stringify(parsedData, null, 4);
        } catch (err) {
            throw new Error(
                `Failed to parse config file "${this.file}": ${err.message}`
            );
        }

        try {
            return writeFileSync(this.file, exportData);
        } catch (err) {
            throw new Error(
                `Cannot write config file: "${this.file}": ${err.message}`
            );
        }
    }
    update(data) {
        const store = this.read();
        const updated = Object.assign(store, data);
        this.write(updated);
    }
}

module.exports = ConfigObject;
