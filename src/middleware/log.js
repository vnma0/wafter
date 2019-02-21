const { createWriteStream } = require("fs");
const morgan = require("morgan");

const logToConsole = morgan("short", {
    skip: function(req, res) {
        return res.statusCode < 400;
    }
});

const logToFile = morgan("combined", {
    stream: createWriteStream("wafter.log", {
        flags: "a",
        encoding: "utf8"
    })
});

module.exports = { logToConsole, logToFile };
