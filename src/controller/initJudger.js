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
                    if (res.status === 403)
                        Console.log(`Kon was in used. ${judger.serverAddress}`);
                    else if (res.status === 500)
                        Console.log(
                            `Kon failed to process. ${judger.serverAddress}`
                        );
                    else if (res.status === 200)
                        Console.log(
                            `Sucessfully cloned ${judger.serverAddress}`
                        );
                    else throw Error("Kon did not respond");
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
