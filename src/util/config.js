"use strict";

const { readFileSync } = require("fs");
const { writeFileSync } = require("fs");

class ConfigObject {
    constructor(file, parse = (x) => x, sample = () => {}) {
        this.file = file;
        this.parse = parse;
        this.sample = sample;
    }
    genIfNotExist() {
        this.write(this.sample());
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
        try {
            const parsedData = JSON.stringify(this.parse(data), null, 4);
            return writeFileSync(this.file, parsedData);
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
