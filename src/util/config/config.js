"use strict";

const { readFileSync, writeFileSync, existsSync } = require("fs");

class ConfigObject {
    constructor(
        file,
        parse = (x) => x,
        sample = () => ({}),
        merge = Object.assign
    ) {
        this.file = file;
        this.parse = parse;
        this.sample = sample;
        this.merge = merge;
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
                `[${this.file}] Cannot read config file: ${err.message}`
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
            throw new Error(`Failed to parse data to write: ${err.message}`);
        }

        try {
            return writeFileSync(this.file, exportData);
        } catch (err) {
            throw new Error(
                `[${this.file}] Cannot write config file: ${err.message}`
            );
        }
    }
    update(data) {
        const store = this.read();
        const updated = this.merge(store, data);
        this.write(updated);
    }
}

module.exports = ConfigObject;
