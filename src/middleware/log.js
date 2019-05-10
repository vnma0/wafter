"use struct";

const { createWriteStream } = require("fs");
const morgan = require("morgan");
const filenamify = require("filenamify");

const logToConsole = morgan("short", {
    skip: function(req, res) {
        return res.statusCode < 400;
    }
});

const logFileName =
    filenamify(`wafter-${new Date().toISOString()}`, {
        replacement: "_"
    }) + ".log";

const logToFile = morgan("combined", {
    stream: createWriteStream(logFileName, {
        flags: "a",
        encoding: "utf8"
    })
});

module.exports = { logToConsole, logToFile };
