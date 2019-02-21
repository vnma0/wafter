import { createWriteStream } from "fs";
import morgan from "morgan";

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

export { logToConsole, logToFile };
