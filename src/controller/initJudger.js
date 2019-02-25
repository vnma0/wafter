"use strict";

const zipdir = require("zip-dir");
const isZip = require("is-zip");
const Console = require("console");
const kon = require("../config/kon");

/**
 * Zip task folder then send it to Judgers
 */
function initJudger() {
    const arcPath = "Tasks.zip";
    zipdir(kon.tasks, { saveTo: arcPath }, (err, buf) => {
        if (err) throw err;
        if (!isZip(buf)) throw Error("Invalid folder");
        kon.judgers.forEach((judger) => {
            judger
                .clone(arcPath)
                .then((res) => {
                    if (!res.status === 200)
                        throw Error("Kon isn't return 200");
                    Console.log(`Sucessfully cloned ${judger.serverAddress}`);
                })
                .catch((err) => {
                    Console.log(
                        `Failed to clone ${judger.serverAddress}: ${
                            err.message
                        }`
                    );
                });
        });
    });
}

module.exports = initJudger;
